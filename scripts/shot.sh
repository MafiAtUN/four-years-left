#!/usr/bin/env bash
# Build, restart preview (sirv caches its file map at startup, so a stale
# server 404s newly hashed assets), then screenshot a path at 1920x1080.
# Usage: scripts/shot.sh <name> [path] [--no-build]
set -e
cd "$(dirname "$0")/.."

NAME="${1:-shot}"
PATHPART="${2:-/}"
SHOT_DIR="${SHOT_DIR:-/private/tmp/claude-501/-Users-mafilicious-Projects-sdg-progress-presentation/2bf17a23-4374-4057-879f-8e1d4919c8d5/scratchpad}"
mkdir -p "$SHOT_DIR"

if [ "$3" != "--no-build" ]; then
  npm run build > /tmp/build.log 2>&1 || { echo "BUILD FAILED"; tail -30 /tmp/build.log; exit 1; }
  pkill -f "vite preview" 2>/dev/null || true
  sleep 1
  nohup npm run preview -- --port 4173 > /tmp/preview.log 2>&1 &
  sleep 3.5
fi

"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" \
  --headless --disable-gpu --no-sandbox --hide-scrollbars \
  --window-size=1920,1080 \
  --screenshot="$SHOT_DIR/$NAME.png" \
  --virtual-time-budget=6000 \
  "http://localhost:4173/four-years-left$PATHPART" 2>/dev/null | grep -o "written to file.*" || true

echo "$SHOT_DIR/$NAME.png"
