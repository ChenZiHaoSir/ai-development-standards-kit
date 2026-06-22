# Core Standards

## Project Principles

- Build for the core user path first.
- MVP means one closed, verifiable, deliverable workflow.
- Use mature, maintained frameworks unless the architecture document justifies an exception.
- Completion means stable user success, not just code that runs.
- Product, architecture, testing, release, and security docs must change with implementation.

## Architecture Boundaries

- Presentation layer: pages, components, interactions, display state.
- Application layer: user flow, business orchestration, combined state.
- Domain layer: core models, rules, pure logic.
- Infrastructure layer: database, files, network, third-party SDKs, system capabilities.
- Shared layer: UI, formatting, logging, errors, config, validation.

Rules:

- Dependencies flow one way.
- UI must not directly call databases, filesystems, secrets, AI providers, or third-party SDKs.
- External calls go through adapters/clients.
- Config, env vars, constants, enums, timeouts, pagination limits, retries, and model names are centralized.
- Duplicate logic appearing twice should be extracted.

## Reuse and Duplication Control

- If the same business logic appears at least twice, extract it into a function, hook, service, domain rule, adapter, or component.
- If logic is similar and differs only by parameters, fields, copy, status, or policy, prefer a configurable or composable implementation.
- Centralize auth, permissions, logging, error handling, form validation, data fetching, caching, AI calls, SDK initialization, redaction, pagination, retries, and rate limits.
- Reuse UI controls for buttons, tables, dialogs, forms, upload, export, empty/loading/error states, and permission states.
- Before adding a similar feature, search for existing reusable code; if not reused, explain why.
- Avoid premature abstraction. Extract only when there is real repetition, a stable variation point, or a clear reuse path.
- Shared helpers need clear names, typed inputs/outputs, boundary handling, and tests where risk justifies it.

## Security

- Classify data before choosing storage, transport, and logging.
- Never commit secrets, tokens, real user data, local config, screenshots with sensitive data, or generated artifacts.
- Server-side authorization is mandatory; frontend hiding is not authorization.
- Logs must be structured, minimal, and redacted.
- Dangerous operations need confirmation, audit, undo, rollback, or compensating action.

## AI Features

- AI calls are centralized and user-triggered unless product docs explicitly authorize otherwise.
- Prompts are templated, versioned, reviewed, and regression-tested.
- AI output does not directly overwrite user original content.
- Model calls need timeouts, retries only for retryable errors, concurrency limits, rate limits, circuit breakers, fallbacks, and cost tracking.
- Store audit metadata, not raw sensitive content.

## Completion Definition

A feature is done only when acceptance criteria pass, key risks are tested or explicitly verified, security and privacy are preserved, performance impact is understood, docs are updated, and the workspace contains no unrelated or unsafe changes.
