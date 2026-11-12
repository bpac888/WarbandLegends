# 0.42.0 — full character scenes and campaign milestone artwork

## Character scenes

All 14 character detail animations now use the entire character scene from the owner's two trailer uploads, rather than a short middle excerpt. Cuts run from one character transition to the next; the final title is excluded from character scenes. Source boundaries are recorded in `data/cinematic-manifest.json` and `tools/prepare-cinematics.py`.

Each clip remains silent, inline, on demand and below 2 MB at 720 × 1280. Summon reveals now finish at the matching clip's natural end rather than an 1.8-second cutoff. Skip remains available. The existing brief Qingluo battle effect and the original logo intro retain their deliberate timings. Reduced Motion and cinematic preferences still prevent playback and downloads.

## Nine milestone illustrations

Three original 1536 × 1024 illustrations per difficulty depict the river gate, dragon gardens and Crown sanctuary in the green, burning and ruined kingdom. They appear in guardian-stage previews, chapter dialogue, aftermaths and chapter completion panels. Stages 5/10 use the gate, 15/20 the gardens, and 25 the Crown approach. Regular stages and campaign map paintings remain unchanged. The campaign remains entirely static; no videos were added to it.

Generated source images remain in the workspace. Production copies use high-quality WebP at their original dimensions, approximately 6.4 MB total, and load only in relevant panels. No roster artwork, logo, gameplay, costs, rewards or save keys changed.

## Verification

- Full 61-file unit suite and build, including contiguous full-scene boundaries, media hashes and all nine required artworks.
- Phone/desktop preview images at each difficulty's three locations; image decoding at original resolution, modal overflow checks, story/aftermath navigation and unchanged map art.
- All 14 matching detail animations actually play; Inko's complete three-second action reaches its natural end. Reduced Motion prevents downloads.
- Summon reveal, skip and once-only charges/rewards; missing-video fallback; contrast checks.

Commands: `npm run check`, `npm run test:map-story`, `npm run test:cinematics`, `npm run test:contrast`.
