#!/usr/bin/env bash
# Export Evy discovery frames from Figma as 1x PNGs.
#
#   export FIGMA_TOKEN=figd_xxx
#   ./scripts/figma-export.sh [outdir]
#
# Token: figma.com → Settings → Security → Personal access tokens
#        scope "File content: read-only"

set -euo pipefail

FILE_KEY="SpqZoKXhZ9C0CghU6Lvs39"
SCALE=2
OUT="${1:-$HOME/Desktop/evy-discovery}"

: "${FIGMA_TOKEN:?Set FIGMA_TOKEN first (see header)}"

# node-id : output filename
FRAMES=(
  # ============ UNIT 1 — the app opens (3-up) ============
  "5367:37227|u1a-home"             # Discover: near you / along a route / 10+ networks
  "4607:32645|u1b-trips-home"       # Trips: wallet, saved plans, most viewed
  "4610:36364|u1c-my-vehicles"      # garage, primary EV drives compatibility

  # ============ UNIT 2 — finding a charger (3-up) ============
  "7147:62750|u2a-map"              # map, price-tagged pins, AROUND New Delhi
  "9365:3709|u2b-list"              # list: network, Available, rating, connectors
  "7017:58917|u2c-filters"          # connector / speed / network / preferences

  # ============ UNIT 3 — the charger itself (1 hero) ============
  "9363:90991|u3-charger-detail"    # choose a connector, kW, price, compatibility

  # ============ UNIT 4 — operator networks (2-up) ============
  "9028:10534|u4a-network-map"      # JioBP-branded network, map
  "9028:10500|u4b-network-list"     # JioBP-branded network, list

  # ============ UNIT 5 — planning a trip (3-up) ============
  "4607:32910|u5a-choose-vehicle"   # choose a vehicle for your trip
  "4607:32595|u5b-no-route"         # could not plan: not enough fast charging
  "4607:31945|u5c-plan-result"      # 412 km, 2 stops, 324 kWh, total to pay

  # ============ UNIT 6 — the plan in detail (2-up) ============
  "4607:32491|u6a-route-details"    # route details, battery SoC, feedback
  "4607:31735|u6b-plan-detail"      # 375x1807 long itinerary (tall: pans in gallery)
)

mkdir -p "$OUT"

ids=$(IFS=,; set -- "${FRAMES[@]}"; printf '%s' "$(for f in "$@"; do printf '%s,' "${f%%|*}"; done)" | sed 's/,$//')

echo "Requesting ${#FRAMES[@]} frames at ${SCALE}x…"
resp=$(curl -sS -H "X-Figma-Token: $FIGMA_TOKEN" \
  "https://api.figma.com/v1/images/$FILE_KEY?ids=$ids&format=png&scale=$SCALE")

if echo "$resp" | grep -q '"err":[^n]'; then
  echo "Figma API error:"; echo "$resp"; exit 1
fi

for entry in "${FRAMES[@]}"; do
  id="${entry%%|*}"; name="${entry##*|}"
  url=$(echo "$resp" | python3 -c "
import json,sys
d=json.load(sys.stdin).get('images',{})
print(d.get('$id') or '')
")
  if [ -z "$url" ]; then
    echo "  SKIP $name — no image returned for $id"
    continue
  fi
  curl -sS -o "$OUT/$name.png" "$url"
  printf '  %-28s %s\n' "$name.png" "$(du -h "$OUT/$name.png" | cut -f1)"
done

echo "Done → $OUT"
