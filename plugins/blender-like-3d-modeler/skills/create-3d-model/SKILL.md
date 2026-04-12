---
name: create-3d-model
description: Turn a text prompt and one or more reference photos into a structured 3D generation job plan, then prepare assets for Blender cleanup and export.
---

# Create 3D Model

Use this skill when the user wants a Blender-like 3D model generated from a prompt, a photo, or both.

## Rules

- Do not promise deterministic accuracy or "99.99%" fidelity.
- State the actual quality constraints when inputs are weak:
  - one photo means missing hidden geometry
  - low-resolution references reduce material fidelity
  - inconsistent lighting or lens distortion will affect shape recovery
- Prefer multiple reference images when the user has them.
- Default output format is `glb` unless the user requests another format.

## Workflow

1. Gather inputs:
   - prompt
   - reference image paths
   - target style
   - target output format
   - desired poly budget if relevant
2. Create a structured job spec with:
   - geometry intent
   - material intent
   - provider preference
   - quality checks
   - expected deliverables
3. If the user wants execution help, run:

```bash
python3 ./scripts/create_3d_job.py --prompt "<prompt>" --image <path>
```

4. Recommend a backend:
   - hosted: Meshy, Tripo
   - open: TRELLIS, Hunyuan3D-2
5. Recommend Blender post-processing:
   - retopology
   - UV cleanup
   - texture rebake
   - material tuning
   - export validation

## Output expectations

- Produce a concise status update.
- Point to the generated job JSON path.
- If a backend is not wired yet, say that clearly and identify the next integration step.
