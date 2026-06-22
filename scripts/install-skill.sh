#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
SOURCE_DIR="$ROOT_DIR/skills/ai-development-standards"
TARGET_DIR="${CODEX_HOME:-$HOME/.codex}/skills/ai-development-standards"

if [[ ! -f "$SOURCE_DIR/SKILL.md" ]]; then
  echo "Missing skill source: $SOURCE_DIR/SKILL.md" >&2
  exit 1
fi

mkdir -p "$(dirname "$TARGET_DIR")"
rm -rf "$TARGET_DIR"
cp -R "$SOURCE_DIR" "$TARGET_DIR"

echo "Installed ai-development-standards skill to $TARGET_DIR"
