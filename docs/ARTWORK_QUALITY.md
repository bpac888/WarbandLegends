# Character Artwork Quality

Audited all 189 portraits. The original import reduced 131 older images to approximately 480×640 at WebP quality 79. This left fewer pixels for high-density phones and large character-detail views than the newer 768×1152 portraits.

Those 131 images now use their original source resolution and WebP quality 92. No new artwork, sharpening, invented detail, recoloring or composition changes were applied. The 58 portraits already supplied at higher resolution are retained. Source artwork is read from the original archive; draft1 is unchanged. The import tool now retains higher resolution for future imports.

`data/artwork-quality-audit.json` records all 189 dimensions and source fingerprints for restored images. Browser checks cover every portrait in the Codex and every character page at phone and desktop widths, including loading, resolution, image filters, opacity and horizontal overflow. The roster data, stats, IDs, abilities and saves are unchanged.

Resolution is one source of softness. Some original paintings have softer brushwork or atmospheric depth; preserving those originals cannot make every style equally crisp. Combat flashes, ready glows and fallen-character treatment remain intentional.
