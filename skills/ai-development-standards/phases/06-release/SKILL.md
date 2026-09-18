---
name: 06-release
description: Prepare a validated project for deployment, operations, rollback, documentation, and handoff.
disable-model-invocation: true
---

# 06 Release

Create or update the repository's README, release plan, release checklist, and operations documentation. Record setup, usage, architecture, environment variables, migrations, monitoring, rollback, recovery, and post-release observation.

Before release, confirm:

- no secrets, real user data, or local paths are committed;
- destructive operations are explicit;
- migrations are reversible or documented;
- deployment steps are reproducible;
- rollback conditions and owners are named;
- required checks are complete or explicitly marked as skipped with risk.

Produce a handoff summary containing changed areas, evidence, unresolved decisions, known limitations, and the safest next step.
