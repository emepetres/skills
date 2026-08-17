---
name: faithful-translate
description: Translate content between languages while preserving meaning, tone, terminology, and structure. Use when the user asks to translate a file or inline text, or wants existing content in another language.
---

# Faithful Translate

## Quick Start

Translate the full source into the requested target language: same facts, same voice, same structure, natural idiomatic phrasing. This is translation, not editing — the output carries every fact, number, example, and constraint the source carries, and nothing more.

For a file, write the translation to a sibling file with a language suffix and leave the source untouched, unless the user gives an output path.

## When Not To Use

- The user wants the content rewritten, summarized, polished, or editorially improved.
- The user needs transcription from audio or video.
- The content is already in the target language and needs proofreading or style edits.

## Workflow

1. Identify the source content: file path, selected text, or inline content.
2. Identify the source language from the request or from the content.
3. Identify the target language. If it is missing, ask before translating.
4. Confirm the source contains translatable text. Stop and say so if the source and target languages are the same, or if the file name already carries the target-language suffix — continue only if the user confirms.
5. Translate the complete content.
6. For a file, write to the requested path, or to the sibling path from **Output Naming**.
7. Report the output path, and any ambiguity you resolved by judgement.

## The Passthrough Set

Reproduce these verbatim in the output, untranslated: code blocks, CLI commands, configuration keys, technical identifiers, variable names, file paths, URLs, and product names.

Translate natural-language comments or strings inside code only when the user asks for it, or when they are clearly prose rather than executable syntax.

## Translation Rules

- Preserve meaning, nuance, emphasis, examples, facts, numbers, and constraints exactly.
- Preserve the author's tone, personality, and level of formality.
- Prefer natural, idiomatic target-language phrasing over literal word-for-word rendering.
- Use standard industry terminology for software, AI, cloud, business, and technical domains.
- Preserve Markdown layout: heading levels, tables, lists, blockquotes, links, front matter, and hierarchy.
- Keep the passthrough set verbatim.
- Where a phrase is ambiguous, pick the most faithful reading and flag it in your final response.

## Output Naming

Match the suffix convention already used by sibling files in the directory. With no existing convention, use the ISO 639-1 code before the extension:

- `proposal.md` to American English: `proposal_en.md`
- `notes.md` to Spanish: `notes_es.md`
- `architecture.review.md` to English: `architecture.review_en.md`

## Validation Checklist

- The output file exists, and the source file is unchanged.
- The translation reads naturally to a native speaker of the target language.
- Markdown structure matches the source layout.
- No information, data, example, or constraint was added, removed, or altered.
- Every member of the passthrough set survived verbatim.
- The file name carries the correct suffix, unless the user specified a path.
