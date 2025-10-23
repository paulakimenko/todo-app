#!/usr/bin/env bash
set -euo pipefail
source "$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)/_helpers.sh"
cd "$REPO_ROOT"

run_client_tests() {
  pushd client >/dev/null
  if [ ! -d node_modules ]; then
    (npm ci || npm install)
  fi
  # CRA tests non-interactive
  CI=1 npm test -- --watchAll=false
  popd >/dev/null
}

run_server_tests() {
  pushd server >/dev/null
  if [ ! -d node_modules ]; then
    (npm ci || npm install)
  fi
  npx jest --runInBand
  popd >/dev/null
}

run_client_tests
run_server_tests
