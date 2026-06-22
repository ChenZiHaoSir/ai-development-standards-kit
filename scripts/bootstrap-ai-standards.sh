#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR"

echo "== AI 开发规范包自动初始化 =="

if [[ -f README.md ]]; then
  echo "已找到 README.md。AI 使用前必须先读取 README 和 docs/AI_BOOTSTRAP.md。"
else
  echo "缺少 README.md。当前目录不像规范包根目录。" >&2
  exit 1
fi

if [[ -x scripts/install-skill.sh ]]; then
  scripts/install-skill.sh
else
  echo "Missing scripts/install-skill.sh" >&2
  exit 1
fi

if [[ "${SKIP_RTK:-0}" == "1" ]]; then
  echo "检测到 SKIP_RTK=1，跳过 RTK 初始化。"
elif [[ -x scripts/setup-rtk.sh ]]; then
  scripts/setup-rtk.sh || echo "RTK 初始化失败或需要手动安装。后续使用普通命令并控制输出长度。"
else
  echo "未找到 scripts/setup-rtk.sh。后续不使用 RTK。"
fi

echo
echo "初始化完成。"
echo
echo "下一步请提示用户："
echo "请描述你的项目需求。之后我会使用 \$ai-development-standards 建立开发规范、项目状态看板、专业交付物门禁和多智能体工作流。后续除代码、命令、路径、API 字段、配置项和专有名词外，我会默认使用简体中文。"
