#!/usr/bin/env bash
# Regenerate public/og-image.png from the app icon + tagline.
# Requires ImageMagick 7 (magick).
set -euo pipefail
cd "$(dirname "$0")/.."

OUT="public/og-image.png"
ICON="public/icon.png"

magick \
  -size 1200x630 \
  gradient:'#1A0F1F-#0B0610' \
  \( "$ICON" -resize 220x220 \) -gravity West -geometry +120+0 -composite \
  -font Helvetica-Bold -pointsize 76 -fill '#FFFFFF' \
  -gravity West -annotate +380+-40 'Zero Balance' \
  -font Helvetica -pointsize 36 -fill '#E4D4E8' \
  -gravity West -annotate +380+40 'Spend leftover Apple Account balance' \
  -font Helvetica -pointsize 26 -fill '#C32DAC' \
  -gravity SouthEast -annotate +60+50 'zerobalance.pro' \
  "$OUT"

echo "wrote $OUT"
