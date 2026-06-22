#!/usr/bin/env sh
set -eu

if command -v rtk >/dev/null 2>&1; then
  echo "rtk already installed: $(rtk --version)"
else
  if command -v brew >/dev/null 2>&1; then
    echo "Installing rtk with Homebrew..."
    brew install rtk
  else
    echo "Homebrew is not available. Install rtk manually:"
    echo "  curl -fsSL https://raw.githubusercontent.com/rtk-ai/rtk/refs/heads/master/install.sh | sh"
    exit 2
  fi
fi

if rtk init --help 2>/dev/null | grep -q -- "--codex"; then
  echo "Initializing rtk for Codex..."
  rtk init --codex || true
else
  echo "Initializing rtk globally..."
  rtk init --global || true
fi

cat > RTK.md <<'EOF'
# RTK - Rust Token Killer (Codex CLI)

**Usage**: Token-optimized CLI proxy for command output.

## Rule

Prefer `rtk` for exploratory, repetitive, or noisy commands when the goal is to reduce context size. Do not use it as a substitute for raw evidence on high-risk decisions.

Examples:

```bash
rtk git status
rtk git diff
rtk read path/to/file
rtk grep "pattern" .
rtk cargo test
rtk npm run build
rtk pytest -q
```

Use raw or bounded normal commands when:

- You need exact output, line numbers, exit behavior, or full diff context.
- The task involves migrations, permissions, security, billing, release, deletion, rollback, or data loss risk.
- An `rtk` summary is ambiguous or conflicts with the raw output.
- The command is already short and predictable.

For long failures, save raw logs and show a compact tail:

```bash
command > reports/command-output.txt 2>&1
tail -120 reports/command-output.txt
```

## Meta Commands

```bash
rtk gain            # Token savings analytics
rtk gain --history  # Recent command savings history
rtk proxy <cmd>     # Run raw command without filtering
```

## Verification

```bash
rtk --version
rtk gain
which rtk
```
EOF

rtk --version
rtk git status || true
