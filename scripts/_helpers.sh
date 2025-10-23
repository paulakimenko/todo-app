#!/usr/bin/env bash
set -euo pipefail

# Find repo root (one level up from scripts directory)
REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")"/.. && pwd)"

# Pick docker-compose command with fallback to docker compose
compose_cmd() {
  if command -v docker-compose >/dev/null 2>&1; then
    echo docker-compose
  else
    echo docker compose
  fi
}
