---
name: ai-development-standards
description: Use this skill when starting a new software project, setting up project development standards, reviewing whether code or plans meet engineering standards, creating AGENTS.md/docs/templates/quality gates, or orchestrating agency-agents specialists under a Chinese development governance baseline.
---

# AI Development Standards

Use this skill to apply the user's reusable project governance baseline: development standards, architecture boundaries, security rules, QA gates, release checks, and `agency-agents` orchestration.

## Workflow

1. Identify the project type: frontend, backend, full-stack, desktop, mobile, AI service, data service, or mixed.
2. Read the relevant references:
   - Always read `references/core-standards.md`.
   - For new project setup, read `references/project-scaffold.md`.
   - For Agent orchestration, read `references/agent-playbook.md`.
   - For main-session multi-agent control, read `references/main-session-control.md`.
   - For reviews or completion checks, read `references/quality-gates.md`.
3. Produce or update the smallest useful set of artifacts:
   - `AGENTS.md`
   - `docs/process/DEVELOPMENT_STANDARDS.md`
   - `docs/process/ENGINEERING_WORKFLOW.md`
   - `docs/process/QA_STRATEGY.md`
   - `docs/security/SECURITY.md`
   - `docs/release/RELEASE_CHECKLIST.md`
   - `docs/agents/MAIN_SESSION_CONTROL.md`
   - `docs/agents/SPECIALIST_WORKERS.md`
   - `docs/agents/PARALLEL_DEVELOPMENT.md`
   - `PROJECT_PROGRESS.md` or equivalent status board
   - `.github` or platform-equivalent issue/PR templates when applicable
4. Convert rules into enforceable checks whenever the project provides the tooling: lint, typecheck, tests, build, lockfile validation, dependency scan, secret scan, smoke/E2E, and release checklist.
5. When reviewing work, lead with blockers: data loss, secret leakage, auth bypass, broken core path, unsafe AI behavior, missing rollback, missing verification.

## Operating Rules

- Do not weaken the security, testing, release, or architecture baseline without an explicit user decision.
- Prefer the project's existing framework conventions over inventing a new structure.
- Keep generated standards concise enough to be read, but concrete enough to enforce.
- For AI features, require prompt versioning, centralized model calls, content review, rate limits, circuit breakers, cost tracking, and audit metadata.
- If `agency-agents` is installed, recommend specific specialist agents by task; do not claim that they ran unless they actually were invoked by the user/tooling.
- Default to a main-session control model: one user-facing orchestrator conversation, specialist worker conversations for single-skill execution, and a status board maintained by the orchestrator.

## Common Prompts

```text
Use $ai-development-standards to initialize development standards and agent workflow for this repository.
```

```text
Use $ai-development-standards to review whether this feature is ready to merge.
```

```text
Use $ai-development-standards to create AGENTS.md, docs/process, security baseline, QA strategy, and PR templates.
```

```text
Use $ai-development-standards to run this project with one main orchestrator session and specialist worker agents for UI, frontend, backend, QA, security, DevOps, and docs.
```
