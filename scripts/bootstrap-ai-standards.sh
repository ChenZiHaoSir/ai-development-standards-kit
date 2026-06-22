#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR"

echo "== AI Development Standards Kit bootstrap =="

if [[ -f README.md ]]; then
  echo "README.md found. AI should read it before using this kit."
else
  echo "Missing README.md. This does not look like the standards kit root." >&2
  exit 1
fi

if [[ -x scripts/install-skill.sh ]]; then
  scripts/install-skill.sh
else
  echo "Missing scripts/install-skill.sh" >&2
  exit 1
fi

if [[ "${SKIP_RTK:-0}" == "1" ]]; then
  echo "Skipping RTK setup because SKIP_RTK=1."
elif [[ -x scripts/setup-rtk.sh ]]; then
  scripts/setup-rtk.sh || echo "RTK setup failed or needs manual installation. Continue with bounded normal commands."
else
  echo "scripts/setup-rtk.sh not found. Continue without RTK."
fi

echo
echo "Bootstrap complete."
echo
echo "Next prompt for the user:"
echo "请描述你的项目需求。之后我会使用 \$ai-development-standards 建立开发规范、项目状态看板、专业交付物门禁和多智能体工作流。"
