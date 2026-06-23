# Core Standards

## Project Principles

- Build for the core user path first.
- MVP means one closed, verifiable, deliverable workflow.
- Use mature, maintained frameworks unless the architecture document justifies an exception.
- Completion means stable user success, not just code that runs.
- Product, architecture, testing, release, and security docs must change with implementation.
- Default to the minimum implementation that satisfies the user goal without weakening safety, validation, accessibility, or data protection.

## Minimal Implementation Ladder

Before writing custom code, stop at the first option that works:

1. Does this need to exist? If speculative, skip it.
2. Does the language standard library do it? Use that.
3. Does the native platform, browser, operating system, database, or cloud feature cover it? Use that.
4. Does an already-installed dependency solve it? Reuse it.
5. Can it be one or two clear lines? Keep it that small.
6. Only then write the minimum custom implementation.

Do not create abstractions, factories, plugin systems, configuration, or layers for a single implementation or hypothetical future need.

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
- API keys, tokens, local tool config, vendor credentials, and cloud credentials must stay in the user's home directory, system secret store, or explicitly ignored local paths. They must never be copied into the repository, npm package, PR, issue, log, screenshot, GitHub, or Gitee.

## AI Features

- AI calls are centralized and user-triggered unless product docs explicitly authorize otherwise.
- Prompts are templated, versioned, reviewed, and regression-tested.
- AI output does not directly overwrite user original content.
- Model calls need timeouts, retries only for retryable errors, concurrency limits, rate limits, circuit breakers, fallbacks, and cost tracking.
- Store audit metadata, not raw sensitive content.

## Completion Definition

A feature is done only when acceptance criteria pass, key risks are tested or explicitly verified, security and privacy are preserved, performance impact is understood, docs are updated, and the workspace contains no unrelated or unsafe changes.

## HTTP Request Layer

All HTTP/network calls must go through a centralized client. No raw fetch/axios in components or business logic.

### Frontend

- **Simple / static site**: use native `fetch` with a thin wrapper.
- **Complex application**: use axios as the unified HTTP client.
- **Centralized interceptors**:
  - Request: inject auth token, attach request ID for tracing.
  - Response: normalize error shapes, extract business error codes, handle 401 redirect / refresh token.
- **Unified error handling**: HTTP status codes map to typed business error codes. Never expose raw HTTP errors to the user without a translation layer.
- **Retry**: exponential backoff for retryable errors (5xx, network timeout). Never retry POST/PUT without idempotency guarantees.
- **Timeout**: per-request type — fast queries ≤ 5s, slow operations ≤ 30s, file upload ≤ 120s.
- **Cancellation**: support AbortController / CancelToken for page navigation, tab close, or user cancel.
- **Loading state**: managed by the hook/store/wrapper that calls the HTTP layer, not inside the HTTP layer itself.
- **Mock / dev**: use a centralized mock layer (msw, json-server, or a local mock config). Do not scatter mock logic across components.

### Backend

- Use axios, fetch (Node 18+), or a purpose-built HTTP client (e.g., `got` for Node, `httpx` for Python).
- Centralize: retries, timeouts, circuit breaking, error mapping, and logging.
- Wrap all external API calls in an adapter / proxy module. Business logic must not call HTTP directly.
- Never expose third-party API keys, tokens, or raw error messages from upstream services in responses to clients.
