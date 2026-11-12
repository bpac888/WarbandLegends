# 0.45.2 — protect battles from edge-back swipes

Applies equally to Safari tabs and the standalone Home Screen app. Active battles cancel left-edge touch starts that Safari uses for history navigation, and disable horizontal overscroll navigation. The existing board pointer input remains responsible for matches.

As a fallback, a browser Back/hash navigation restores the battle URL and asks whether to stay or exit before abandoning the in-memory fight. Staying preserves the exact battle, Energy and rewards. Confirming exit returns to the requested game page and retains the normal no-refund rule. The ordinary battle exit button uses the same confirmation. Non-battle browser navigation and completed battle results remain unchanged.

Verification: unit suite/build; emulated real edge-start touch matching and edge taps; browser Back/Stay state preservation and confirmed destination; normal touch swipe/tap regression; explicit exit.
