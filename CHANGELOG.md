# Changelog

## 0.23.0

- 新增 `docs/process/PERFORMANCE_BASELINE.md`，要求小项目也必须设定性能预算，避免随机卡顿、页面冻结、重复请求和无边界数据加载。
- 强化技术选型门禁：不得默认选择全栈一体，必须比较交付形态并说明性能、部署、维护和可替换性影响。
- 将性能基线接入 `AI_ENFORCEMENT`、AI 工具规则、Codex skill、`standards check` 和 `standards guard`。

## 0.22.0

- 新增 `docs/process/PROJECT_LIFECYCLE.md`，强制项目从 0 到 1 按阶段推进，禁止主会话跳过开发文档直接写代码。
- 新增 `docs/agents/AGENT_ROUTER.md`，要求主会话按阶段和任务选择专业技能或 agent，并记录真实调用或角色化审查证据。
- 强化主会话职责：默认只做沟通、澄清、派发、验收、整合和精简汇报，不承担专项代码实现；存在关键疑问时必须停下来问用户。

## 0.21.0

- 新增 `standards setup-agency-agents`，自动下载、转换并安装 Codex 版 `agency-agents` 到 `~/.codex/agents/`。
- `standards init` 默认尝试安装 `agency-agents`，可用 `--skip-agency-agents` 跳过；安装失败时降级为内置角色编排规范，不阻塞项目初始化。

## 0.20.0

- 强化主会话持续派发硬约束：每个子智能体返回后必须验收、更新看板、生成下一批 `/goal` 并继续派发。
- 新增每轮调度记录和未继续派发原因，禁止子任务返回后只做总结不继续推进。

## 0.19.0

- 新增可见子窗口模式硬约束：用户明确要求可见子智能体窗口时，主会话只能编排、派发、验收、整合和提问，禁止直接承担专项实现。
- 明确可见子窗口失败、超时或交付不合格时，主会话必须返工、改派、降级或向用户提出决策问题，不能私自接手实现。

## 0.18.0

- 新增 `standards update-check` / `standards upgrade-check`，用于检测当前安装版本是否落后于 npm latest。
- 版本检查命令会输出当前版本、最新版本和升级命令。

## 0.17.0

- 新增主会话持续调度循环：后台子任务完成后必须验收、更新状态看板、生成下一批任务并继续派发。
- 扩展 `PROJECT_PROGRESS.md` 状态看板，新增下一批任务队列和用户待决策项。
- 明确只有项目完成、用户暂停或出现必须用户确认的范围、技术栈、安全、费用、发布等阻塞时，主会话才暂停调度。

## 0.16.0

- 明确 Codex 使用本模板时，专业智能体默认作为后台子任务或后台 agent 执行，不默认创建用户可见子窗口。
- 更新主会话、多智能体、并行开发和 AI 工具规则，要求用户只和主会话沟通，后台任务结果统一回传主会话整合。

## 0.15.0

- 新增 `docs/process/AI_ENFORCEMENT.md`，作为所有 AI coding agent 的强制开工入口。
- 新增 `docs/process/TECH_DECISION.md`，要求技术选型按安全、性能、维护性、稳定性、生态兼容、交付效率和可替换性评分，不得只按最快实现选择。
- 初始化时生成 `CLAUDE.md`、`GEMINI.md`、`.cursor/rules/ai-development-standards.mdc` 和 `.github/copilot-instructions.md`，覆盖更多 AI 工具规则入口。
- 新增 `standards guard`，检查当前项目是否具备 AI 强制执行规范入口。

## 0.14.0

- 包名保持 `ai-development-standards-kit` 不变，安装后推荐使用短命令 `standards init`。
- 保留 `ai-development-standards-kit` 和 `standards` CLI 入口。

## 0.13.0

- 新增 npm CLI 包配置，支持发布后通过 `npx ai-development-standards-kit init` 初始化项目。
- 新增 `bin/standards.js`，支持 `init`、`install-skill`、`setup-rtk`、`check` 和 `version` 命令。
- 新增 LICENSE、`.npmignore` 和 npm 发布文件清单。

## 0.12.0

- 融合 AI Workflow Factory 思想，新增 `docs/process/AI_WORKFLOW_FACTORY.md`。
- 增加上下文采集、项目操作手册、二次自审和重复任务工作流沉淀规则。
- 更新主会话控制、工程流程、状态看板和 skill 入口，要求模糊任务先澄清、重复任务沉淀到 `docs/workflows/`。
- 新增 `docs/workflows/WORKFLOW_TEMPLATE.md`，提供可复制的中文工作流模板。

## 0.11.0

- 新增 `docs/process/LANGUAGE_POLICY.md`，明确默认使用简体中文生成文档和汇报进度。
- 更新 README、AGENTS、AI 自动引导和 skill 入口，避免初始化后生成英文项目文档。
- 要求第三方工具或模板生成的英文内容在最终交付前改写为中文。

## 0.10.0

- 新增 AI 自动引导流程，支持用户只提供仓库地址、压缩包或文件夹。
- 新增 `scripts/bootstrap-ai-standards.sh`，统一安装 skill 和可选 RTK。
- 新增 `docs/AI_BOOTSTRAP.md`，明确 AI 读取 README 后的自动安装、降级和等待用户需求规则。

## 0.9.0

- 新增 `scripts/setup-rtk.sh`，支持自动检测、安装和初始化 RTK。
- 明确 RTK 是推荐的可选上下文压缩工具，不是项目运行时依赖。
- 增加 RTK 使用边界：高风险判断必须读取关键原文，安装失败必须降级普通命令。

## 0.8.0

- 新增专业子智能体交付物规范。
- 要求开发前完成字段、接口格式、页面状态、错误码、权限和验收标准的颗粒度对齐。
- 更新状态看板，新增专业文档状态表。

## 0.7.0

- 新增跨智能体联调通信规则。
- 明确子智能体可以提出联调请求，但必须通过主会话登记、转发、裁决和归档。
- 更新项目状态看板，新增联调请求表和 `联调中` 状态。

## 0.6.0

- 新增 GitHub 镜像仓库地址。
- 明确本项目后续提交需同时推送到 Gitee 和 GitHub。

## 0.5.0

- 融合 `rtk` 的 token 节省思想，新增上下文预算规范。
- 新增 `docs/process/CONTEXT_BUDGET.md` 和 skill 引用 `context-budget.md`。
- 更新工程流程和 QA 策略，要求长输出摘要优先并保留原始输出路径。

## 0.4.0

- 新增上游仓库配置模板，支持压缩包或普通文件夹分发时仍能提交规范优化提案。
- 将当前 Gitee 仓库写入 `standards-upstream.example.json` 和 `templates/STANDARDS_UPSTREAM_CONFIG.json`。
- 更新规范演进流程，要求 AI 提交上游提案前读取上游配置。

## 0.3.0

- 新增规范演进闭环：反馈记录、本地补丁、上游提案和维护者审核门禁。
- 新增 `docs/process/STANDARDS_EVOLUTION.md`。
- 新增规范反馈、本地补丁和上游提案模板。
- 更新 Codex skill，使下游项目可自动生成规范优化提案。

## 0.2.0

- 融合 `ponytail` 的最小必要实现与反过度工程思想。
- 新增 `docs/process/MINIMAL_IMPLEMENTATION.md`。
- 更新开发流程、QA 策略、质量门禁和 Codex skill 引用。

## 0.1.0

- 初始化 AI Development Standards Kit。
- 融合通用项目开发规范与 agency-agents 编排方式。
- 新增 Codex skill：`ai-development-standards`。
- 新增开发规范、工程流程、QA 策略、安全基线、发布清单和 Agent 编排文档。
