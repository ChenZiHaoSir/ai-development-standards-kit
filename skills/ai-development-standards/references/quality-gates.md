# Quality Gates

## Merge Gate

Required unless the user explicitly approves an exception:

- Dependencies installed from lockfile.
- Lint passes.
- Typecheck or compiler check passes.
- Unit tests pass.
- Build passes.
- No secrets, tokens, real user data, local config, temporary screenshots, or generated build artifacts in the diff.
- Docs updated for product, architecture, security, release, or user-path changes.
- No unnecessary dependency, speculative abstraction, duplicate wrapper, or hand-rolled standard library/platform feature unless justified.

## Risk-Based Extra Gates

- API contract changes: schema diff or contract tests.
- Database changes: migration test, rollback or compatibility plan, index review.
- UI changes: screenshot or smoke/E2E at key breakpoints.
- Security changes: secret scan, dependency scan, permission and logging review.
- AI changes: prompt version, input minimization, output validation, rate limit, circuit breaker, audit metadata, cost estimate.
- Performance changes: benchmark or before/after measurements.
- Release changes: release checklist, rollback plan, monitoring and alert review.

## Review Priority

Lead findings in this order:

1. Data loss or corruption.
2. Secret or sensitive data leakage.
3. Authentication, authorization, tenant, or permission bypass.
4. Broken core user path.
5. Unsafe external service or AI behavior.
6. Missing error handling, retries, rollback, or observability.
7. Missing tests or verification evidence.
8. Over-engineering, unnecessary dependencies, maintainability, and duplication.
