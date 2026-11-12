# 0.45.1 — one continuous defeat fade

Previously, fallen artwork dimmed immediately and a delayed bright copy then appeared, producing a disappear/reappear effect. The outgoing portrait is now captured before the battle redraw, held until the hit lands and faded out once. Fallen artwork stays hidden through subsequent redraws. The older bright echo is removed; the brief outward defeat pulse remains.

The fade uses normal portrait colors, runs at the selected battle speed and clears on navigation. Reduced Motion hides fallen art immediately. A genuine revival/reinforcement removes any remaining fade and shows the living unit normally. Dead ally names/empty health cards remain available for identification.

No damage, death, revival, reward or timing rules in the combat engine changed.

Validation: full unit suite/build; real ally/enemy defeats at x1/x2 on phone/desktop, per-frame opacity sampling to reject reappearance, one fade per defeat, hidden underlying art across redraws, Reduced Motion, cleanup and status-feedback regression checks.
