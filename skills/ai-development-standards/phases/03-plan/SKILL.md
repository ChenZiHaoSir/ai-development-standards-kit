---
name: 03-plan
description: Turn an approved brief and model into a specification, dependency-aware vertical slices, and an executable delivery plan.
disable-model-invocation: true
---

# 03 Plan

Create `docs/specs/NNN-<name>.md` with problem, behavior, non-goals, domain terms, interfaces, data changes, observability, security, rollout, and test seams.

Split work into vertical slices. Every ticket must state its user-visible outcome, prerequisites, affected boundaries, acceptance examples, verification command, and rollback or failure note when relevant. Order slices by risk and learning value, not by technical layer.

The first slice should prove the riskiest end-to-end path with the least production surface. Reuse the repository's issue tracker and templates when configured.

Exit gate: show the dependency graph, slice order, scope risks, and definition of done. Wait for approval before implementation.
