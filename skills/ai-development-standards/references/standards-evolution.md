# Standards Evolution

Use this reference when a downstream project discovers that the standards need improvement.

## Rule

Local projects may auto-improve and execute local standards patches. Upstream standards may only receive reviewable proposals; they must not be auto-merged.

## Files To Create In Downstream Projects

```text
docs/process/STANDARDS_UPSTREAM_CONFIG.json
docs/process/STANDARDS_FEEDBACK.md
docs/process/STANDARDS_LOCAL_PATCHES.md
docs/process/STANDARDS_UPSTREAM_PROPOSALS.md
```

## Upstream Config

When the standards kit is provided as a folder or zip instead of a Git checkout, the AI must use the upstream config instead of guessing remotes.

Look for:

```text
docs/process/STANDARDS_UPSTREAM_CONFIG.json
standards-upstream.json
standards-upstream.example.json
```

Default config:

```json
{
  "name": "ai-development-standards-kit",
  "primaryRemote": "https://gitee.com/czh1126/ai-development-standards-kit.git",
  "mirrors": [{ "name": "github", "url": "" }],
  "defaultBranch": "main",
  "proposalBranchPrefix": "proposal/standards-",
  "proposalCommitPrefix": "proposal: 优化开发规范-",
  "maintainerReviewRequired": true,
  "allowAutoMerge": false
}
```

If the config is missing, generate a patch and proposal document only. Do not guess the upstream repository.

## When To Record Feedback

- Same issue appears at least twice.
- New stack, platform, AI capability, or deployment model is not covered.
- Rule is ambiguous or interpreted differently by agents.
- Incident, P0/P1 bug, security issue, or release failure exposes a standards gap.
- Rule cannot be automated, reviewed, or verified.
- A project discovers a better template, checklist, workflow, or quality gate.

## Local Patch Rules

- May take effect immediately in the downstream project.
- Must be written down before being treated as project policy.
- Must not weaken security, testing, release, data protection, or quality baselines.
- Should include reason, scope, and validation method.

## Upstream Proposal Rules

AI may prepare a branch, commit, patch, or PR if it has permission.

Constraints:

- Read upstream config first: `primaryRemote`, `defaultBranch`, `proposalBranchPrefix`, `proposalCommitPrefix`, and `allowAutoMerge`.
- Branch: `proposal/standards-short-description`
- Commit: `proposal: 优化开发规范-短说明`
- Modify only standards, templates, skills, or documentation.
- Do not push to upstream main.
- Do not auto-merge.
- Include evidence, impact, local validation, and review recommendation.

## Maintainer Decision

Use:

```text
ACCEPTED / NEEDS_REVISION / REJECTED / LOCAL_ONLY
```

Accept only when the change is general, evidence-backed, enforceable, reviewable, and does not add unnecessary complexity.
