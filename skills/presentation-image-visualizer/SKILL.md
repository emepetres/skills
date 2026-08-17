---
name: presentation-image-visualizer
description: Create PowerPoint-ready support images from speech content, slide ideas, or bullet points. Use when the user wants visual aids for slides, a concept visualized, or one image per bullet.
---

# Presentation Image Visualizer

## Quick Start

Produce slide-ready visuals that support a presenter while they speak. Each image is a visual aid, not a text-heavy slide — prioritize clarity, metaphor, composition, and explanatory value over decorative artwork.

Work one image at a time: produce the first, then ask before moving on. **Image Direction** defines what each image should be; **Producing The Image** defines how it reaches the user.

## When Not To Use

- The user wants a full text-heavy slide or the deck itself, not a supporting visual.
- The user wants an existing image edited or analyzed rather than a new concept visual.
- The user asks for a chart or data visualization driven by real data — that is a charting task, not concept imagery.

## Core Workflow

1. Read the presentation context, topic, desired style, audience, and any bullet points.
2. Settle the production path once, before the first image (see **Producing The Image**). It holds for the whole run.
3. Decide whether there is enough context to produce a useful image. If yes, proceed. If not, ask only the smallest set of questions needed (see **Clarification Rules**).
4. If the input contains bullet points, list them back as a numbered queue with a status against each one — `pending`, or `done`. Each bullet is its own image request, and the global context guides every image in the queue.
5. Produce the image for the first `pending` bullet, and only that one.
6. Ask: "Would you like changes to this image, or should I create the next one?"
7. On a revision request, replace the current image and ask again. On approval, mark that bullet `done`, show the updated queue, and return to step 5.

The run is finished when every bullet in the queue is `done`. Produce all images in one turn only when the user explicitly overrides the one-at-a-time flow.

## Clarification Rules

Ask only when missing information would materially reduce image quality; otherwise make reasonable assumptions from the topic, concept, audience, or style direction. Ask about:

- The main concept or message, if it is ambiguous.
- Visual style, if the user requests a brand-specific or highly specific aesthetic but does not define it.
- Audience or tone, when the same concept could require very different treatment.
- Whether to proceed bullet-by-bullet, if the bullet structure is unclear.

This skill works from prompts and general context only — it never needs the presentation file or source document.

## Image Direction

Before producing anything, formulate a concise direction covering:

- Subject or concept to visualize.
- Visual metaphor or scene.
- Style and tone (see **Style**).
- The constraints under **Defaults**, written out explicitly so an image tool receives them.
- Any audience, industry, brand, or color guidance the user provided.

Make it specific enough to yield an explanatory visual, without overloading it with unnecessary detail.

### Defaults

Use these unless the user specifies otherwise:

- **Format:** 16:9 landscape, PowerPoint-ready.
- **Text:** minimal or none inside the image. Keep labels, captions, slogans, and slide titles out unless the user explicitly asks for them.
- **Style:** illustrative and explanatory, optimized to make the concept clear at a glance.
- **Composition:** clean, uncluttered, strong focal point, readable from a distance.
- **Role:** visual support for a presenter, not a complete slide holding all the information.

### Style

If the user specifies a style, follow it precisely (for example: realistic, cinematic, corporate illustration, flat vector, 3D render, isometric, sketch, infographic-like, futuristic, playful, minimal, hand-drawn).

If no style is given, choose an illustrative/explanatory style suited to the concept:

- Clean editorial or corporate illustration for business concepts.
- Simple metaphorical scenes for abstract ideas.
- Process-like compositions for workflows or transformations.
- Diagrammatic compositions without heavy text for technical concepts.

## Producing The Image

Two paths. Check once which one the host supports, and say which one you are taking so the user knows what to expect.

**The host has an image-generation tool** (for example `image_gen` in ChatGPT/Codex): call it with the direction. Save each image to the working directory as `<topic-slug>-NN.png`, numbered by queue position — `onboarding-flow-01.png`, `onboarding-flow-02.png` — or to a path the user gives. A revision overwrites its own number rather than appending a new one, so the file order always matches the slide order. Report each path.

**The host has no image-generation tool** (Claude Code has none by default): output the direction as a finished, self-contained prompt the user can paste into their own image tool. Put it in its own fenced block, labelled with the bullet it belongs to, and carry the **Defaults** into the prompt text — the receiving tool sees only what the block contains.

## Quality Checklist

Before producing each image, confirm the intended visual:

- Supports the spoken idea rather than replacing the speaker.
- Reads quickly from a slide, with a clear focal point and no clutter.
- Matches the requested or inferred style.
- Follows **Defaults**, except where the user overrode them.
