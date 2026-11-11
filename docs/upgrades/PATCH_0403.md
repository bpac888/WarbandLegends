# 0.40.3 — original trailer ending, readable faction details and dialogue bubbles

The intro now preserves the original clear final logo scene from the second owner-supplied trailer part. It has no Gaussian blur, overlaid crest, replacement wordmark or branding panel. The clean scene starts at 13.65 seconds; its final frame is held briefly so the intro lasts two seconds without showing the preceding character crossfade. The main splash and in-game branding are unchanged. Media URLs now include the release version so an older blurred clip cannot remain cached under the same request URL.

Expanded faction-bonus articles inside pre-battle previews now explicitly use dark copy on warm parchment. The fix covers campaign, dungeon, arena and weekly previews that share this component. Previously only the collapsed summary had been included in the contrast check; the test now opens the actual campaign faction details and checks their paragraphs and labels at phone and desktop widths.

Story dialogue now uses left/right speech bubbles. The first speaker remains left-aligned and the second remains right-aligned, with names above the bubbles. Returning speakers keep their side, and the text remains left-aligned inside the bubble. The two sides have subtly different paper colors and dark text.

Validation: 59 test files and build pass; targeted browser checks pass for the original intro without replacement overlays, replay/Skip, actual expanded campaign faction text, measured contrast and left/right bubble positions across phone and desktop sizes. The video manifest and reproducible cutting tool record the updated clip.
