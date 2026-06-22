# Agent Router

本文件定义主会话如何为项目阶段和任务选择专业技能或 agent。主会话不得凭习惯直接执行专项实现。

## 路由原则

- 主会话负责选择、派发和验收，不负责专项实现。
- 每个任务必须绑定一个主责专业智能体；复杂任务可绑定 1-2 个协作智能体。
- 任务派发前必须写明 `/goal`、输入、输出、文件边界、验收标准和可用技能。
- 如果 `agency-agents` 已安装，优先真实调用对应 Codex custom agent。
- 如果当前环境不能真实调用 agent，必须读取本项目角色规范并做角色化审查，且明确说明“当前为角色化审查，不是实际 agent 调用”。
- 如果无法读取角色规范，也无法调用 agent，必须向用户说明能力不足，不能假装已使用专业技能。

## 阶段路由表

| 阶段 | 必须技能/agent | 可选技能/agent | 必须产出 |
| --- | --- | --- | --- |
| Intake | Product / PM, UX Researcher | Trend Researcher | 目标、用户、范围、非目标、疑问清单 |
| Product | Product Manager, Project Manager Senior | Sprint Prioritizer | PRD、MVP、用户故事、验收标准 |
| UX/UI | UI Designer, UX Architect | Brand Guardian, Accessibility Auditor | 页面清单、流程、状态、组件、设计约束 |
| Architecture | Software Architect, Backend Architect, Security Architect | Database Optimizer, SRE | 架构、模块边界、数据流、技术选型 ADR |
| Contract | Backend Architect, Frontend Developer | API Tester, Technical Writer | API、字段、错误码、权限、数据模型、mock |
| Scaffold | DevOps Automator, Frontend Developer 或 Backend Architect | SRE | 官方脚手架命令、依赖选择、目录结构 |
| Build Frontend | Frontend Developer | UI Designer, Accessibility Auditor | 页面、组件、状态、接口接入、前端验证 |
| Build Backend | Backend Architect, Senior Developer | Database Optimizer, Security Architect | API、service、repository、迁移、后端验证 |
| Build AI | AI Engineer, Prompt Engineer | Security Architect | Prompt、schema、限流、熔断、审计 |
| Integration | API Tester, Frontend Developer, Backend Architect | QA / Testing | 联调记录、契约修正、回归验证 |
| QA/Security | Code Reviewer, API Tester, Security Engineer | Performance Benchmarker | 测试报告、安全审查、阻塞清单 |
| Release | DevOps Automator, SRE, Technical Writer | Incident Response Commander | 发布清单、回滚、监控、文档 |

## 任务路由规则

| 任务类型 | 主责技能/agent | 禁止行为 |
| --- | --- | --- |
| 需求不清 | Product / PM | 主会话自己补需求 |
| 页面和交互 | UI Designer / UX Architect | 后端或主会话顺手设计 |
| 前端实现 | Frontend Developer | 主会话直接改页面代码 |
| 后端实现 | Backend Architect / Senior Developer | 前端智能体改数据库 |
| API 契约 | Backend Architect + Frontend Developer | 前后端各自猜字段 |
| AI 能力 | AI Engineer / Prompt Engineer | 模型调用散落在 UI 或业务函数 |
| 测试验证 | QA / API Tester / Code Reviewer | 实现智能体自称已验证但无证据 |
| 安全风险 | Security Engineer / Security Architect | 为了进度跳过权限、密钥、日志脱敏 |
| 发布部署 | DevOps Automator / SRE | 未写回滚和监控就交付 |
| 文档说明 | Technical Writer / Docs | 代码改了但文档不同步 |

## 派发模板

主会话派发每个任务时必须使用以下格式：

```markdown
## /goal

请以【专业智能体名称】身份完成：

## 背景

- 当前阶段：
- 用户已确认需求：
- 上游交付物：

## 输入

- 相关文件：
- 相关契约：
- 约束：

## 输出

- 必须产出的文件或结论：
- 必须更新的状态：

## 文件边界

- 允许修改：
- 禁止修改：

## 验收标准

- [ ] 

## 回传格式

- 完成内容：
- 修改文件：
- 验证命令和结果：
- 风险：
- 需要主会话协调的问题：
```

## 路由记录

主会话必须在 `PROJECT_PROGRESS.md` 记录：

| 时间 | 阶段 | 任务 | 必须技能/agent | 实际使用 | 是否真实调用 | 交付物 | 验收 |
| --- | --- | --- | --- | --- | --- | --- | --- |
|  |  |  |  |  | 是/否/角色化审查 |  |  |
