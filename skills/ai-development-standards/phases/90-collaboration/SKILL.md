---
name: 90-collaboration
description: Keep humans and agents aligned during delegation, review, handoff, interruption, and recovery.
disable-model-invocation: true
---

# 90 Collaboration

Before handoff, update `docs/PROJECT-STATE.md` with the exact phase and slice, files changed, checks run, failures, open decisions, and next command.

Delegated work must have one bounded objective, relevant context, expected output, allowed files, forbidden files, acceptance criteria, and a stop condition. Do not duplicate work across workers.

On receipt, verify reported files and commands, inspect the diff against the spec and ADRs, and treat unverified claims as hypotheses. Route cross-worker contract changes through the orchestrator.

If the conversation is confused, restate the goal using the project glossary and ask one focused question. If a decision belongs to another person, create a questionnaire instead of guessing.
