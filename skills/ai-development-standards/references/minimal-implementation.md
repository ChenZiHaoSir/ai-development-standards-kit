# Minimal Implementation

Use this reference when planning implementation, reviewing code, adding dependencies, or checking for over-engineering.

## Ladder

1. Does the feature need to exist?
2. Does the standard library already solve it?
3. Does the platform/browser/OS/database/cloud provide it natively?
4. Does an already-installed dependency solve it?
5. Can it be one or two clear lines?
6. Only then write the minimum custom code.

## Avoid

- Interface with one implementation.
- Factory for one product.
- Config for a value that never changes.
- Plugin system before there are plugins.
- New dependency for a tiny problem.
- Custom cache, queue, parser, validator, or state machine before the need is proven.
- Custom HTTP client, raw fetch/axios inside components, services, or business logic — use the centralized HTTP layer instead.
- Boilerplate "for later".

## Prefer Native

- Browser: native inputs, `<dialog>`, `<details>`, CSS layout, container queries, `URLSearchParams`, `structuredClone`, `Intl`, `crypto.randomUUID`.
- Node/Python: standard filesystem, path, JSON, date/time, argparse, dataclasses, itertools/functools where suitable.
- Database: unique constraints, foreign keys, check constraints, indexes, pagination, aggregation, full-text search when available.
- HTTP/Network: fetch (simple/static), axios (complex app with interceptors/retry/cancellation); use existing centralized client before adding raw fetch/axios in component/service code.

## Never Cut

- Trust-boundary validation.
- Data-loss prevention.
- Auth, authorization, tenant/resource checks.
- Secret handling and log redaction.
- Accessibility basics.
- User-explicit requirements.
- Minimal validation for non-trivial logic.

## Review Format

When reviewing for over-engineering, lead with short findings:

```text
file:line tag: what to cut. replacement.
```

Tags:

- `delete`: dead code or speculative feature.
- `stdlib`: hand-rolled standard library feature.
- `native`: platform feature exists.
- `yagni`: abstraction/config/layer before need.
- `shrink`: same behavior in fewer clear lines.

