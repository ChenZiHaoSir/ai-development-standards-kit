# Agent Playbook

Use installed `agency-agents` roles as specialist reviewers or builders.

Default model: one main orchestrator session coordinates specialist workers. The user talks to the main session; worker sessions execute assigned single-skill tasks and hand results back.

Specialist workers may request integration help from each other, but the request must be routed through the orchestrator and recorded in the status board.

## Default Phase Map

| Phase | Recommended agents |
| --- | --- |
| Discovery | `product-manager`, `trend-researcher`, `ux-researcher`, `feedback-synthesizer` |
| Planning | `project-manager-senior`, `sprint-prioritizer`, `agents-orchestrator` |
| Architecture | `software-architect`, `backend-architect`, `ux-architect`, `security-architect` |
| Build | `frontend-developer`, `backend-architect`, `senior-developer`, `ai-engineer`, `devops-automator` |
| QA | `code-reviewer`, `api-tester`, `evidence-collector`, `reality-checker`, `performance-benchmarker` |
| Release | `sre`, `devops-automator`, `incident-response-commander` |
| Operate | `analytics-reporter`, `workflow-optimizer`, `feedback-synthesizer` |

## Handoff Packet

Each handoff should include:

- Dedicated `/goal` and non-goals.
- Relevant files.
- Current diff or implementation summary.
- Acceptance criteria.
- Constraints from development standards.
- Verification already run.
- Known risks and open questions.
- Allowed files and forbidden files.

## Quality Loop

1. Implement one task.
2. Validate with the right QA or review agent.
3. If failed, return to implementation with exact evidence.
4. Retry at most three times before escalating.
5. Advance only when the current task passes.

## Integration Loop

1. Worker raises an integration request to the orchestrator.
2. Orchestrator records requester, target specialist, affected contract/files, blocking level, and expected output.
3. Orchestrator assigns the target specialist a focused `/goal`.
4. Target specialist returns conclusion, changes, validation, and contract impact.
5. Orchestrator decides the final path and syncs related workers.
6. QA validates the integration issue is closed.

## Parallel Agent Prompt

Avoid "unlimited agents" prompts. Use bounded parallelism so results are faster without becoming noisy or conflicting.

```text
For this task, set one clear objective and split the work into independent workstreams. Run workstreams in parallel only when they have no file-write conflict, context dependency, or required ordering.

Use 3-6 specialist agents by default. For complex projects, expand only when each agent has a distinct responsibility, input, output, and acceptance standard.

Assign each agent a dedicated /goal:
- Agent A /goal: clarify requirements, non-goals, acceptance criteria, and risks.
- Agent B /goal: review architecture, data flow, module boundaries, contracts, and reuse opportunities.
- Agent C /goal: propose the implementation plan and impacted files.
- Agent D /goal: define tests, validation commands, QA evidence, and defect risks.
- Agent E /goal: review security, secrets, permissions, logging, AI safety, rollback, and monitoring.

After all agents return, the orchestrator should merge results, resolve conflicts, remove duplicate advice, and produce one executable plan. Do not claim real parallel agent execution unless the runtime actually invoked separate agents.
```
