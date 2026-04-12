# Blender-Like 3D Modeler

This plugin scaffolds a Codex workflow for prompt-and-photo guided 3D model generation.

What is included:
- A plugin manifest wired to the local `skills/`, `.mcp.json`, and `.app.json` paths.
- A built-in skill for planning prompt-and-photo to 3D jobs.
- A starter Python script that turns a prompt and reference photos into a structured job spec.

What is not included:
- A real 3D generation backend.
- Blender automation.
- Any guarantee of "99.99% accuracy". Fidelity depends on the provider, source images, lighting, occlusion, and post-processing.

Suggested backend options:
- `TRELLIS` or `Hunyuan3D-2` for open pipelines.
- `Meshy` or `Tripo` for hosted prompt/photo-to-3D generation.
- Blender for retopo, UV cleanup, material fixes, and export.

Quick start:

```bash
python3 ./scripts/create_3d_job.py \
  --prompt "Game-ready leather chair" \
  --image ./references/chair-front.jpg \
  --image ./references/chair-side.jpg \
  --style photoreal \
  --format glb
```

The command writes a JSON job spec under `./jobs/` that you can hand to a real backend or adapt into an MCP server later.
