# AI Development Standards Kit

面向新项目启动、日常开发、评审、测试和发布的可复用工程规范与 Codex skill 知识库。

本项目融合两类资产：

- `ai-development-guidelines` 的通用研发规范：作为质量、安全、测试、发布和协作底线。
- `agency-agents` 的 232 个专业 Agent：作为按阶段调用的专家角色库。
- `ponytail` 的最小必要实现思想：作为反过度工程、少依赖、少抽象、优先平台能力的实现约束。
- AI Workflow Factory 的工作流沉淀思想：作为上下文采集、项目手册、二次自审和重复任务自动化的流程约束。

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

默认语言：除代码、命令、路径、API 字段、配置项和专有名词外，AI 必须使用简体中文生成文档和汇报进度。详见 `docs/process/LANGUAGE_POLICY.md`。

如果脚本不可执行，AI 应先执行：

```bash
chmod +x ./scripts/bootstrap-ai-standards.sh
./scripts/bootstrap-ai-standards.sh
```

详细自动引导流程见：

```text
docs/AI_BOOTSTRAP.md
```

### 2. 通过 npx 安装并使用短命令

安装命令保持使用正式包名：

```bash
npm install -g ai-development-standards-kit
```

安装后，在自己的项目根目录使用短命令：

```bash
standards init
```

常用选项：

```bash
standards init --skip-rtk
standards init --force
standards check
standards guard
standards update-check
```

`init` 会复制规范文档、AI 强制执行入口、状态看板、工作流模板和上游配置，安装 Codex skill，并尝试初始化 RTK。默认不会覆盖已存在文件，除非传入 `--force`。

初始化后会生成：

```text
AGENTS.md
docs/process/AI_ENFORCEMENT.md
docs/process/TECH_DECISION.md
CLAUDE.md
GEMINI.md
.cursor/rules/ai-development-standards.mdc
.github/copilot-instructions.md
PROJECT_PROGRESS.md
```

这些文件用于约束不同 AI 工具：开工前必须读规范，技术选型必须考虑安全、性能、维护性、稳定性和可替换性，交付前必须输出质量门禁结果。

检查当前项目是否具备强制约束入口：

```bash
standards guard
```

检查规范包是否有新版本：

```bash
standards update-check
```

也可以不安装，直接使用 npx：

```bash
npx ai-development-standards-kit init
npx ai-development-standards-kit guard
npx ai-development-standards-kit update-check
```

### 3. 作为新项目规范模板

在新项目根目录复制或引用这些文件：

```text
README.md
AGENTS.md
docs/process/DEVELOPMENT_STANDARDS.md
docs/process/ENGINEERING_WORKFLOW.md
docs/process/LANGUAGE_POLICY.md
docs/process/AI_WORKFLOW_FACTORY.md
docs/process/CONTEXT_BUDGET.md
docs/process/MINIMAL_IMPLEMENTATION.md
docs/process/AI_ENFORCEMENT.md
docs/process/TECH_DECISION.md
docs/process/QA_STRATEGY.md
docs/process/STANDARDS_EVOLUTION.md
docs/workflows/WORKFLOW_TEMPLATE.md
standards-upstream.example.json
docs/security/SECURITY_BASELINE.md
docs/release/RELEASE_CHECKLIST.md
templates/
```

### 4. 作为 Codex skill

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

### 5. 安装 RTK 上下文压缩工具

RTK 是推荐的可选增强工具，用于压缩命令输出、减少 token 噪声，不会改变项目代码产出逻辑。

```bash
./scripts/setup-rtk.sh
```

后续用户把本规范喂给 AI 后，AI 应先检测 `rtk` 是否存在；缺失时可以按本脚本自动安装，安装失败则降级使用普通命令并控制输出长度。

### 6. 作为 Agent 编排手册

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
上下文采集 -> 需求澄清 -> 架构设计 -> 实现 -> 二次自审 -> 测试验证 -> 安全审查 -> 发布交付 -> 工作流沉淀
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
- 在 Codex 中，子智能体默认作为后台子任务或后台 agent 执行，不默认创建用户可见的新窗口。
- 如果用户明确要求可见子智能体窗口，主会话必须切换为纯编排模式，只能派发、验收和整合，不能直接承担专项实现。
- 主会话必须持续维护任务队列，后台任务完成后验收结果、更新看板并继续派发下一批任务。
- 只有项目完成、用户暂停或出现范围、技术栈、安全、费用、发布等必须用户确认的阻塞时，主会话才暂停调度并向用户提问。
- 子智能体只负责单一专业任务，例如 UI、前端、后端、测试、安全、DevOps、文档。
- 开发前每个活跃专业智能体必须产出本角色文档，例如 UI 文档、前端集成文档、后端 API 文档、测试计划和安全文档。
- 并行开发必须先明确接口契约、文件边界、输入输出和验收标准。
- 模糊任务必须先补齐关键上下文；同类任务重复 3 次以上时，应沉淀为 `docs/workflows/` 下的可复用流程。

## 项目底线

- 不以“能跑”为完成标准，以“用户能稳定完成目标”为完成标准。
- 不默认生成英文项目文档；中文用户场景下，规范、进度、计划、评审和交付物正文必须默认简体中文。
- 不在关键上下文缺失时直接执行；先确认目标、受众、范围、输入、约束、输出格式和验收标准。
- 不让重复任务停留在口头经验；出现 3 次以上必须沉淀为模板、脚本或工作流。
- 不把无关文件、完整日志和大型命令输出塞进 AI 上下文；先摘要、定位、分段读取，必要时使用 `rtk` 等压缩输出工具。
- 不默认写复杂实现；先判断是否需要做，再优先使用标准库、平台原生能力和已有依赖。
- 不跳过需求、架构、测试、安全和发布门禁。
- 不把 AI 输出直接写入用户最终内容，必须可审阅、可回滚、可追踪。
- 不提交密钥、真实用户数据、本地配置、临时截图和构建产物。
- 不让规范停留在文档，必须进入模板、CI、Review、检查清单和自动扫描。
- 下游项目可以自动记录并执行本地规范补丁；上游规范只能自动提案，必须由维护者审核后合并。
- 即使规范以压缩包或文件夹形式分发，也必须通过 `standards-upstream.example.json` 或 `STANDARDS_UPSTREAM_CONFIG.json` 记录上游 Git 地址，便于 AI 提交候选优化。
- 本项目当前同时维护 Gitee 和 GitHub，上游变更提交后应同时推送到两个远端。
- Codex 使用本模板时，专业智能体应后台执行并回传结果给主会话，不能要求用户手动管理多个子窗口。
- 主会话不能只分配一轮任务后停止；必须按状态看板持续派发、验收、整合、再派发。
