---
name: ai-development-standards
description: Use this skill when starting a new software project, setting up project development standards, reviewing whether code or plans meet engineering standards, creating AGENTS.md/docs/templates/quality gates, or orchestrating agency-agents specialists under a Chinese development governance baseline.
---

# AI Development Standards

Use this skill to apply the user's reusable project governance baseline: development standards, architecture boundaries, security rules, QA gates, release checks, and `agency-agents` orchestration.

Default output language is Simplified Chinese. Except for code, commands, paths, API fields, config keys, database fields, protocol names, library names, framework names, error codes, and unavoidable proper nouns, generated documents and progress reports must be written in Simplified Chinese unless the user explicitly asks for another language.

## Workflow

1. Identify the project type: frontend, backend, full-stack, desktop, mobile, AI service, data service, or mixed.
2. Read the relevant references:
   - Always read `references/core-standards.md`.
   - For repo exploration, command output, logs, or worker-agent handoffs, read `references/context-budget.md`.
   - For language requirements, read the repository `docs/process/LANGUAGE_POLICY.md` when available.
   - For mandatory AI execution rules, read `docs/process/AI_ENFORCEMENT.md` when available.
   - For project lifecycle gating, read `docs/process/PROJECT_LIFECYCLE.md` when available.
   - For technology choices or dependency changes, read `docs/process/TECH_DECISION.md` when available.
   - For delivery shape, full-stack decisions, core paths, responsiveness, or stutter risks, read `docs/process/PERFORMANCE_BASELINE.md` when available.
   - For prototype review, interaction review, test case review, test submission, product acceptance, or pre-release acceptance, read `docs/process/ACCEPTANCE_GATES.md` when available.
   - For logs, monitoring, analytics events, alerts, post-release observation, or data redaction, read `docs/process/OBSERVABILITY_BASELINE.md` when available.
   - For local tool config, API keys, token handling, gstack image generation config, deployment credentials, or secret storage, read `docs/process/LOCAL_TOOL_CONFIG.md` when available.
   - For release, gray rollout, full rollout, rollback, or production observation, read `docs/release/RELEASE_PLAN.md` when available.
   - For ambiguous tasks, repeated tasks, self-review, project manuals, or reusable workflows, read `docs/process/AI_WORKFLOW_FACTORY.md` when available.
   - For implementation planning or code review, read `references/minimal-implementation.md`.
   - For new project setup, read `references/project-scaffold.md`.
   - For Agent orchestration, read `references/agent-playbook.md`.
   - For stage-to-agent routing, read `docs/agents/AGENT_ROUTER.md` when available.
   - For main-session multi-agent control, read `references/main-session-control.md`.
   - For standards feedback, local patches, or upstream improvement proposals, read `references/standards-evolution.md`.
   - For reviews or completion checks, read `references/quality-gates.md`.
   - If the kit was provided as a repo URL, zip, or folder, read the repository `README.md` and `docs/AI_BOOTSTRAP.md` first, then run `./scripts/bootstrap-ai-standards.sh` when available.
3. Produce or update the smallest useful set of artifacts:
   - `AGENTS.md`
   - `docs/process/DEVELOPMENT_STANDARDS.md`
   - `docs/process/ENGINEERING_WORKFLOW.md`
   - `docs/process/LANGUAGE_POLICY.md`
   - `docs/process/AI_WORKFLOW_FACTORY.md`
   - `docs/process/AI_ENFORCEMENT.md`
   - `docs/process/PROJECT_LIFECYCLE.md`
   - `docs/process/TECH_DECISION.md`
   - `docs/process/PERFORMANCE_BASELINE.md`
   - `docs/process/ACCEPTANCE_GATES.md`
   - `docs/process/OBSERVABILITY_BASELINE.md`
   - `docs/process/LOCAL_TOOL_CONFIG.md`
   - `docs/process/CONTEXT_BUDGET.md`
   - `docs/process/MINIMAL_IMPLEMENTATION.md`
   - `docs/process/QA_STRATEGY.md`
   - `docs/process/STANDARDS_EVOLUTION.md`
   - `docs/process/STANDARDS_UPSTREAM_CONFIG.json`
   - `docs/process/STANDARDS_FEEDBACK.md`
   - `docs/process/STANDARDS_LOCAL_PATCHES.md`
   - `docs/process/STANDARDS_UPSTREAM_PROPOSALS.md`
   - `docs/security/SECURITY.md`
   - `docs/release/RELEASE_PLAN.md`
   - `docs/release/RELEASE_CHECKLIST.md`
   - `docs/agents/MAIN_SESSION_CONTROL.md`
   - `docs/agents/AGENT_ROUTER.md`
   - `docs/agents/SPECIALIST_WORKERS.md`
   - `docs/agents/PARALLEL_DEVELOPMENT.md`
   - `docs/agents/SPECIALIST_DELIVERABLES.md`
   - `docs/workflows/WORKFLOW_TEMPLATE.md`
   - `PROJECT_PROGRESS.md` or equivalent status board
   - `.github` or platform-equivalent issue/PR templates when applicable
4. Convert rules into enforceable checks whenever the project provides the tooling: lint, typecheck, tests, build, lockfile validation, dependency scan, secret scan, smoke/E2E, and release checklist.
5. When reviewing work, lead with blockers: data loss, secret leakage, auth bypass, broken core path, unsafe AI behavior, missing rollback, missing verification.

## Operating Rules

- Do not weaken the security, testing, release, or architecture baseline without an explicit user decision.
- Default to Simplified Chinese for user-facing communication and generated project documents. Translate third-party English template text before final delivery.
- Ask only materially useful clarification questions before executing ambiguous tasks; do not pretend missing context is known.
- For project work, the main session is orchestration-only by default: user communication, clarification, lifecycle control, agent routing, dispatch, validation, integration, status, and risk decisions. It must not directly implement specialist code or documents unless the user explicitly authorizes takeover.
- If any uncertainty affects scope, architecture, contract, security, cost, release, or acceptance, stop and ask the user a concise decision question before dispatching more work.
- Project work must follow `docs/process/PROJECT_LIFECYCLE.md` and route tasks through `docs/agents/AGENT_ROUTER.md`; do not jump stages or implement outside the approved documents and status board.
- After producing plans, architecture, important docs, important code, or release steps, run a self-review pass and revise.
- Before starting implementation, read `AGENTS.md` and `docs/process/AI_ENFORCEMENT.md`; before choosing frameworks, dependencies, storage, auth, deployment, UI libraries, testing tools, or AI SDKs, read `docs/process/TECH_DECISION.md`.
- Do not choose technology only because it is fastest to implement; evaluate security, maintainability, stability, performance, ecosystem compatibility, delivery speed, and replaceability.
- Do not default to a full-stack/all-in-one delivery shape. Compare full-stack, frontend/backend split, static site, API service, mobile, mini-program, or desktop as applicable, and explain performance, deployment, maintenance, and replaceability tradeoffs before implementation.
- For core user paths, lists, charts, file operations, AI calls, database queries, SSR, full-stack API routes, or interaction feedback, set a performance budget from `docs/process/PERFORMANCE_BASELINE.md` and verify it before claiming completion.
- Prototype review, interaction review, high-level design review, scheduling review, test case review, test submission, product second acceptance, and pre-release experience checks must be recorded through `docs/process/ACCEPTANCE_GATES.md`.
- Before release, require `docs/release/RELEASE_PLAN.md` with gray/full rollout strategy, rollback conditions, owner, and post-release observation.
- Before full rollout, require `docs/process/OBSERVABILITY_BASELINE.md` coverage for error logs, performance monitoring, core analytics events, alerts, and data redaction.
- When a task repeats three or more times, propose a reusable workflow under `docs/workflows/`.
- Prefer the project's existing framework conventions over inventing a new structure.
- Keep generated standards concise enough to be read, but concrete enough to enforce.
- Apply context-budget discipline: summarize before expanding, prefer failure output over success noise, send worker agents only the context they need, and preserve raw-output paths for long logs. If `rtk` is missing and tool bootstrap is allowed, run `./scripts/setup-rtk.sh`; if installation fails, continue with bounded normal commands.
- Apply minimal implementation discipline: verify the feature needs to exist, prefer standard library/platform/native database capabilities, reuse installed dependencies, and avoid speculative abstractions.
- For AI features, require prompt versioning, centralized model calls, content review, rate limits, circuit breakers, cost tracking, and audit metadata.
- If `agency-agents` is installed, recommend specific specialist agents by task; do not claim that they ran unless they actually were invoked by the user/tooling.
- Default to a main-session control model: one user-facing orchestrator conversation, specialist workers for single-skill execution, and a status board maintained by the orchestrator.
- In Codex, specialist workers should run as background subtasks, background agents, or internal delegation units when available; do not create user-visible child windows by default unless the user explicitly asks for separate windows or threads.
- If the user explicitly asks for visible specialist worker windows, the orchestrator must switch to orchestration-only mode: dispatch, status tracking, validation, integration, risk decisions, and user questions only. It must not directly implement specialist UI, frontend, backend, QA, security, DevOps, or docs work unless the user explicitly authorizes the main session to take over implementation.
- The orchestrator must run a continuous dispatch loop: after a worker returns, validate the result, update the status board, derive the next executable tasks with `/goal`, and immediately continue dispatching until the project is complete, paused by the user, or blocked by a decision that requires user confirmation. If it does not continue dispatching, it must record the allowed stop reason in the status board.
- Ask the user only for decisions that materially affect execution, such as scope changes, technology stack changes, security exceptions, cost risk, release risk, or conflicting requirements; after confirmation, record the decision and continue dispatching.
- Before implementation, require specialist deliverables for each active role: Product, UI/UX, Frontend, Backend, QA, Security, DevOps, AI, and Docs as applicable.
- For UI/UX work, require a page inventory first. Multi-page images are allowed only for style exploration; formal development needs one dedicated UI mockup per key page, and complex pages need state mockups for empty, loading, error, unauthorized, and key modal states.
- User-facing status updates should be concise executive summaries: current stage, progress, completed work, active work, risks/blockers, user decisions needed, and next step.
- When standards gaps are discovered in a downstream project, record local patches and upstream proposals. Local patches may take effect immediately in that project; upstream changes must be submitted as reviewable proposals and never auto-merged.
- If the kit is provided as a folder or zip, read `STANDARDS_UPSTREAM_CONFIG.json` or `standards-upstream.example.json` to find the upstream Git remote before preparing a proposal.

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

```text
Use $ai-development-standards to record a standards improvement, apply it as a local patch, and prepare an upstream proposal for review.
```

```text
Use $ai-development-standards to reduce token usage while exploring this repository and running validation commands.
```
