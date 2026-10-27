---
name: opus-video-prompts
description: Library of 703 community prompts that produced viral Claude Opus 5.5 animation videos (motion graphics, explainers, 3D scenes, games) built as code with HTML, Canvas, SVG, GSAP, Three.js, GLSL. Use when the user wants to make an animated video or motion graphic and could use a proven prompt as a starting point or style reference.
---

# Opus 5.5 video prompts

Prompts people shared alongside videos they made by asking Claude Opus 5.5 to write the animation as code. Source: [yihui-dev/awesome-opus5-5-videos](https://github.com/yihui-dev/awesome-opus5-5-videos) (MIT, see `LICENSE`).

## Files

- `data/videos.json` — index of all 703 entries. Each has `slug`, `author`, `post_url`, `category` (`motion`, `3d`, `explainer`, `interactive`), `tech_tags` (e.g. `canvas`, `svg`, `gsap`, `threejs`, `glsl`), `prompt`, and `prompt_partial` (true when only part of the prompt was published).
- `prompts/<slug>.md` — one prompt per file, with a title, category and link to the original post.
- `SOURCE-README.md` — the upstream README with curated highlights by category.

## How to use

1. Search the index for entries matching the request, e.g. with `jq`:
   `jq -r '.[] | select(.category=="explainer" and (.tech_tags|index("gsap"))) | "\(.slug)\t\(.prompt[:100])"' data/videos.json`
   or grep `prompts/` for keywords.
2. Read the closest prompts and adapt one to the user's subject, keeping the structure that made it work (duration, scene beats, style constraints, single-file output).
3. Some prompts are in languages other than English; translate as needed. If `prompt_partial` is true, fill in the missing parts yourself.
4. For a rendered video file rather than a browser animation, combine with the Remotion skills (`remotion-create`, `remotion-render`).
