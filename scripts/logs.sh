#!/usr/bin/env bash
set -euo pipefail
source "$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)/_helpers.sh"
cd "$REPO_ROOT"
# Follow logs for all services or specific ones when passed as args
$(compose_cmd) logs -f "$@"
