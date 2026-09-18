---
name: 05-verify
description: Verify that the implementation satisfies the approved specification, repository standards, security expectations, performance budget, and critical user journeys.
disable-model-invocation: true
---

# 05 Verify

Run checks in risk order:

1. targeted tests for changed seams;
2. type checking, lint, and format checks;
3. integration or browser checks for critical journeys;
4. build and package checks;
5. the smallest appropriate broader suite;
6. security, secret, dependency, and performance checks required by the repository.

Review on two axes:

- **Spec**: behavior matches the brief, specification, and acceptance examples.
- **Standards**: implementation matches repository conventions, ADRs, security, maintainability, and operational expectations.

Record every finding with severity, evidence, reproduction, impact, and fix. Re-run relevant checks after each fix. A passing build alone is not completion.

Exit gate: demonstrate every success criterion and list known limitations, skipped checks, and residual risks.
