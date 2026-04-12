#!/usr/bin/env node

import "dotenv/config"
import fs from "node:fs/promises"
import path from "node:path"
import readline from "node:readline/promises"
import { stdin as input, stdout as output } from "node:process"
import OpenAI from "openai"
import { chromium } from "playwright"

const MODEL = process.env.OPENAI_MODEL || "gpt-4.1-mini"
const BASE_URL = process.env.OPENAI_BASE_URL
const API_KEY = process.env.OPENAI_API_KEY || "local-dev-key"
const HEADLESS = process.env.HEADLESS === "true"
const PROFILE_DIR = path.resolve(
  process.cwd(),
  process.env.CHROME_PROFILE_DIR || ".chrome-agent-profile",
)
const OUTPUT_DIR = path.resolve(process.cwd(), "agent-output")

const SYSTEM_PROMPT = `
You are a local Chrome control agent.

Your job is to help the user by operating a local Chrome browser through tools.
Act carefully, keep the user informed, and prefer reliable page interactions.

Rules:
- If the browser is not open, call open_browser first.
- Prefer describe_page before making assumptions about a page.
- Use selectors when they are clear. Use text-based actions when a selector is not available.
- Never confirm an order, payment, deletion, sign-out, publish, or final form submission unless the user explicitly asked for that exact irreversible action in the current turn.
- When blocked by login, captcha, or 2FA, explain the blocker clearly.
- Keep answers short and practical.
`

const TOOLS = [
  {
    type: "function",
    function: {
      name: "open_browser",
      description: "Launch a local Chrome browser session and optionally open a URL.",
      parameters: {
        type: "object",
        properties: {
          url: { type: "string", description: "Optional URL to open after launch." },
        },
        additionalProperties: false,
      },
    },
  },
  {
    type: "function",
    function: {
      name: "goto",
      description: "Navigate the active tab to a URL.",
      parameters: {
        type: "object",
        properties: {
          url: { type: "string" },
        },
        required: ["url"],
        additionalProperties: false,
      },
    },
  },
  {
    type: "function",
    function: {
      name: "describe_page",
      description: "Read the current page and return a compact summary with actionable elements.",
      parameters: {
        type: "object",
        properties: {},
        additionalProperties: false,
      },
    },
  },
  {
    type: "function",
    function: {
      name: "click",
      description: "Click an element by CSS selector or visible text.",
      parameters: {
        type: "object",
        properties: {
          selector: { type: "string" },
          text: { type: "string" },
        },
        additionalProperties: false,
      },
    },
  },
  {
    type: "function",
    function: {
      name: "type_text",
      description: "Type into an input, textarea, or contenteditable element.",
      parameters: {
        type: "object",
        properties: {
          selector: { type: "string" },
          text: { type: "string", description: "Visible text near the target field." },
          value: { type: "string", description: "The text to enter." },
          clearFirst: { type: "boolean" },
        },
        required: ["value"],
        additionalProperties: false,
      },
    },
  },
  {
    type: "function",
    function: {
      name: "press_key",
      description: "Press a keyboard key such as Enter, Tab, Escape, ArrowDown, or Meta+L.",
      parameters: {
        type: "object",
        properties: {
          key: { type: "string" },
        },
        required: ["key"],
        additionalProperties: false,
      },
    },
  },
  {
    type: "function",
    function: {
      name: "scroll_page",
      description: "Scroll the active page.",
      parameters: {
        type: "object",
        properties: {
          direction: { type: "string", enum: ["up", "down"] },
          amount: { type: "number", description: "Pixel distance. Defaults to 700." },
        },
        required: ["direction"],
        additionalProperties: false,
      },
    },
  },
  {
    type: "function",
    function: {
      name: "wait_for_text",
      description: "Wait until visible text appears on the page.",
      parameters: {
        type: "object",
        properties: {
          text: { type: "string" },
          timeoutMs: { type: "number" },
        },
        required: ["text"],
        additionalProperties: false,
      },
    },
  },
  {
    type: "function",
    function: {
      name: "screenshot",
      description: "Save a screenshot of the current page into agent-output.",
      parameters: {
        type: "object",
        properties: {
          name: { type: "string" },
          fullPage: { type: "boolean" },
        },
        additionalProperties: false,
      },
    },
  },
]

function trimText(text, max = 3200) {
  const normalized = (text || "").replace(/\s+/g, " ").trim()
  if (normalized.length <= max) {
    return normalized
  }
  return `${normalized.slice(0, max)}...`
}

function toolResult(data) {
  return JSON.stringify(data, null, 2)
}

class BrowserAgent {
  constructor() {
    this.context = null
    this.page = null
  }

  async ensureOutputDir() {
    await fs.mkdir(OUTPUT_DIR, { recursive: true })
  }

  async ensureBrowser(url) {
    if (!this.context) {
      await this.ensureOutputDir()
      await fs.mkdir(PROFILE_DIR, { recursive: true })

      let lastError = null
      const launchOptions = {
        headless: HEADLESS,
        viewport: { width: 1440, height: 960 },
      }

      try {
        this.context = await chromium.launchPersistentContext(PROFILE_DIR, {
          ...launchOptions,
          channel: "chrome",
        })
      } catch (error) {
        lastError = error
        if (process.env.CHROME_PATH) {
          this.context = await chromium.launchPersistentContext(PROFILE_DIR, {
            ...launchOptions,
            executablePath: process.env.CHROME_PATH,
          })
        } else {
          throw new Error(
            `Failed to launch Chrome. Install Chrome or set CHROME_PATH. Original error: ${lastError.message}`,
          )
        }
      }

      this.context.on("page", (page) => {
        this.page = page
      })

      this.page = this.context.pages()[0] || (await this.context.newPage())
    }

    if (url) {
      await this.page.goto(url, { waitUntil: "domcontentloaded" })
    }

    return this.describePage()
  }

  async requirePage() {
    if (!this.page) {
      await this.ensureBrowser()
    }
  }

  findLocator({ selector, text }) {
    if (selector) {
      return this.page.locator(selector).first()
    }
    if (text) {
      return this.page.getByText(text, { exact: false }).first()
    }
    throw new Error("A selector or text target is required.")
  }

  async describePage() {
    await this.requirePage()

    const title = await this.page.title()
    const url = this.page.url()
    const text = await this.page.locator("body").innerText().catch(() => "")
    const actionable = await this.page.evaluate(() => {
      const clean = (value) => (value || "").replace(/\s+/g, " ").trim()
      const nodes = Array.from(
        document.querySelectorAll("a, button, input, textarea, select, [role='button']"),
      )
        .slice(0, 30)
        .map((element) => ({
          tag: element.tagName.toLowerCase(),
          text: clean(element.textContent || element.getAttribute("aria-label") || ""),
          id: element.id || null,
          name: element.getAttribute("name"),
          type: element.getAttribute("type"),
          placeholder: element.getAttribute("placeholder"),
        }))

      return nodes.filter((entry) => entry.text || entry.id || entry.name || entry.placeholder)
    })

    return toolResult({
      title,
      url,
      text: trimText(text, 2500),
      actionable,
    })
  }

  async goto({ url }) {
    await this.requirePage()
    await this.page.goto(url, { waitUntil: "domcontentloaded" })
    return this.describePage()
  }

  async click(args) {
    await this.requirePage()
    const locator = this.findLocator(args)
    await locator.click({ timeout: 10000 })
    await this.page.waitForLoadState("domcontentloaded").catch(() => {})
    return this.describePage()
  }

  async typeText({ selector, text, value, clearFirst = true }) {
    await this.requirePage()
    const locator = this.findLocator({ selector, text })
    await locator.click({ timeout: 10000 })

    if (clearFirst) {
      await locator.fill("")
    }

    await locator.fill(value)
    return this.describePage()
  }

  async pressKey({ key }) {
    await this.requirePage()
    await this.page.keyboard.press(key)
    await this.page.waitForLoadState("domcontentloaded").catch(() => {})
    return this.describePage()
  }

  async scrollPage({ direction, amount = 700 }) {
    await this.requirePage()
    const delta = direction === "up" ? -Math.abs(amount) : Math.abs(amount)
    await this.page.evaluate((scrollDelta) => {
      window.scrollBy({ top: scrollDelta, behavior: "instant" })
    }, delta)
    return this.describePage()
  }

  async waitForText({ text, timeoutMs = 15000 }) {
    await this.requirePage()
    await this.page.getByText(text, { exact: false }).first().waitFor({ timeout: timeoutMs })
    return this.describePage()
  }

  async screenshot({ name, fullPage = true } = {}) {
    await this.requirePage()
    await this.ensureOutputDir()

    const safeName = (name || `shot-${Date.now()}`)
      .replace(/[^a-zA-Z0-9-_]+/g, "-")
      .replace(/^-+|-+$/g, "")
    const filePath = path.join(OUTPUT_DIR, `${safeName || "shot"}.png`)

    await this.page.screenshot({ path: filePath, fullPage })

    return toolResult({
      savedTo: filePath,
      url: this.page.url(),
    })
  }

  async close() {
    if (this.context) {
      await this.context.close()
    }
  }
}

function parseArgs(raw) {
  if (!raw) {
    return {}
  }
  try {
    return JSON.parse(raw)
  } catch (error) {
    throw new Error(`Invalid tool arguments: ${error.message}`)
  }
}

async function runTurn({ client, browserAgent, messages }) {
  for (let i = 0; i < 12; i += 1) {
    const completion = await client.chat.completions.create({
      model: MODEL,
      temperature: 0.2,
      messages,
      tools: TOOLS,
    })

    const message = completion.choices[0]?.message
    if (!message) {
      throw new Error("The model returned an empty response.")
    }

    if (!message.tool_calls?.length) {
      const text = message.content || "Done."
      messages.push({ role: "assistant", content: text })
      return text
    }

    messages.push(message)

    for (const call of message.tool_calls) {
      const args = parseArgs(call.function.arguments)
      let content = ""

      process.stdout.write(`\n[tool] ${call.function.name}\n`)

      try {
        switch (call.function.name) {
          case "open_browser":
            content = await browserAgent.ensureBrowser(args.url)
            break
          case "goto":
            content = await browserAgent.goto(args)
            break
          case "describe_page":
            content = await browserAgent.describePage()
            break
          case "click":
            content = await browserAgent.click(args)
            break
          case "type_text":
            content = await browserAgent.typeText(args)
            break
          case "press_key":
            content = await browserAgent.pressKey(args)
            break
          case "scroll_page":
            content = await browserAgent.scrollPage(args)
            break
          case "wait_for_text":
            content = await browserAgent.waitForText(args)
            break
          case "screenshot":
            content = await browserAgent.screenshot(args)
            break
          default:
            throw new Error(`Unsupported tool: ${call.function.name}`)
        }
      } catch (error) {
        content = toolResult({ error: error.message })
      }

      messages.push({
        role: "tool",
        tool_call_id: call.id,
        content,
      })
    }
  }

  throw new Error("The agent hit the tool-call limit for this turn.")
}

async function main() {
  if (!BASE_URL && !process.env.OPENAI_API_KEY) {
    console.error("Set OPENAI_API_KEY in .env, or use OPENAI_BASE_URL with an OpenAI-compatible local server.")
    process.exit(1)
  }

  const client = new OpenAI({
    apiKey: API_KEY,
    baseURL: BASE_URL,
  })

  const browserAgent = new BrowserAgent()
  const rl = readline.createInterface({ input, output })
  const messages = [
    { role: "system", content: SYSTEM_PROMPT },
    {
      role: "system",
      content: `Current local time: ${new Date().toString()}`,
    },
  ]

  console.log(`Chrome Agent ready.`)
  console.log(`Model: ${MODEL}`)
  console.log(`Profile: ${PROFILE_DIR}`)
  console.log(`Type a task, or type "exit" to quit.`)

  try {
    for (;;) {
      const userInput = await rl.question("\nYou: ")
      const trimmed = userInput.trim()

      if (!trimmed) {
        continue
      }

      if (trimmed.toLowerCase() === "exit") {
        break
      }

      messages.push({ role: "user", content: trimmed })

      try {
        const answer = await runTurn({ client, browserAgent, messages })
        console.log(`\nAgent: ${answer}`)
      } catch (error) {
        const message = `I hit an error: ${error.message}`
        messages.push({ role: "assistant", content: message })
        console.log(`\nAgent: ${message}`)
      }
    }
  } finally {
    rl.close()
    await browserAgent.close()
  }
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
