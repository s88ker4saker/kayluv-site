# KAYLUV.SITE — ASSET_BRIEF.md
*Carry-forward for art-direction and asset-production sessions. Companion to SPEC.md (coding). This document is the shot list: everything that must be drawn, collaged, or exported, with dimensions and constraints that the code depends on.*

---

## 1. VISUAL CANON (do not re-derive)

- **Palette:** paper-white/warm off-white ground · black ink · **fire gradient** (gold #F0A800 → orange → red) as the *interactive* color (hover glows, light under doors, activation) · **Kayluv blue** (#3078C0 family) as the *environment* color (walls, dusk, folio covers) · **red reserved** for the most charged moments only.
- **Marks (extracted from the logo):** full wordmark = shop signage only; star-circle of dancers = publisher's device/colophon (catalog plates, folio backs, receipts, door sign); heart = favicon + wax/letter seal.
- **Type:** wordmark display-only; Cooper Black / Windsor for headings; quiet bookish serif for body and program notes.
- **Doctrine:** the shop has been open 120 years and never fully redecorated. Era-mixing is intentional (Victorian fixtures + 1930s radio + 1970s psychedelic sign + even deliberate GIF-era animation texture). Collage is the method — the room should be assembled like the Instagram collages: cut-paper objects from period ephemera, composed.
- **Ground-truth style references in project knowledge:** Circle.png, Ladder_of_Life.jpg, the Instagram screenshots, Brand_Design.pdf.

## 2. THE ROOM — MASTER SCENE

- **Canvas: 3200×2000 px, 16:10** (matches the 14" MacBook Pro). Rendered cover-fit; other screens crop edges or pan.
- **Safe zone: all interactive objects within the central ~90% width / ~85% height.** Canvas edges are atmosphere only (shelf ends, wallpaper, floorboards, ceiling).
- **Light logic:** one warm principal light source (lamp or window) — the fire-gradient hover glow should read as *lamplight touching an object*, so the room's ambient light must sit slightly below it. Kayluv-blue dusk through any window. Warm light leaking under the Back Room door.
- **Deliverable format:** layered — background wall/floor layer, mid furniture layer, individual object layers as separate transparent PNGs (enables parallax later and per-object animation swaps without re-exporting the room).

## 3. OBJECT SHOT LIST

Each interactive object needs: (a) static base PNG (transparent), (b) idle animation loop, (c) hover frame or short hover loop. Animation pipeline: draw/animate as GIF if that's comfortable → convert via ezgif.com to animated WebP/APNG (soft transparency) or to a sprite sheet (only where pause/resume matters — the Ledger is custom-coded, so likely nothing else needs sheets).

| # | Object | States to produce | Notes |
|---|---|---|---|
| 1 | **Ledger + lectern** | Book: closed, opening (3–5 hinge frames or layered lid), open. Lectern static. | Motion (bob, glow, tilt) is CODE, not frames — supply the book as clean layered art (cover / pages / spine) so code can move parts. THE hero object; most prominent lighting in the room. |
| 2 | **Till / cash register** | Static + 1 small hover sparkle/glow frame | Ornate brass register, Victorian-era. Sits at the counter, clearly separate furniture from the lectern. |
| 3 | **Bulletin board** | Static + idle flutter loop (2–4 frames) | Cork + broadsides pinned at angles. Leave a clear central slot where the Dumke notice (red accent allowed) is composited by code. |
| 4 | **Letter slot / pigeonholes** | Static + hover glow | Heart seal motif somewhere on it. |
| 5 | **Portrait (framed)** | Static + blink frame | Kayluv persona portrait; ornate frame. |
| 6 | **Cuckoo clock** | Static + tick loop + cuckoo-pop loop (4–8 frames) | Hands rendered as separate layers if possible (code sets real time); may be charmingly mis-set otherwise. |
| 7 | **Cat** | Sleep loop + blink + stretch/react loop + optional 2nd location pose | Placement candidates: windowsill, lectern top, near radio warmth. |
| 8 | **Door (ajar)** | Static ajar + creak-wider frames + warm light-leak glow layer | Unlabeled. Launch behavior: "Closed for inventory" note (small card art needed). |
| 9 | **Radio** | Static only at launch (idle glow optional) | 1930s cabinet/bakelite. Dial as separate layer for post-launch interaction. |
| 10 | **Magic lantern** | Static only at launch (idle flicker optional) | Brass, Victorian optical device. |
| 11 | **Shop signage** | Wordmark painted/mounted above counter or on window | 1970s-psychedelic sign on a Victorian shopfront = doctrine made visible. |

## 4. NON-ROOM ASSETS

- **Threshold screen:** door + star-circle device as door sign + wordmark. Paper-white, quiet.
- **Catalog plates (3 at launch):** *Angel or Alien*, *Day by Day*, *Run All Night* — illustrated cover per piece, E.T. Paull / Tin Pan Alley chromolithograph grammar filtered through the collage style; colophon stamped on each. Consistent plate dimensions (suggest 1200×1600, 3:4).
- **Dumke concert entry art:** Catalogue entry №1 + Bulletin centerpiece. Red permitted here.
- **Folio-back texture:** a shared "back of the sheet music folio" layout/texture for program notes pages.
- **Colophon SVG:** the star-circle device as clean scalable vector (stamp component used everywhere).
- **Heart favicon** + letter-seal version.
- **Gumroad/receipt dressing:** small till-receipt graphic for the Counter page.
- **Sound cues (audio assets, <1s each):** page rustle, coin clink, paper flap, brass clink, soft chime, creak, cuckoo, meow, tick, static crackle, mechanical clunk, door-open for Threshold.
- **Post-launch:** Back Room scene (dim storage, mostly-empty shelves, same 3200×2000 canvas + safe zone), lantern projection vignette mask, radio dial layers, full cutscene.

## 5. PRODUCTION PRIORITIES (matches SPEC build order)

1. Room background + furniture layout (composition first — hotspot coordinates depend on it; placeholder-quality is fine for coding to begin).
2. Ledger layered art (hero object; unblocks the custom animation).
3. Three catalog plates + Dumke entry art (unblocks the Catalogue).
4. Colophon SVG + heart favicon (used across everything).
5. Remaining object statics, then idle/hover loops incrementally — the site works with static objects; animation is enhancement, added object by object.
6. Sound cues (can be sourced/recorded in one batch session).

## 6. OPEN ART QUESTIONS FOR NEXT SESSION

- Room composition: camera height/angle, where the window sits, counter left or right, object adjacency map.
- Whether the room is drawn, collaged from period ephemera, or hybrid (recommend hybrid: drawn architecture, collaged objects — plays to existing practice).
- Catalog number stamp style (ties to SPEC open item on numbering format).
- Portrait art direction for the Kayluv persona.
