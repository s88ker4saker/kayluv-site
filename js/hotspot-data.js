/*
 * KAYLUV.SITE — hotspot geometry (build step 2, SPEC §9)
 *
 * Single source of truth for hotspot placement. Coordinates are PERCENTAGES
 * of the room canvas (3200×2000, SPEC §3), so they stay glued to their
 * objects at any screen size. When real collage art replaces the placeholder,
 * retune coordinates HERE only — nothing is hardcoded in index.html.
 *
 * The rectangles in assets/room-placeholder.svg mirror these values (that
 * file is the disposable composition template; this file is authoritative).
 *
 * Fields:
 *   id             stable slug, also emitted as data-object for styling/anims
 *   label          accessible name (aria-label + SVG <title>)
 *   href           destination URL (SPEC §5) or null for in-room-only objects
 *   coords         { x, y, w, h } in % of canvas
 *   staticAtLaunch true = furniture only for now (SPEC §6: Radio, Lantern
 *                  have no hover/click at launch) — no hotspot is rendered,
 *                  but coordinates are kept here for their post-launch steps.
 */
window.ROOM_HOTSPOTS = {
  canvas: { width: 3200, height: 2000 },

  /* SPEC §3: central 90% width / 85% height */
  safeZone: { x: 5, y: 7.5, w: 90, h: 85 },

  objects: [
    {
      id: "ledger",
      label: "The Ledger — browse the Catalogue",
      href: "/catalogue/",
      coords: { x: 41.5625, y: 45, w: 14.6875, h: 33 }
    },
    {
      id: "till",
      label: "The Till — scores at the Counter",
      href: "/counter/",
      coords: { x: 64.0625, y: 50, w: 14.6875, h: 21 }
    },
    {
      id: "bulletin",
      label: "Bulletin board — news and performances",
      href: "/bulletin/",
      coords: { x: 8.125, y: 21, w: 17.5, h: 28 }
    },
    {
      id: "letter-slot",
      label: "Letter slot — Correspondence",
      href: "/correspondence/",
      coords: { x: 28.125, y: 19, w: 11.875, h: 25 }
    },
    {
      id: "portrait",
      label: "Portrait of the Proprietor",
      href: "/proprietor/",
      coords: { x: 53.125, y: 16, w: 11.25, h: 24 }
    },
    {
      id: "clock",
      label: "Cuckoo clock",
      href: null,
      coords: { x: 42.8125, y: 11.5, w: 7.1875, h: 19.5 }
    },
    {
      id: "cat",
      label: "The shop cat",
      href: null,
      coords: { x: 10.625, y: 67.5, w: 11.25, h: 15 }
    },
    {
      id: "door",
      label: "A door, ajar",
      href: "/backroom/",
      coords: { x: 81.875, y: 15, w: 12.5, h: 63 }
    },
    {
      id: "radio",
      label: "Radio",
      href: "/radio/",
      coords: { x: 66.875, y: 28, w: 10.625, h: 16 },
      staticAtLaunch: true
    },
    {
      id: "lantern",
      label: "Magic lantern",
      href: "/lantern/",
      coords: { x: 28.125, y: 57.5, w: 9.375, h: 17.5 },
      staticAtLaunch: true
    }
  ]
};
