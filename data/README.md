# data/

Content data lives here.

- `catalog.json` (SPEC §7) arrives in build step 5.
- `radio.json` (SPEC §8) is post-launch.

Hotspot geometry lives in `js/hotspot-data.js` — it is configuration the room
shell needs synchronously at boot, so it ships as a plain JS object instead of
a fetched JSON file. It is still a single source of truth: retune coordinates
there and nowhere else.
