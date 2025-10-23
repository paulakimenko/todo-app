#!/usr/bin/env bash
set -euo pipefail
source "$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)/_helpers.sh"
cd "$REPO_ROOT/test"

# Ensure deps and browsers
if [ ! -d node_modules ]; then
  (npm ci || npm install)
fi
npx playwright install

# Default base URLs if not provided
export API_BASE_URL="${API_BASE_URL:-http://localhost:8080/api}"
export CLIENT_BASE_URL="${CLIENT_BASE_URL:-http://localhost:3000}"

npx playwright test --reporter=line "$@"
