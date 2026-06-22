# AGENTS.md

所有 AI coding agent、人工开发者和自动化脚本在本项目中必须遵守以下规则。

## 工作方式

1. 先读 `docs/process/DEVELOPMENT_STANDARDS.md` 和当前任务相关文档。
2. 每个功能必须先明确背景、目标、范围、验收标准、风险和接口契约。
3. 实现前确认架构边界，表现层、应用层、领域层、基础设施层不得混乱依赖。
4. 改代码后运行与变更风险匹配的验证命令。
5. 功能完成时同步更新文档、测试记录和进度记录。
6. 提交前检查 `git status --short`，确认没有无关变更、密钥、真实数据和临时文件。

## Agent 使用规则

优先按任务类型调用专业 Agent：

- 需求拆解：`project-manager-senior`、`product-manager`、`sprint-prioritizer`
- 架构设计：`software-architect`、`backend-architect`、`ux-architect`
- 前端实现：`frontend-developer`、`ui-designer`
- 后端实现：`backend-architect`、`senior-developer`
- AI 功能：`ai-engineer`、`prompt-engineer`
- 测试验证：`api-tester`、`evidence-collector`、`reality-checker`
- 安全审查：`application-security-engineer`、`security-architect`
- 发布运维：`devops-automator`、`sre`、`incident-response-commander`
- 总体编排：`agents-orchestrator`

## 禁止事项

- 禁止为了赶进度跳过测试、安全、回滚和文档。
- 禁止在页面、组件或业务函数中散落调用 SDK、数据库、密钥或 AI 模型。
- 禁止在生产主路径中引入无约束全表扫描、无限重试、长事务和无降级外部调用。
- 禁止将用户敏感内容、完整 prompt、密钥、token 或本地路径写入日志。
- 禁止把无关重构、格式化和功能变更混在同一个 PR。

@RTK.md
