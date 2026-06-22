# AI Development Standards Kit

面向新项目启动、日常开发、评审、测试和发布的可复用工程规范与 Codex skill 知识库。

本项目融合两类资产：

- `ai-development-guidelines` 的通用研发规范：作为质量、安全、测试、发布和协作底线。
- `agency-agents` 的 232 个专业 Agent：作为按阶段调用的专家角色库。
- `ponytail` 的最小必要实现思想：作为反过度工程、少依赖、少抽象、优先平台能力的实现约束。

## 如何使用

### 1. 作为新项目规范模板

在新项目根目录复制或引用这些文件：

```text
README.md
AGENTS.md
docs/process/DEVELOPMENT_STANDARDS.md
docs/process/ENGINEERING_WORKFLOW.md
docs/process/MINIMAL_IMPLEMENTATION.md
docs/process/QA_STRATEGY.md
docs/process/STANDARDS_EVOLUTION.md
docs/security/SECURITY_BASELINE.md
docs/release/RELEASE_CHECKLIST.md
templates/
```

### 2. 作为 Codex skill

本仓库内置 skill：

```text
skills/ai-development-standards/
```

安装到本机后，可以在 Codex 中直接说：

```text
使用 $ai-development-standards 为这个新项目建立开发规范、目录结构、质量门禁和 Agent 工作流。
```

或：

```text
使用 $ai-development-standards 审查当前功能是否满足开发规范。
```

### 3. 作为 Agent 编排手册

详见：

```text
docs/agents/AGENT_ORCHESTRATION.md
docs/agents/MAIN_SESSION_CONTROL.md
docs/agents/SPECIALIST_WORKERS.md
docs/agents/PARALLEL_DEVELOPMENT.md
docs/agents/PROJECT_STATUS_BOARD.md
```

默认工作流：

```text
需求澄清 -> 架构设计 -> 实现 -> 测试验证 -> 安全审查 -> 发布交付 -> 运营复盘
```

每个阶段按需调用已安装的 Codex Agent，例如：

- `agents-orchestrator`
- `project-manager-senior`
- `backend-architect`
- `frontend-developer`
- `ui-designer`
- `code-reviewer`
- `api-tester`
- `application-security-engineer`
- `performance-benchmarker`

默认协作模式是“主会话控制台 + 专业子智能体”：

- 用户只和主会话交流。
- 主会话负责项目状态、任务拆分、调度、整合和质量门禁。
- 子智能体只负责单一专业任务，例如 UI、前端、后端、测试、安全、DevOps、文档。
- 并行开发必须先明确接口契约、文件边界、输入输出和验收标准。

## 项目底线

- 不以“能跑”为完成标准，以“用户能稳定完成目标”为完成标准。
- 不默认写复杂实现；先判断是否需要做，再优先使用标准库、平台原生能力和已有依赖。
- 不跳过需求、架构、测试、安全和发布门禁。
- 不把 AI 输出直接写入用户最终内容，必须可审阅、可回滚、可追踪。
- 不提交密钥、真实用户数据、本地配置、临时截图和构建产物。
- 不让规范停留在文档，必须进入模板、CI、Review、检查清单和自动扫描。
- 下游项目可以自动记录并执行本地规范补丁；上游规范只能自动提案，必须由维护者审核后合并。
