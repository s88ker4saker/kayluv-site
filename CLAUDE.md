# CLAUDE.md

Read ASSET_PIPELINE.md before any work on shop-scene objects or assets.
Read SPEC.md for site architecture and routing.
Read STYLE_GUIDE.md for visual identity and typography.
Read COPY_DECK.md for all page copy.

Standing rules:
- All triggered animations: sprite sheets + CSS steps(). GIFs only for ambient loops.
- Interactive objects are config-driven: art paths, frame counts, and positions in config, not components.
- Art is swappable. Code is permanent. The boundary is the config layer.
- All motion respects prefers-reduced-motion.
- Vanilla HTML/CSS/JS only. No frameworks.
