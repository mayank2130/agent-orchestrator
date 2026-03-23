#!/bin/bash
# This script runs on Forrest where pnpm/node22 are available
set -e
cd "$(dirname "$0")/.."
pnpm install --frozen-lockfile
pnpm --filter @composio/ao-core build
cd packages/web
pnpm build
