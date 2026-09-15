# Prototype: render pick (issue #8)

Throwaway. Answers one question: **reveal.js or a bespoke renderer** for the
`keynote` skill. Not production code — nothing here should be copied forward
except the decision.

```
deck.md                 one source, both candidates parse it
parse.mjs               rough shared parser (slide vocabulary is #9's job, not this)
shared-assets/
  house.css             the house skeleton both candidates render
  clip.mp4              20 s timecoded test clip (ffmpeg testsrc)
  live.html             stand-in for a live Excalidraw scene: a running counter + an input
a-revealjs/build.mjs    -> a-revealjs/dist/  (245 KB index.html, reveal 6.0.1 inlined)
b-bespoke/build.mjs     -> b-bespoke/dist/   (12 KB index.html, ~200 lines of runtime)
CHECKLIST.md            the ten-minute run
```

## What the code already says, before anyone looks at a screen

Read from the vendored `reveal.js@6.0.1` `dist/plugin/notes.js` in this session:

- The `about:blank` + `document.write` popup technique from #16's research **is still
  what 6.0.1 ships** (`window.open('about:blank', 'reveal.js - Notes', …)`,
  then `speakerWindow.document.write(…)`). So the popup inherits the opener's origin.
- But the 4.3.1 `event.source !== window.opener` identity check that #8's criterion 2
  names is **no longer the code that runs**. 6.0.1 validates like this:
  - in the popup: `if (window.location.origin !== openerOrigin) { "Cross origin error" }`,
    where `openerOrigin = window.opener.location.origin` inside a `try/catch`
  - on each message: `if (window.location.origin !== event.origin && window.location.origin !== 'file://') return`

  That second line is an **origin-string comparison with a hardcoded escape hatch for
  Chromium's `"file://"` serialization**. It is the exact pattern criterion 2 forbids —
  it just happens to have the Chromium case special-cased by hand. Firefox is covered
  only incidentally (both sides serialize `"null"`, so the equality passes).

Candidate **B** implements criterion 2 literally: `postMessage(msg, '*')` on both
directions, validated by `e.source !== window.opener` / `e.source !== speakerWindow`
and nothing else.

So the checklist's section 2 is not a formality for A — it is measuring whether
reveal.js's hand-rolled special case actually holds in Edge and Firefox.

## The other real difference

`b-bespoke` keeps **every slide in the DOM** and only toggles visibility, so an
iframe on slide 4 never stops running. reveal.js blanks `iframe[data-src]` in
`stopEmbeddedContent()` unless `data-preload` is set — candidate A sets
`data-preload` on every section, so section 4 of the checklist is testing whether
that flag is enough.
