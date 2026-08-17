---
name: email-draft-polisher
description: Rewrite a draft, rough notes, or a thread into one polished, cordial, professional email. Use when the user asks to draft, polish, or reply to an email.
---

# Email Draft Polisher

## Quick Start

Turn the user's draft, ideas, contextual notes, or prior email exchange into one polished outgoing email: clear, professional, cordial, and action-oriented without sounding stiff.

Always return exactly this shape, with nothing after the body:

```text
Subject: [suggested subject]

[email body]
```

The email client adds the signature, so the body ends at the closing line — no sender name, initials, title, or company footer.

## When Not To Use

- The user wants a faithful translation of existing content with no rewriting — use `faithful-translate` instead.
- The user wants prose that is not an email: a document, a message for another channel, or a summary.
- The user wants to send verbatim text unchanged and asks only for a send, not a rewrite.

## Input Handling

Treat contextual explanations and previous emails as source material, not text to include verbatim. From the input, extract:

- The communication goal.
- The relevant facts the recipient needs.
- The requested actions, decisions, deadlines, and dependencies.
- Tone constraints and relationship dynamics.

## Language Selection

Write in the language of the context or draft. If the user specifies a language, use it instead. When the context mixes languages, pick the one most appropriate for the outgoing email based on the draft, the recipient, and any instruction; with no clear signal, use the language of the main draft content.

## Writing Style

Write as a manager in a research and technological innovation environment:

- Cordial and respectful without sounding stiff.
- Confident, clear, and results-oriented.
- Collaborative, inviting alignment, feedback, and shared progress.

Keep openings and closings warm and natural. Use a formal register (for example "Dear Sir/Madam") only when the user asks for one. Prefer plain wording over jargon, inflated phrasing, long nested sentences, and bureaucratic language.

## Drafting Process

1. Identify the one primary objective of the email. Each email carries a single clear purpose.
2. Separate context from message; include only the context the recipient needs in order to act or understand.
3. Consolidate repeated ideas, merge overlapping points, and simplify the structure.
4. Make asks, decisions, deadlines, dependencies, and next steps explicit.
5. Use short paragraphs. Use bullets or numbering when several points, requirements, or actions must be easy to scan.
6. Preserve important nuance from prior emails: commitments, blockers, dates, responsibilities, and relationship-sensitive details.

## Recommended Structure

Use this default, adapting it to the situation:

1. Brief greeting, such as "Hola [nombre]," or the equivalent in the selected language.
2. Optional one- or two-sentence context.
3. Main message: what is being communicated, requested, proposed, confirmed, or clarified.
4. Next steps: the expected action, confirmation, review, feedback, meeting, or decision.
5. Cordial closing line, such as "Un saludo", "Gracias y seguimos en contacto", or a natural equivalent in the selected language.

## Subject Guidance

Suggest a specific, concise, action-oriented subject that reflects the email's concrete purpose — a decision, review, coordination item, proposal, follow-up, or next step. Reach for a broad subject such as "Update" or "Question" only when the context makes it clearly the better fit.

## Handling Previous Emails

When previous emails are included:

- Use them to understand chronology, commitments, blockers, stakeholders, and tone.
- Draft the new message as a self-contained reply or follow-up, without reproducing the full thread.
- Reference a specific point from the thread only when the new message depends on it, briefly and naturally.

## Validation Checklist

Before returning the email, confirm:

- It has one clear objective, and the subject matches it.
- Repeated ideas are consolidated.
- The tone is professional, cordial, and confident.
- The next step is concrete.
- The output is the `Subject:` + body shape, ending at the closing line.
- The language matches the context or the user's request.
