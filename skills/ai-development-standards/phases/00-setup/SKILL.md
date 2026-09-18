---
name: 00-setup
description: Prepare a repository for the end-to-end AI development workflow by detecting conventions and creating only missing state files.
disable-model-invocation: true
---

# 00 Setup

Inspect before changing. Detect language, package manager, test runner, formatter, type checker, build command, deployment entry point, existing instructions, and issue tracker.

Create only missing files:

- `docs/CONTEXT.md` for project vocabulary and domain facts;
- `docs/PROJECT-STATE.md` for phase, decisions, checks, risks, and next action;
- `docs/adr/` for architecture decisions;
- `docs/specs/` for approved specifications;
- `docs/tickets/` when no external tracker is configured.

Never overwrite existing project instructions. Link to them from the state file.

Exit gate: report detected commands and conventions, identify missing project inputs, and ask for confirmation of scope and tracker before discovery.
