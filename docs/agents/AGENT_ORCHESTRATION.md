# Agent Orchestration

本文件定义如何把已安装的 `agency-agents` 角色用于真实项目开发。

## 默认模式

采用“主会话控制台 + 专业子智能体”模式：

- 主会话是唯一沟通入口，负责需求理解、任务拆分、进度看板、风险决策、结果整合和最终质量门禁。
- 子智能体只执行主会话分配的专业任务，不直接改变项目方向。
- 每个子智能体职责单一，UI 只做 UI，前端只做前端，后端只做后端，测试只做测试。
- 并行开发必须先冻结接口契约、文件边界和交付物，避免互相覆盖。

详细规则：

- `docs/agents/MAIN_SESSION_CONTROL.md`
- `docs/agents/SPECIALIST_WORKERS.md`
- `docs/agents/PARALLEL_DEVELOPMENT.md`
- `docs/agents/PROJECT_STATUS_BOARD.md`

## 默认阶段

| 阶段 | 目标 | 推荐 Agent |
| --- | --- | --- |
| 0. Discovery | 明确用户、问题、范围和风险 | `product-manager`, `trend-researcher`, `ux-researcher` |
| 1. Strategy | 形成可执行方案和任务拆解 | `project-manager-senior`, `sprint-prioritizer`, `agents-orchestrator` |
| 2. Architecture | 确定架构、数据流、契约和质量门禁 | `software-architect`, `backend-architect`, `ux-architect`, `security-architect` |
| 3. Build | 按任务实现并保持边界清晰 | `frontend-developer`, `backend-architect`, `senior-developer`, `ai-engineer` |
| 4. QA | 用证据验证质量 | `api-tester`, `evidence-collector`, `reality-checker`, `performance-benchmarker` |
| 5. Release | 发布、回滚、监控和告警 | `devops-automator`, `sre`, `incident-response-commander` |
| 6. Operate | 指标、反馈、复盘和规范演进 | `analytics-reporter`, `feedback-synthesizer`, `workflow-optimizer` |

## 编排原则

- 一个阶段没有交付物，不进入下一阶段。
- 每次 Agent 交接必须带上需求、约束、当前 diff、验证结果和未覆盖风险。
- QA 失败时回到实现 Agent，最多 3 次；仍失败则升级为阻塞问题。
- 所有结论以证据为准，不能只写“已完成”“看起来正常”。
- 新项目优先使用 `agents-orchestrator` 管理全流程，小任务可直接点名专业 Agent。
- 并行 Agent 只用于相互独立的工作流，例如需求梳理、架构审查、安全审查、测试策略、文档整理；同一文件或同一模块的写操作必须串行整合，避免互相覆盖。
- Agent 数量必须由任务复杂度决定，不使用“数量不限”。默认 3-6 个，复杂项目最多扩展到 8-10 个，并明确每个 Agent 的交付物。
- 子智能体禁止跨专业包办任务；跨角色变更必须回到主会话重新拆分。
- 主会话必须维护项目状态看板，并在关键节点更新任务状态、阻塞、风险和下一步。

## 常用提示词

```text
使用 agents-orchestrator 按 docs/process/DEVELOPMENT_STANDARDS.md 编排这个功能，从需求拆解到 QA 验证，每个阶段给出交付物。
```

```text
使用 backend-architect 审查当前架构、数据模型、接口契约、事务和缓存设计，输出阻塞问题和修复建议。
```

```text
使用 code-reviewer 按安全、正确性、可维护性、性能和测试覆盖审查当前 diff，先列阻塞问题。
```

```text
使用 application-security-engineer 检查密钥、权限、日志脱敏、AI 输入输出和数据分级风险。
```

## 并行多 Agent 提示词模板

不建议使用“数量不限、越多越好”的提示词。更稳的版本如下：

```text
为了完成此任务，请先设定一个清晰目标，并将任务拆分为可并行的独立工作流。仅在工作流之间没有文件写入冲突、上下文依赖或顺序依赖时并行分配 Agent。

请按需要调用 3-6 个专业 Agent；如果任务复杂，可以扩展，但必须说明每个 Agent 的职责、输入、输出和验收标准。

为每个 Agent 分配独立目标：
- Agent A /goal: 需求与范围澄清，输出用户目标、非目标、验收标准和风险。
- Agent B /goal: 架构与数据流审查，输出模块边界、接口契约、数据模型和复用点。
- Agent C /goal: 实现方案，输出最小可行实现步骤和受影响文件。
- Agent D /goal: 质量与测试策略，输出必须运行的验证命令、测试用例和缺陷风险。
- Agent E /goal: 安全与发布风险，输出权限、密钥、日志、AI 安全、回滚和监控要求。

所有 Agent 返回后，请由 orchestrator 汇总冲突、去重建议、确定最终执行顺序，并给出一个可落地的实施计划。不要声称并行执行了未实际执行的 Agent；如果只能模拟角色评审，请明确说明这是角色化审查。
```
