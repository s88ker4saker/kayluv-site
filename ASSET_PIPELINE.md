# ASSET_PIPELINE.md — Interactive Object & Asset Decisions

Status: LOCKED unless amended here. Companion to SPEC.md and ASSET_BRIEF.md.
Scope: shop-scene interactive objects, animation pipeline, asset dispositions.
Last updated: 2026-07-08

---

## 1. Standing technical decisions

1. **Sprite sheets + CSS `steps()` are the standard for all triggered animations.**
   Frames laid in a horizontal PNG strip; `background-position` animated with
   `steps(N)`; play/reverse toggled by class from JS. No animated GIFs for
   anything trigger-based (GIFs cannot be paused, restarted, or alpha-blended
   cleanly).
2. **Animated GIF / animated WebP is permitted only for ambient loops** that
   never need triggering (e.g. candle flame). Prefer animated WebP over GIF.
3. **Motion-through-space is CSS transforms, not baked frames.** If an object
   travels (letter flight), animate a static PNG with keyframed
   translate/rotate/scale; bake frames only for shape change (drawer, door,
   page-turn).
4. **Every object is one component shape:**
   `{ art layers, trigger, sprite/keyframe config, reduced-motion fallback, optional route target }`.
   The shop is a config array over a single hotspot component. Art paths,
   frame counts, and positions live in config — never hard-coded in components.
   A production asset with a different frame count or aspect ratio must be a
   config edit, not a refactor.
5. **Reduced motion is one gate, not per-object cleanup.** All ambient and
   decorative motion lives inside a single
   `@media (prefers-reduced-motion: no-preference)` block; triggered
   animations fall back to jumping to their end state.
6. **Art/code boundary doctrine: the code is permanent, the art is entirely
   temporary.** Build proceeds on placeholders; production art swaps in via
   config with zero component changes.
7. **Production asset sizing:** author interactive-object art at 2× rendered
   size relative to the 3200×2000 canvas. Objects are positioned in
   scene-relative units (% of shop container), inside the 90%-width /
   85%-height hotspot safe zone.
8. **Click-triggered audio is permitted** (meow, register); no autoplaying
   audio outside the persistent radio system.

## 2. Per-object implementation table

| Object | Trigger | Approach | Tier | Production art needed |
|---|---|---|---|---|
| Bulletin board | Hover | CSS transforms on sliced paper PNGs, staggered delays | Straightforward | Papers as separate PNGs (board is room furniture) |
| Letter slot | Click | Static envelope PNG + CSS keyframe flight → correspondence overlay | Straightforward–moderate | 1 envelope PNG (+ optional 3-frame emergence sprite) |
| Portrait — flip | Click | CSS 3D card flip (`rotateY`, backface-hidden); back = bio in Caleb Martin's voice | Straightforward | Headshot + styled canvas-back panel |
| Portrait — blink | Auto (2–8s random) | 2-image swap on JS timer, ~150ms, occasional double-blink | Moderate (art edit) | Eyes-closed edit of the same headshot |
| Cat — launch | Click / page load | Sprite idle (2–3 frames) + alert frame + meow audio; random perch (1 of 3–4 positions) per visit | Straightforward | Idle + alert frames; meow clip |
| Cat — full (post-launch) | JS state machine | Multi-pose sprite sheet, translate between perches | Ambitious (art-gated) | 30–60 commissioned pose frames |
| Register | Click open/close | ~6-frame sprite, `steps()` forward/reverse (or drawer layer + CSS slide) | Straightforward | 6 drawer frames |
| Door | Click | 6-frame sprite → `animationend` → router. Launch state: **locked** (CSS shake + House line); unlock is a config flag | Straightforward | 6 open frames |
| Ledger — launch | Hover | 8-frame page-turn sprite | Straightforward | 8 page-turn frames |
| Ledger — full | Cursor proximity | Same sprite + CSS float loop + `pointermove` distance check + CSS/canvas particles. Additive layers; no library, no new art | Moderate | none beyond launch frames |
| Candle | Ambient loop | Animated WebP loop + CSS radial glow flicker layer | Straightforward | Audition current asset first |
| Cuckoo clock | — | DEFERRED (dormant *At the Eleventh Hour* easter egg) | — | — |
| Radio / magic lantern | — | DEFERRED (static furniture at launch; shell-plus-overlay-router still required day one) | — | — |

## 3. Ambient layer (all inside the single reduced-motion gate)

- Light shafts through window — gradient divs, `mix-blend-mode: screen`, slow drift.
- Dust motes — 8–12 CSS-animated dots clipped to the shaft.
- Candle glow halo — CSS radial gradient, irregular flicker keyframes.
- Time-of-day tint — visitor's local clock selects one of 3–4 color-grade overlays.
- Cat idle tail-flick — free byproduct of the cat idle sprite.
- Curtain breath — subliminal `scaleX` sway, 8–10s period.

## 4. Asset dispositions (current placeholder set)

**Promoted-pending (launch candidate, gated):**
- `Shop_Back.png` — under consideration as the actual launch background
  (found-painting-as-room is doctrinally sound collage). Gates before
  promotion is final: (1) identify the work; confirm public-domain
  provenance; (2) hotspot walk — verify every interactive object has a
  natural home in the composition within the safe zone; (3) decide the
  object-integration style (drawn-to-match vs. openly collaged); (4) compress
  from 11.9MB to well under 1MB (WebP/AVIF) — required regardless of fate.

**Audition (might survive to launch):**
- `candle_flicker.gif` — convert to animated WebP; keep if it sits well
  against final room art.

**Discarded by design (approach needs no frames; keep as reference only):**
- `flapping_sticky.gif` — flutter is pure CSS on sliced papers.
- `letter_fly.gif` — flight is pure CSS on a static envelope.

**Replace by authoring (same commission as the room art; do not source stock):**
- `cat.gif`, `cash_register.gif`, `Back_room_door_open.gif`,
  `book_ledger.gif` — redraw as layered elements in the master-illustration
  pass, at 2× rendered size, at the frame counts in §2.

**Replace — hard gates:**
- `vintage-hotel-key-mail-holder…jpg` — watermarked unlicensed stock preview.
  MUST NOT appear in any public deploy. Local mockups only.
- `bulletin_board.png` — modern photograph; board becomes furniture in the
  room illustration, papers become slice assets.

**Self-serve batch (no illustrator needed):**
- Envelope PNG; eyes-closed portrait edit; Shop_Back compression; meow audio clip.

## 5. Open items

- Provenance research on the Shop_Back painting (blocks its promotion).
- Hotspot walk of Shop_Back against the full object list.
- Master illustration commission brief: expand ASSET_BRIEF.md with §2's
  per-object layer/frame specs (scope shrinks to objects-only if Shop_Back
  is promoted).
- Chosen tension to ratify explicitly if Shop_Back ships: European romantic
  stage set anchoring an American-West mythology (collage doctrine holds it,
  but it must be chosen, not defaulted).
