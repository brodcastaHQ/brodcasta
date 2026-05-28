#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

echo "==> Starting Adminer (database UI) at http://localhost:4040"
echo "    Server: postgres / Database: brodcasta / User: brodcasta"
echo ""

cd "$SCRIPT_DIR"

docker compose up -d postgres adminer

echo ""
echo "==> Adminer is running at http://localhost:4040"
echo "    Login with: brodcasta / brodcasta_password"
