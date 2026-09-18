---
name: 04-build
description: Implement an approved project one vertical slice at a time with tests, small feedback loops, and explicit error handling.
disable-model-invocation: true
---

# 04 Build

Before each slice, read the glossary, relevant ADRs, spec, ticket, and repository instructions. Confirm the public seam and verification command.

For each slice:

1. Write one behavior-focused failing test or reproducible check.
2. Implement only enough production code to pass it.
3. Run the narrowest relevant formatter, type check, test, and build command.
4. Refactor only after behavior is green.
5. Update the ticket and project state.

Test public behavior with independent expected values. Avoid private-method tests, internal call-order assertions, tautological assertions, broad snapshots, speculative abstractions, broad catches, silent defaults, and success-shaped fallbacks.

If a failure is unclear, stop and diagnose: reproduce, minimize, hypothesize, instrument, fix, and add a regression check. Do not mix unrelated refactors into the slice.
