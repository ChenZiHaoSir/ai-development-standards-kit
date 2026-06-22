# AI Development Standards Kit

面向新项目启动、日常开发、评审、测试和发布的可复用工程规范与 Codex skill 知识库。

本项目融合两类资产：

- `ai-development-guidelines` 的通用研发规范：作为质量、安全、测试、发布和协作底线。
- `agency-agents` 的 232 个专业 Agent：作为按阶段调用的专家角色库。
- `ponytail` 的最小必要实现思想：作为反过度工程、少依赖、少抽象、优先平台能力的实现约束。

## 如何使用

### 1. 最推荐：丢给 AI 自动安装

用户把本仓库地址、压缩包或解压后的文件夹发给 AI，然后说：

```text
请读取这个规范包的 README，自动完成安装和初始化。完成后等待我描述项目需求。
```

AI 应自动执行：

如果用户给的是仓库地址，AI 先克隆仓库：

```bash
git clone https://github.com/ChenZiHaoSir/ai-development-standards-kit.git
cd ai-development-standards-kit
```

如果用户给的是压缩包，AI 先解压并进入解压后的项目根目录。然后执行：

```bash
./scripts/bootstrap-ai-standards.sh
```

完成后，用户只需要继续描述自己的项目需求即可。AI 会使用 `$ai-development-standards` 接管项目规范、状态看板、专业交付物、质量门禁和多智能体工作流。

如果脚本不可执行，AI 应先执行：

```bash
chmod +x ./scripts/bootstrap-ai-standards.sh
./scripts/bootstrap-ai-standards.sh
```

详细自动引导流程见：

```text
docs/AI_BOOTSTRAP.md
```

### 2. 作为新项目规范模板

在新项目根目录复制或引用这些文件：

```text
README.md
AGENTS.md
docs/process/DEVELOPMENT_STANDARDS.md
docs/process/ENGINEERING_WORKFLOW.md
docs/process/CONTEXT_BUDGET.md
docs/process/MINIMAL_IMPLEMENTATION.md
docs/process/QA_STRATEGY.md
docs/process/STANDARDS_EVOLUTION.md
standards-upstream.example.json
docs/security/SECURITY_BASELINE.md
docs/release/RELEASE_CHECKLIST.md
templates/
```

### 3. 作为 Codex skill

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

### 4. 安装 RTK 上下文压缩工具

RTK 是推荐的可选增强工具，用于压缩命令输出、减少 token 噪声，不会改变项目代码产出逻辑。

```bash
./scripts/setup-rtk.sh
```

后续用户把本规范喂给 AI 后，AI 应先检测 `rtk` 是否存在；缺失时可以按本脚本自动安装，安装失败则降级使用普通命令并控制输出长度。

### 5. 作为 Agent 编排手册

详见：

```text
docs/agents/AGENT_ORCHESTRATION.md
docs/agents/MAIN_SESSION_CONTROL.md
docs/agents/SPECIALIST_WORKERS.md
docs/agents/PARALLEL_DEVELOPMENT.md
docs/agents/SPECIALIST_DELIVERABLES.md
docs/agents/PROJECT_STATUS_BOARD.md
```

工作流图：

```text
docs/diagrams/project-workflow.png
docs/diagrams/project-workflow.drawio
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
- 开发前每个活跃专业智能体必须产出本角色文档，例如 UI 文档、前端集成文档、后端 API 文档、测试计划和安全文档。
- 并行开发必须先明确接口契约、文件边界、输入输出和验收标准。

## 项目底线

- 不以“能跑”为完成标准，以“用户能稳定完成目标”为完成标准。
- 不把无关文件、完整日志和大型命令输出塞进 AI 上下文；先摘要、定位、分段读取，必要时使用 `rtk` 等压缩输出工具。
- 不默认写复杂实现；先判断是否需要做，再优先使用标准库、平台原生能力和已有依赖。
- 不跳过需求、架构、测试、安全和发布门禁。
- 不把 AI 输出直接写入用户最终内容，必须可审阅、可回滚、可追踪。
- 不提交密钥、真实用户数据、本地配置、临时截图和构建产物。
- 不让规范停留在文档，必须进入模板、CI、Review、检查清单和自动扫描。
- 下游项目可以自动记录并执行本地规范补丁；上游规范只能自动提案，必须由维护者审核后合并。
- 即使规范以压缩包或文件夹形式分发，也必须通过 `standards-upstream.example.json` 或 `STANDARDS_UPSTREAM_CONFIG.json` 记录上游 Git 地址，便于 AI 提交候选优化。
- 本项目当前同时维护 Gitee 和 GitHub，上游变更提交后应同时推送到两个远端。
