# CARRY_FORWARD.md — kayluv.site project state

*Handoff snapshot for a fresh Claude session. Written 2026-11-07.*
*Not canon — SPEC.md, ASSET_PIPELINE.md, ASSET_BRIEF.md, CLAUDE.md are canon.
This file exists to transfer context those files don't yet record.*

---

## 0. READ THIS FIRST — timeline

**Recital: Friday, December 11, 2026, 7:30 PM, First United Methodist Church,
Salt Lake City.** (Moved from Dumke Recital Hall; all "Dumke" copy has been
swept from the repo. Catalogue-No.-1-anchors-to-the-December-event rule is
unchanged.)

As of writing: **~5 weeks to the recital, ~3.5 weeks to the stated content
freeze (~Dec 1).** No code has been committed since the Bulletin board.
Priorities 2 and 3 below are unbuilt and they are what gate real content
reaching the site.

---

## 1. What this project is

Fan-facing portfolio/music hub for **Kayluv** (presenter identity of composer
**Caleb Martin**), built as an immersive point-and-click illustrated room —
a turn-of-the-century music publishing house. Every site section is a
physical object in the room.

Stack: **vanilla HTML/CSS/JS, no frameworks, no build step, no npm.**
Deploys to Netlify as static files from repo root.

**Live:** https://kayluv2u.netlify.app — git-connected, auto-deploys on push
to `main`.
**Repo:** `git@github.com:s88ker4saker/kayluv-site.git`

---

## 2. Current build state

SPEC §9 defines a 9-step build order. Status:

| Step | What | State |
|---|---|---|
| 1 | Repo + Netlify pipeline + SPEC | ✅ done |
| 2 | Room shell, SVG hotspots, fire-glow, gear menu | ✅ done |
| 3 | Overlay router + standalone fallback pages | ✅ done |
| — | Bulletin board (notices + listen links, JSON-driven) | ✅ done, live |
| 4 | Ledger procedural animation (bob/tilt/glow/open) | ❌ **not started** |
| 5 | Catalogue: `data/catalog.json` + folios + Dec entry | ❌ **not started** |
| 6 | Counter, Correspondence, Proprietor, /listen/ | ❌ placeholders only |
| 7 | Sound layer / audio manager | ❌ stubs only |
| 8 | Threshold + lights-up intro | ❌ not started |
| 9 | Post-launch: radio, lantern, Back Room | ❌ by design |

**Last commit:** `c2fb461` Bulletin board (2026-10-10).
**Uncommitted:** `ASSET_PIPELINE.md` has working-tree changes recording the
DuBois rejection (see §5). Should be committed.

### What actually works right now

- Room shell renders a placeholder composition template cover-fit; pans
  horizontally on narrow screens (touch + mouse drag).
- Eight keyboard-focusable SVG hotspots with fire-gradient hover/focus glow.
- Gear menu top-right: full section nav (the non-mouse path) + sound stubs,
  Escape-closeable, stays usable above open overlays.
- Overlay router: clicking an object opens that section's content above the
  dimmed room, real URL via pushState, Back/Escape return to the room.
- Every section also exists as a real standalone page at its real URL.
- **Bulletin board** at `/bulletin/` — renders notices from
  `data/notices.json` and streaming links from `data/listen-links.json`.
- **Deep link: `https://kayluv2u.netlify.app/#bulletin`** boots the shell and
  opens straight to the board, then cleans the URL to `/bulletin/`. This is
  the link intended for the Instagram bio and the recital-program QR code.
  The same mechanism works for any section (`/#counter`, `/#catalogue`, …).
- Overlays go full-bleed under 640px (phone layout).

### Content currently on the site

- One notice: the Dec 11 recital (date, time, venue).
- Four listening links — **all with empty URLs**, rendering as
  "coming soon". Caleb supplies real URLs by editing
  `data/listen-links.json`; no code change needed.
- A newsletter signup **placeholder** — intentionally inert. No platform has
  been chosen (Kit was considered and deferred). Swap the contents of the
  `[data-signup-slot]` section in `bulletin/index.html` when decided.

---

## 3. File map

```
index.html              the shell (room + gear + overlay container)
404.html                in-world "Lost in the Stacks"
css/main.css            shell: room, hotspots, fire-glow, gear, overlay
css/page.css            standalone destination pages
css/bulletin.css        Bulletin content (loaded by BOTH shell and standalone)
js/hotspot-data.js      ← SINGLE SOURCE OF TRUTH for hotspot coordinates (%)
js/room.js              builds hotspot overlay + SVG glow filter + pan
js/gear-menu.js         gear panel; exposes window.KAYLUV.isGearMenuOpen/closeGearMenu
js/overlay-router.js    fetch + pushState + hash deep links + content event
js/bulletin.js          renders notices/links; dual-context init
data/notices.json       Bulletin notices — add an entry, no layout work
data/listen-links.json  streaming links — empty url renders "coming soon"
assets/room-placeholder.svg   disposable composition template (NOT final art)
catalogue|counter|bulletin|correspondence|proprietor|listen|backroom/index.html
```

---

## 4. Technical gotchas (hard-won — do not rediscover)

1. **WebKit ignores CSS `filter:` on elements inside `<svg>`.** The hotspot
   glow therefore uses an SVG `feDropShadow` filter (`#fire-glow-svg`,
   injected by `js/room.js`). The CSS `.fire-glow` class exists in parallel
   for HTML elements (future transparent-PNG object art). **They are twin
   dialects of one visual language — retune both together.**

2. **The desktop app's file-preview pane renders HTML raw** — relative CSS
   and image paths don't resolve, so the page looks unstyled and broken.
   Always serve over localhost (`.claude/launch.json` defines a `site`
   config on port 4508) and verify in a real browser.

3. **Overlay router history invariant:** opening from the room PUSHES one
   entry; overlay→overlay REPLACES. The entry beneath an open overlay is
   therefore always the room, so close is always exactly `history.back()`.
   The hash deep-link path must `replaceState('/')` *first*, then push the
   section — otherwise Close/Escape navigates the visitor off the site.
   (This was a real shipped bug; it is fixed. Don't reintroduce it.)

4. **Cloned fragments don't execute `<script>`.** For JSON-driven sections,
   the router dispatches `kayluv:overlay-content` on `document` with
   `{path, root}` after inserting content. A section module listens for that
   AND self-inits on `DOMContentLoaded` for the standalone page. `bulletin.js`
   is the reference implementation — **copy this pattern for the Catalogue.**

5. **Per-section CSS/JS must be linked in BOTH places** — the shell
   `index.html` (because overlay content is injected into that document) and
   the section's own standalone page.

6. **Hotspot coordinates are percentages** of the 3200×2000 canvas, stored
   only in `js/hotspot-data.js`. Nothing is hardcoded in HTML. Retune there
   when real art lands.

7. **Reduced motion:** every transition/animation is authored inside
   `@media (prefers-reduced-motion: no-preference)`, with a global kill
   switch at the bottom of `main.css`. Keep that convention.

---

## 5. Room background — where this stands (ACTIVE WORK)

The room is still `assets/room-placeholder.svg`, a labeled composition
template. Choosing the real background has been the focus of recent sessions.

### REJECTED — do not use

**`Shop_Back.png`** = *"Intendant of the building stone interior"* by **Don
Carlos DuBois**, a Scottish Rite 8th-Degree Masonic ritual backdrop (Great
Western Stage Equipment Co.), held by UMN Performing Arts Archives.
**Not public domain.** DuBois died 1964-03-26 and made it in the late 1950s;
unpublished + known author = life+70 → earliest PD **2035**. UMN's own record
says copyright may apply. **Must never appear in a public deploy.**
(Recorded in ASSET_PIPELINE.md §4 — currently uncommitted.)

Lesson learned the hard way: **"a website said it's public domain" is not
provenance.** Archival *working drawings* run life+70 regardless of how old
they look, because they were never published.

### Considered and set aside

**Johannes Jelgerhuis, *The Shop of the Bookdealer Pieter Meijer Warnars*,
1820, Rijksmuseum** — public domain beyond doubt, thematically perfect (an
actual publisher's shop, stage-set perspective, doorway-with-street-view
built in). Set aside because **it contains 4–5 figures**, and SPEC §2 locks
"Portrait, not voiced shopkeeper" — people in the room contradict the
conceit that the visitor is the one entering. Removable in Photoshop if
revisited; the figures sit against repeating bookcases.

### CURRENT FRONT-RUNNER

**The Bittner/Platzer series**: *Theaterdecorationen nach den Originalskitzen
des k.k. Hoftheatermahlers Joseph Platzer*, etched and published by **Norbert
Bittner, Vienna, 1816**.

- **Rights: bright-line public domain.** Published 1816. Platzer died 1806.
  No analysis, no unknowns.
- **Resolution: ~3000 × 2623** from the Theatermuseum Wien files. Solved.
- **60+ plates** in the series — a catalog to choose from, not one gamble.
- Painted stage flats: unpeopled, architectural, warm, hand-made, built to be
  stood in front of.
- Browse: [Theatermuseum Wien, sheet 62](https://collection.theatermuseum.at/en/objects/titel-der-serie-theaterdecorationen-nach-den-originalskitzen-des-k-k-hoftheatermahlers-joseph-platzer-radirt-und-verlegt-von-norbert-bittner-1365255)
  — the "Similar items" strip at the bottom of any object page links sheet
  after sheet of the series.
- Caleb has looked at a two-arch vaulted interior plate (hanging lantern,
  stone arcade, wooden loft, door, wall racks) and responded well to it.
- Theatermuseum's *access terms* ask for a request for non-private use of
  their scan. That's contract, not copyright — worth a courteous email.

**Outstanding work on whatever is chosen:**
1. **Aspect ratio.** Plates run ~1.14:1; the canvas is 1.6:1. Needs ~40% more
   width. The architecture is an arcade — **add another arch bay** rather
   than stretching; arcades repeat, perspective rules are simple, and in line
   art you draw lines instead of cloning texture. Extend sideways; never crop
   the ceiling/floor, which carry the room's depth.
2. **Hotspot walk** — confirm all ten SPEC §6 objects have a natural home
   inside the 90%/85% safe zone, then retune `js/hotspot-data.js`.
3. **Layered export** — walls/floor/ceiling with the window or opening as an
   actual transparent **hole**; the view behind it on its own layer (this is
   what makes cycling artwork through the window a later code change rather
   than a repaint); curtains in front; fixed furniture; each interactive
   object as its own transparent PNG.
4. **Compress** to well under 1MB.
5. Lift values inside the dark hatched arches so objects placed there read.

### PROPOSED but NOT RATIFIED — the aesthetic foundation

Caleb asked to settle the base visual foundation before structure (correctly
— ASSET_BRIEF §5 makes room composition production priority #1 because
hotspot coordinates depend on it). The direction that emerged, **not yet
confirmed by Caleb and not yet written into canon**:

> **The room is ink on paper. Objects are collaged in color.
> The fire gradient is the only light.**

Rationale: this *is* ASSET_BRIEF §1's stated palette (paper-white ground /
black ink / fire gradient as the interactive color / Kayluv blue as the
environment color), not a compromise toward it. Consequences if adopted —
the hover glow becomes the only warm color so interaction is unmistakable
and reads as "lamplight touching an object" per ASSET_BRIEF §2; era-clashing
collaged objects become grammar rather than error; time-of-day tinting
(ASSET_PIPELINE §3) works easily over monochrome; line art compresses far
under the 1MB gate and upscales gracefully; a Kayluv-blue "beyond" through
a cut opening becomes the single environmental accent.

**A new session should confirm this with Caleb before building on it.**

---

## 6. Canon docs — and two that don't exist

- `SPEC.md` — architecture, routing, site map, object table, build order
- `ASSET_PIPELINE.md` — object/animation/asset decisions (**has uncommitted
  changes**)
- `ASSET_BRIEF.md` — art production shot list, palette, canvas, safe zone
- `CLAUDE.md` — standing rules for coding sessions

**`STYLE_GUIDE.md` and `COPY_DECK.md` are referenced by CLAUDE.md as canon
but have never been written.** Caleb is aware and intends to write them
himself — he has said not to worry about it and that he knows what the style
will be. Do not author them unprompted. Practical effect: there is no copy
blacklist to check against, so site copy so far is deliberately plain and
factual, pending his pass.

### Decisions made in conversation and already written into canon

- **SPEC §4/§8:** rooms are *scenes*, not overlays. The Back Room (and any
  future room) opens via an in-shell **scene swap** — exchange the room image
  and hotspot set in place, pushState the real URL — so it feels like walking
  into another room while audio persists. Overlays are for document-like
  destinations only.
- **SPEC §7:** venue updated to First United Methodist Church with a note
  that older git history still says "Dumke".

---

## 7. Open questions

- Ratify (or reject) the ink-ground aesthetic in §5.
- Pick the specific Bittner plate.
- Newsletter platform — none chosen; signup slot is a deliberate placeholder.
- Real streaming URLs for `data/listen-links.json`.
- Final domain name, and the QR code for the recital program (must be settled
  before the program print deadline — currently the link would be
  `kayluv2u.netlify.app/#bulletin`).
- Catalog number format ("KL-001" vs. year-based) — SPEC §10.
- Whether ambient room hum ships at launch.

---

## 8. Suggested next actions

1. **Commit the pending `ASSET_PIPELINE.md` change** so the DuBois rejection
   is recorded in history, not just the working tree.
2. **`data/catalog.json`** (SPEC §5/§7) — schema with one entry per finished
   score: title, catalogue no. (numbered backward from the December recital
   as No. 1), "Kayluv presents…" display line, instrumentation, year, program
   note, cover image path, perusal PDF path, Gumroad link, optional recording
   link. Seed with placeholders. Launch inventory is *Angel or Alien*,
   *Day by Day*, *Run All Night*, plus the December recital as entry No. 1.
   **This is independent of the room art and unblocks real content.**
3. **Ledger v1 + folio overlay** (SPEC §9 step 4, Priority 3) — slow CSS bob,
   slight tilt toward cursor, static under reduced motion; click opens a
   folio overlay reading entirely from `catalog.json`, cover left / notes
   right, next-prev with a simple page-turn and swipe on mobile. Build so a
   weighted page-curl can replace it in the same container later.
4. Letter-slot hotspot → the same signup route, once a platform exists.
5. Pre-recital passes: reduced-motion check, image compression, real-phone
   test, tense swaps in recital copy.

---

## 9. Working notes for whoever picks this up

- Caleb is approaching this as an artist: he wants the visual foundation
  settled because downstream structure derives from it. That is a considered
  position backed by his own ASSET_BRIEF, not avoidance. Don't nag about
  sequencing — he has heard it.
- SPEC.md is law. If an instruction contradicts it, flag the conflict rather
  than silently picking one.
- He keeps a list of spec gaps. If something is ambiguous or missing, ask
  rather than invent.
- Serve on localhost and verify in a real browser before claiming anything
  works. Several bugs this project hit were only visible in WebKit or only
  on a true fresh page load.
- Amending the canon docs when a decision gets made in conversation is an
  established, welcomed pattern — date the entry.
