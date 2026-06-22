# Project Scaffold

Recommended documentation structure for a new project:

```text
README.md
AGENTS.md
PROJECT_PROGRESS.md
TODOS.md
CHANGELOG.md
docs/
  product/
    PRD.md
    UX_SPEC.md
    ROADMAP.md
  engineering/
    ARCHITECTURE.md
    DEVELOPMENT_PLAN.md
  process/
    DEVELOPMENT_STANDARDS.md
    ENGINEERING_WORKFLOW.md
    QA_STRATEGY.md
    RISK_REGISTER.md
    STANDARDS_FEEDBACK.md
    STANDARDS_LOCAL_PATCHES.md
    STANDARDS_UPSTREAM_PROPOSALS.md
  security/
    SECURITY.md
  release/
    RELEASE_PLAN.md
    RELEASE_RUNBOOK.md
    RELEASE_CHECKLIST.md
```

Minimum new-project checklist:

- Product main path and MVP non-goals are written.
- Framework and directory conventions are selected.
- Architecture boundaries and data flow are documented.
- Unified commands exist for lint, typecheck, test, smoke when applicable, and build.
- CI runs lockfile validation, lint, typecheck, test, build, dependency scan, and secret scan.
- Sensitive data handling, permissions, logging, and audit rules are documented.
- PR and issue templates exist.
- Release checklist and rollback plan exist.
- Project progress and TODO tracking are explicit.
- Standards feedback and local patch tracking exist when the project is using this standards kit.
