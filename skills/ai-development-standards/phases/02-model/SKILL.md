---
name: 02-model
description: Build the shared domain model, architecture boundaries, public seams, and recorded technical decisions.
disable-model-invocation: true
---

# 02 Model

Use concrete scenarios to challenge ambiguous terms. Update `docs/CONTEXT.md` with canonical nouns and verbs, entities, states, invariants, relationships, user-journey vocabulary, and deliberately rejected terms.

Define the smallest useful module boundaries. Prefer deep modules with narrow public interfaces and explicit test seams. For each boundary record its inputs, outputs, owned invariants, allowed dependencies, and observation strategy.

Record consequential choices as numbered ADRs under `docs/adr/`, including rejected alternatives and migration or rollback implications.

Exit gate: present the glossary, boundary map, ADR list, and unresolved decisions. Do not proceed while a core term, contract, or boundary is disputed.
