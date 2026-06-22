# Context Budget

Use this reference when exploring a repo, running commands, delegating to worker agents, reading logs, reviewing diffs, or trying to reduce token usage.

## Rule

Give the model enough information to decide, not every byte that exists.

Prefer:

- Summary before full output.
- Failures before successful noise.
- File list before file contents.
- Search hits before full files.
- Diff stat/name-only before full diff.
- Truncated, grouped, deduplicated logs.
- Saved raw output path for recovery.

## RTK

`rtk` is a recommended optional tool, not a runtime dependency. It compresses CLI output before it enters the AI context. It must not change source code, build artifacts, or project behavior.

If `rtk` is missing and the project allows tool bootstrap, run:

```bash
./scripts/setup-rtk.sh
```

Install policy:

- Use `brew install rtk` when Homebrew exists.
- If Homebrew is missing, print the official install command and ask for the environment/user decision.
- If installation fails, continue with normal bounded commands.
- Do not add `rtk` to application dependencies or lockfiles unless the project itself is a developer-tooling project.

If `rtk` is installed, prefer compact command proxies:

```bash
rtk git status
rtk git diff
rtk git log -n 10
rtk read path/to/file
rtk grep \"pattern\" .
rtk find \"*.ts\" .
rtk pytest
rtk pnpm test
rtk tsc
rtk lint
rtk gain
```

For Codex, initialize optional instructions with:

```bash
rtk init --codex --dry-run
rtk init --codex
```

Only use a global hook when the user permits global config changes:

```bash
rtk init --global
```

If unavailable, use normal commands with limits:

```bash
rg --files
rg -n \"pattern\" .
sed -n '1,220p' file
git diff --stat
git diff --name-only
git log --oneline -n 20
command 2>&1 | tail -120
```

## Worker Agent Context

Send worker agents only:

- `/goal`
- Relevant files
- Key snippets or contracts
- Acceptance criteria
- Allowed and forbidden files
- Known risks

Do not send the whole repo, complete logs, full PRD, and full diff to every worker by default.

## Evidence

Token saving must not remove:

- Failing test errors.
- Security findings.
- Release verification commands and conclusions.
- Performance metrics.
- Raw output paths for long logs.

When using `rtk`:

- For high-risk decisions such as migrations, permissions, security, billing, release, deletion, or rollback, inspect the relevant raw output or full diff snippet.
- For failed tests, builds, or security scans, use `rtk` for the first pass, but preserve the failing command, key error, and raw log path.
- If the `rtk` summary conflicts with raw output, trust the raw output.
