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

