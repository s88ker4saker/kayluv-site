# KAYLUV.SITE — SPEC.md
*Master build specification. Source of truth for all coding sessions. Place this file in the repo root.*
*Companion document: ASSET_BRIEF.md (art production — separate sessions).*

---

## 1. PROJECT IN ONE PARAGRAPH

A fan-facing portfolio/music hub for Kayluv (presenter identity of composer Caleb Martin), built as an immersive worldbuilt site: a turn-of-the-century music publishing house rendered as a point-and-click illustrated room. The visitor enters the shop; every section of the site is a physical object in the room. The catalog runs backward in time from the December Dumke concert. The house doctrine resolving all visual-era inconsistency: **the shop has been open 120 years and never fully redecorated** (Victorian fixtures, 1930s radio, 1970s psychedelic signage coexist deliberately — Ives-style collage as interior design).

## 2. LOCKED DECISIONS (do not re-derive)

- **Names:** Caleb Martin = legal/professional (credentials, scores, resume). Kayluv = presenter identity ("Kayluv presents [Piece]", "Kayluv and the [Ensemble]").
- **Timeline:** catalog ordered backward in time from the December Dumke concert (entry №1).
- **Structure:** point-and-click shop interior as hub; publishing-house frame.
- **Till and Ledger are two separate objects** — cash register at the store counter (→ Counter/downloads) vs. floating book on a lectern (→ Catalogue).
- **Portrait, not voiced shopkeeper** for the Proprietor/about page.
- **Gear icon, top-right, always visible:** opens a dialogue with (a) quick nav to every section of the site, (b) sound on/off + volume. Immersion for those who want it, immediacy for those who don't.
- **Back Room (post-launch):** dim, cramped storage room — shelves mostly empty, awaiting future objects.

## 3. TECH DECISIONS (confirmed this session)

| Decision | Value |
|---|---|
| Stack | Vanilla HTML/CSS/JS. No framework. |
| Architecture | **Hybrid shell + overlay router** (see §4) — required by the persistent-radio feature; adopt from day one even though radio ships post-launch. |
| Hosting | Netlify (default — free tier, Git deploys, custom domain). Override allowed. |
| Newsletter | Kit (free tier) — embedded form on Correspondence. |
| Payments/downloads | Gumroad — Counter links out to (or embeds) Gumroad products per score. |
| Folio URLs | Real pages per piece (`/catalogue/angel-or-alien/`), each a genuine standalone HTML file. |
| Audio (recordings) | Streaming embeds per folio + `/listen` link-tree utility page (Spotify, YouTube, etc.) reachable from gear menu. Radio object is NOT the streaming hub. |
| Room master canvas | **3200×2000 px (16:10)** — matches the 14" MacBook Pro primary display. Rendered `cover`, centered. |
| Hotspot safe zone | All interactive objects inside central ~90% width / ~85% height of the canvas. Edges = atmosphere only. |
| Mobile | Full-height room image, horizontal touch-pan. Same asset, no separate layout. |
| Accessibility | Gear-menu nav doubles as the non-mouse path; hotspots keyboard-focusable; `prefers-reduced-motion` disables idle loops and skips cutscene; alt/plain nav always in DOM. |

## 4. ARCHITECTURE — SHELL + OVERLAY ROUTER

**Why:** the radio's audio must persist while the visitor browses. Full page loads kill audio. Solution: the shop is a persistent shell; destinations open as overlays.

- `index.html` loads the room (art layers, hotspot SVG overlay, gear menu, audio manager).
- Clicking an object fetches the destination page's HTML fragment and opens it in an **overlay panel** above the dimmed room; `history.pushState` sets the real URL.
- Every destination also exists as a **complete standalone HTML page** at its real URL (for deep links, SEO, sharing). Each standalone page includes a small script: if loaded directly, it renders itself normally with a "Return to the Shop" link; content is authored once (fragment included by both paths — a tiny build step or SSI-style include is acceptable).
- Back button / Escape closes the overlay, returns to the room, audio uninterrupted.
- Audio manager: single global module (Web Audio or pooled `<audio>`), unlocked by the Threshold click, controlled by the gear dialogue; later hosts the radio's persistent playback state.

## 5. SITE MAP

```
/                         Threshold → Cutscene (first visit) → SHOP INTERIOR (hub shell)
/catalogue/               The Catalogue (ledger ToC, backward from Dumke)
/catalogue/[slug]/        Folios — one real page per piece
/counter/                 Pay-what-you-will scores (Gumroad)
/bulletin/                News & performances (JSON-driven)
/correspondence/          Contact, socials, Kit newsletter signup
/proprietor/              Kayluv (front) / Caleb Martin credentials (flip)
/listen/                  Link-tree: Spotify, YouTube, etc. (gear menu; not an object)
/lantern/                 [POST-LAUNCH] visual art viewer
/radio/                   [POST-LAUNCH] radio art piece (see §8)
/backroom/                [POST-LAUNCH] storage room scene
```

## 6. SHOP INTERIOR — OBJECT TABLE

| Object | Destination | Idle | Hover | Click | Sound | Method | Launch? |
|---|---|---|---|---|---|---|---|
| Ledger (lectern) | /catalogue/ | Levitates (sine bob), breathes, page-flutter; the ONLY floating object | Stills, tilts toward cursor, glow | Opens (hinge anim) → overlay | Page rustle | **Custom CSS/JS (procedural)** | ✅ |
| Till (counter) | /counter/ | Static/subtle | Fire-gradient glow | → overlay | Coin/brass clink | Sprite | ✅ |
| Bulletin board | /bulletin/ | Papers flutter | Highlight | → overlay | Paper flap | Sprite; JSON content | ✅ |
| Letter slot / pigeonholes | /correspondence/ | Idle | Glow | → overlay | Brass clink | Sprite | ✅ |
| Portrait | /proprietor/ | Occasional blink | Brighten | → overlay | Soft chime | Sprite (1–2 frames) | ✅ |
| Cuckoo clock | none | Ticks; hands track real local time; may be slightly mis-set | — | Cuckoo pop on interval | Cuckoo | Sprite + setInterval | ✅ |
| Cat | none | Sleeps/blinks | Reacts | Stretch/meow; may relocate between visits (localStorage) | Meow | Sprite | ✅ |
| Door (ajar) | /backroom/ | Warm light leak, unlabeled | Creaks wider | Launch: in-world "Closed for inventory" note. Post-launch: → Back Room | Creak | Sprite | Art ✅ / dest ⏳ |
| Radio | /radio/ | Present as static furniture at launch | — | (post-launch: dial interaction) | Static crackle | Sprite | Art ✅ / dest ⏳ |
| Magic lantern | /lantern/ | Present as static furniture at launch | — | (post-launch: projection viewer) | Clunk | Sprite | Art ✅ / dest ⏳ |
| Gear icon (UI, not in-scene art) | Nav + sound dialogue | Always visible top-right | — | Opens settings/nav panel | Soft click | CSS/SVG | ✅ |

**Shared systems:** percentage-coordinate SVG hotspots over the room image; one shared fire-gradient hover glow class; sprite animation via class-toggled swap (static ⇄ animated WebP/APNG) or CSS `steps()` sprite sheets (GIF→sprite conversion via ezgif.com); sound pool preloaded, gated behind Threshold click.

## 7. CATALOG DATA MODEL

Single source: `data/catalog.json`. Folio pages and Catalogue ToC generate from it (small build script or hand-synced at first — keep the JSON authoritative either way).

```json
{
  "pieces": [
    {
      "slug": "angel-or-alien",
      "title": "Angel or Alien",
      "catalogNumber": "KL-___",
      "presenter": "Kayluv presents",
      "year": 2025,
      "instrumentation": "Voice and Piano",
      "programNotes": "…",
      "lyrics": "…",
      "audioEmbed": null,
      "streamLinks": {},
      "scoreGumroadUrl": "…",
      "coverArt": "/assets/plates/angel-or-alien.png",
      "status": "launch"
    }
  ]
}
```

**Launch inventory (confirmed):**
1. *Angel or Alien* — score ✅ art ✅ audio ⏳
2. *Day by Day* — score ✅ art ✅ audio ✅
3. *Run All Night* — score ✅ art ✅ audio ⏳
Plus the December Dumke concert as Catalogue entry №1 (event entry, links to /bulletin/ until it becomes an archival entry). Senior-project pieces join the JSON as they're completed.

## 8. POST-LAUNCH FEATURES (architecture supports now, build later)

- **Radio (art piece, not a link hub):** a database of sounds (`data/radio.json` — own recordings + public-domain works). Drag the dial → scrubs randomly between entries with static crossfade; when the dial stops, that entry plays. On/off switch. **Playback persists across the whole site** via the global audio manager + overlay architecture.
- **Magic lantern:** click → room dims → artwork projected in circular vignette, advancing with mechanical clunk (carousel underneath).
- **Back Room:** dim cramped storage scene, mostly-empty shelves for future objects; at least one unlabeled discoverable.
- **Cutscene upgrade:** launch may ship the lite in-engine "lights up" only; full first-visit video cutscene can arrive later (localStorage-gated, skippable, reduced-motion-aware).

## 9. BUILD ORDER

1. Repo + Netlify deploy pipeline + this SPEC.md at root.
2. Shell: room container (cover-fit 3200×2000 placeholder), SVG hotspot overlay w/ percentage coords, fire-glow hover class, gear menu (nav + sound stub).
3. Overlay router (fetch + pushState + standalone fallback pages) — **before** any destination pages.
4. Ledger procedural animation (bob/glow/tilt/open) against placeholder art.
5. Catalogue lite page-fold + catalog.json wiring + 3 launch folios + Dumke entry.
6. Counter (Gumroad), Bulletin (JSON), Correspondence (Kit embed), Proprietor (flip), /listen/.
7. Sound layer: audio manager, per-object cues, gear volume control.
8. Threshold + lite lights-up intro; sprite objects swapped in as art completes.
9. Post-launch: radio, lantern, Back Room, full cutscene.

## 10. STILL OPEN (small)

- Hosting override if not Netlify.
- Catalog number format (e.g., "KL-001" vs. year-based).
- Whether ambient room hum ships at launch (gear-controlled, default off) or waits for the radio.
- Domain name.
