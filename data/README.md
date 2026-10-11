# data/

Content data lives here.

- `notices.json` — Bulletin board notices (one object per posting). Add an
  entry to add a notice; no layout changes needed. Read by `js/bulletin.js`.
- `listen-links.json` — streaming/social platform links, shared source for
  the Bulletin's pinned listening card and (later) the `/listen/` page.
  Empty `url` renders as "coming soon" rather than a dead link.
- `catalog.json` (SPEC §7) arrives in build step 5.
- `radio.json` (SPEC §8) is post-launch.

Hotspot geometry lives in `js/hotspot-data.js` — it is configuration the room
shell needs synchronously at boot, so it ships as a plain JS object instead of
a fetched JSON file. It is still a single source of truth: retune coordinates
there and nowhere else.
