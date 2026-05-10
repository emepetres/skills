---
name: faithful-translate
description: Translate documents, proposals, Markdown, and technical content between languages while preserving meaning, tone, terminology, and structure. Use when the user asks to translate content, convert a document to another language, produce a faithful translated copy, translate Markdown files, or convert Spanish technical/proposal content to American English.
---

# Faithful Translate

## Quick Start

Translate the full source content into the requested target language without summarizing, rewriting, or editorializing. Preserve the author's voice, meaning, data, examples, Markdown structure, links, tables, code blocks, commands, file paths, and technical identifiers.

When translating a file, write the translated output to a sibling file using a target-language suffix, such as `proposal_eng.md` for English or `proposal_es.md` for Spanish, unless the user provides an output path. Never overwrite the original source file.

## When To Use

- The user asks to translate a document, proposal, article, note, or technical content.
- The user asks to convert content from one language to another, including Spanish to American English.
- The user provides inline text and requests an equivalent version in another language.
- The user mentions translation, translating Markdown, converting to English, converting to Spanish, or producing a faithful translated copy.

## When Not To Use

- The user asks to rewrite, summarize, polish, localize heavily, or improve the content editorially.
- The user needs transcription from audio or video.
- The content is already in the target language and only needs proofreading or style edits.

## Workflow

1. Identify the source content: file path, selected text, or inline content.
2. Identify the source language from the user's request or the content.
3. Identify the target language. If it is missing, ask before translating.
4. Confirm the source is not empty and contains translatable text.
5. If translating a file whose name already appears to use the target-language suffix, warn the user and stop unless they confirm.
6. If source and target languages are the same, inform the user and stop.
7. Translate the complete content faithfully into the target language.
8. Write file-based translations to the requested output path or to a sibling file with a language suffix before the extension.
9. Confirm the generated path and mention any validation concerns.

## Translation Rules

- Preserve meaning, nuance, emphasis, examples, facts, numbers, and constraints.
- Preserve the author's tone, personality, and level of formality.
- Prefer natural, idiomatic target-language phrasing over rigid literal translation.
- Use standard industry terminology for software, AI, cloud, business, and technical domains.
- Preserve Markdown layout, heading levels, tables, lists, blockquotes, links, front matter, and hierarchy.
- Do not translate code blocks, CLI commands, configuration keys, technical identifiers, product names, file paths, URLs, or variable names.
- Translate comments or natural-language strings inside code only when the user requests it or when they are clearly prose rather than executable syntax.
- Do not add, remove, reorganize, condense, or expand information.
- If a phrase is ambiguous, choose the most faithful interpretation and mention the ambiguity in the final response.

## Output Naming

Use an ISO 639 language suffix that clearly identifies the target language:

- English: `_en` or `_eng`, following the user's requested or existing convention.
- Spanish: `_es`
- French: `_fr`
- Portuguese: `_pt`
- German: `_de`

Examples:

- `proposal.md` to American English: `proposal_eng.md`
- `notes.md` to Spanish: `notes_es.md`
- `architecture.review.md` to English: `architecture.review_en.md`

## Validation Checklist

- The output file exists and does not overwrite the source file.
- The translation reads naturally in the target language.
- Markdown structure matches the source layout.
- No information, data, examples, or constraints were added, removed, or altered.
- Code, commands, paths, links, product names, and identifiers were preserved correctly.
- The file name carries the correct target-language suffix unless the user specified a path.

## Common Pitfalls

- Do not assume English as the target language when the user did not specify one.
- Do not translate code blocks or commands unless explicitly requested.
- Do not turn translation into copyediting, summarization, or localization beyond faithful natural phrasing.
- Do not overwrite the original source file.
