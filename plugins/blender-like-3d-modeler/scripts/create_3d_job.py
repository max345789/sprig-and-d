#!/usr/bin/env python3
"""Create a structured prompt-and-photo 3D generation job spec."""

from __future__ import annotations

import argparse
import json
import re
from datetime import datetime, timezone
from pathlib import Path


DEFAULT_PROVIDER_CANDIDATES = ["TRELLIS", "Hunyuan3D-2", "Meshy", "Tripo"]
DEFAULT_QUALITY_CHECKS = [
    "silhouette matches prompt and references",
    "materials follow the requested style",
    "mesh is watertight where expected",
    "normals are consistent",
    "export opens cleanly in Blender",
]


def slugify(value: str) -> str:
    value = value.strip().lower()
    value = re.sub(r"[^a-z0-9]+", "-", value)
    value = re.sub(r"-{2,}", "-", value).strip("-")
    return value or "model"


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description="Create a JSON job spec for prompt-and-photo 3D model generation."
    )
    parser.add_argument("--prompt", required=True, help="Primary text prompt for the 3D model")
    parser.add_argument(
        "--image",
        action="append",
        default=[],
        help="Reference image path. Pass multiple times for more views.",
    )
    parser.add_argument(
        "--negative-prompt",
        default="",
        help="Optional negative prompt for things the model should avoid",
    )
    parser.add_argument("--style", default="photoreal", help="Target style")
    parser.add_argument("--format", default="glb", help="Target export format")
    parser.add_argument("--provider", default="", help="Preferred backend provider")
    parser.add_argument("--poly-budget", default="", help="Optional triangle or poly budget")
    parser.add_argument(
        "--output-dir",
        default="./jobs",
        help="Directory where the JSON job spec should be written",
    )
    return parser.parse_args()


def resolve_images(image_args: list[str]) -> list[str]:
    resolved: list[str] = []
    for image in image_args:
        path = Path(image).expanduser().resolve()
        if not path.exists():
            raise FileNotFoundError(f"Reference image not found: {path}")
        resolved.append(str(path))
    return resolved


def build_job_spec(args: argparse.Namespace, reference_images: list[str]) -> dict:
    now = datetime.now(timezone.utc)
    prompt_slug = slugify(args.prompt)[:40]
    job_id = f"{prompt_slug}-{now.strftime('%Y%m%dT%H%M%SZ')}"
    provider_candidates = (
        [args.provider] if args.provider else DEFAULT_PROVIDER_CANDIDATES
    )

    return {
        "jobId": job_id,
        "createdAt": now.isoformat(),
        "input": {
            "prompt": args.prompt,
            "negativePrompt": args.negative_prompt,
            "referenceImages": reference_images,
            "style": args.style,
            "targetFormat": args.format,
            "preferredProvider": args.provider or None,
            "polyBudget": args.poly_budget or None,
        },
        "pipeline": [
            {
                "step": "reference-preflight",
                "checks": [
                    "verify image sharpness",
                    "check object coverage across views",
                    "identify missing hidden surfaces",
                ],
            },
            {
                "step": "geometry-generation",
                "providerCandidates": provider_candidates,
                "notes": [
                    "prefer multi-view generation when multiple photos are available",
                    "fall back to text-only priors for hidden geometry",
                ],
            },
            {
                "step": "mesh-cleanup",
                "tool": "Blender",
                "tasks": [
                    "retopology if mesh density is unstable",
                    "fix normals and non-manifold geometry",
                    "unwrap UVs if the backend output is weak",
                ],
            },
            {
                "step": "texturing-and-materials",
                "tool": "Blender",
                "tasks": [
                    "rebake textures where seams are visible",
                    "normalize roughness and metallic maps",
                    "align material response to the requested style",
                ],
            },
            {
                "step": "quality-review",
                "checks": DEFAULT_QUALITY_CHECKS,
            },
        ],
        "deliverables": [
            {"type": "model", "format": args.format, "path": f"./outputs/{job_id}.{args.format}"},
            {"type": "preview", "format": "png", "path": f"./outputs/{job_id}-preview.png"},
            {"type": "report", "format": "md", "path": f"./outputs/{job_id}-report.md"},
        ],
        "limitations": [
            "This scaffold does not include a live 3D generation backend.",
            "A single photo cannot fully reconstruct hidden geometry without inference.",
            "No provider can honestly guarantee 99.99% prompt or photo fidelity across all assets.",
        ],
    }


def main() -> None:
    args = parse_args()
    reference_images = resolve_images(args.image)
    job_spec = build_job_spec(args, reference_images)

    output_dir = Path(args.output_dir).expanduser().resolve()
    output_dir.mkdir(parents=True, exist_ok=True)
    output_path = output_dir / f"{job_spec['jobId']}.json"

    with output_path.open("w", encoding="utf-8") as handle:
        json.dump(job_spec, handle, indent=2)
        handle.write("\n")

    print(output_path)


if __name__ == "__main__":
    main()
