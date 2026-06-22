# AI 强制执行规范

本文件是所有 AI coding agent 的开工入口。只要项目中存在本文件，AI 在执行任何需求、设计、编码、测试、重构、发布或文档任务前，都必须先按本文件执行。

## 启动前强制动作

AI 必须在开始任务前读取并遵守以下文件：

1. `AGENTS.md`
2. `docs/process/DEVELOPMENT_STANDARDS.md`
3. `docs/process/ENGINEERING_WORKFLOW.md`
4. `docs/process/PROJECT_LIFECYCLE.md`
5. `docs/process/MINIMAL_IMPLEMENTATION.md`
6. `docs/process/TECH_DECISION.md`
7. `docs/process/PERFORMANCE_BASELINE.md`
8. `docs/process/QA_STRATEGY.md`
9. `docs/process/LANGUAGE_POLICY.md`
10. `docs/agents/MAIN_SESSION_CONTROL.md`
11. `docs/agents/AGENT_ROUTER.md`
12. 当前任务相关的专业文档，例如 `docs/agents/`、`docs/security/`、`docs/release/`

未读取这些文件时，不得直接开始写代码。

## 开工前必须输出

AI 开始执行前必须先给出简短执行声明：

```text
已读取规范：AGENTS.md、docs/process/...
本次任务目标：
影响范围：
计划修改文件：
技术选型/依赖变化：
必须执行的质量门禁：
存在的疑问或缺失上下文：
```

如果目标、范围、接口、字段、验收标准、权限、安全边界不清楚，AI 必须先提问或补齐假设，不得直接实现。

项目型任务中，主会话不得直接实现代码。主会话必须先识别生命周期阶段，按 `docs/agents/AGENT_ROUTER.md` 选择专业技能或 agent，向子智能体派发任务，并维护 `PROJECT_PROGRESS.md`。

只要存在任何会影响目标、范围、技术栈、接口契约、权限、安全、成本、发布或验收的疑问，主会话必须暂停并向用户提问，不能自己脑补。

## 实现时强制要求

- 专项实现必须由对应专业子智能体完成，主会话只做派发、验收和整合。
- 所有实现必须基于用户确认后的 PRD、UI/UX Spec、API Spec、架构文档、任务看板和验收标准。
- 优先复用项目已有函数、组件、类型、服务和工具。
- 相同或相似逻辑出现第二次时，必须评估是否提取为通用函数、组件、hook、服务或模块。
- 不得手搓已有成熟依赖能稳定解决的问题；新增依赖前必须说明原因，并优先使用项目已安装依赖、标准库和框架能力。
- 技术选型不得只按最快实现决定，必须优先评估安全性、可维护性、稳定性、性能、生态兼容、交付效率和可替换性。
- 涉及框架、数据库、组件库、状态管理、ORM、鉴权、部署、测试工具、AI SDK 等关键选型时，必须按 `docs/process/TECH_DECISION.md` 输出评分和 ADR。
- 不得默认选择全栈一体开发。必须先比较全栈一体、前后端分离、静态站、API 服务等交付形态，并说明为什么选择当前形态。
- 涉及核心路径、列表、图表、文件、AI、数据库、SSR、全栈 API 或用户交互反馈时，必须按 `docs/process/PERFORMANCE_BASELINE.md` 设定性能预算并验证。
- 不得绕过既有架构边界，把 UI、业务逻辑、数据库、外部 SDK、AI 模型调用混在同一层。
- 不得跳过错误处理、加载态、空状态、权限校验、输入校验、日志脱敏和回滚路径。
- 不得提交密钥、token、真实用户数据、本地绝对路径、临时文件和构建产物。

## 交付前必须执行

AI 完成任务前必须运行与变更风险匹配的验证命令。项目存在以下命令时必须优先执行：

```bash
npm run lint
npm run typecheck
npm test
npm run build
pnpm lint
pnpm typecheck
pnpm test
pnpm build
```

如果命令不存在，AI 必须说明“未执行的原因”，并至少执行静态自查、关键路径检查和文件变更检查。

## 交付时必须输出

AI 最终回复必须包含：

```text
当前阶段：
进度：
已完成：
正在做：
验证结果：
风险/阻塞：
需要用户确认：
下一步：
```

如果没有完成质量门禁，不得声称任务已完全完成。

## 违规处理

发现 AI 未按规范执行时，用户或主会话应要求 AI 立即执行：

```bash
standards guard
```

然后让 AI 根据检查结果补齐缺失规范、补跑验证、更新状态看板和交付说明。
