# AI Agent 项目规则

本项目已启用 AI Development Standards Kit。所有 AI coding agent 必须严格遵守以下规则。

## 必读入口

开始任何任务前，先读取：

- `AGENTS.md`
- `docs/process/AI_ENFORCEMENT.md`
- `docs/process/DEVELOPMENT_STANDARDS.md`
- `docs/process/ENGINEERING_WORKFLOW.md`
- `docs/process/MINIMAL_IMPLEMENTATION.md`
- `docs/process/TECH_DECISION.md`
- `docs/process/QA_STRATEGY.md`
- `docs/process/LANGUAGE_POLICY.md`

未读取前不得直接写代码。

## 强制工作流

1. 先确认目标、范围、验收标准、接口契约、字段、权限和风险。
2. 再输出计划、影响范围、计划修改文件和质量门禁。
3. 实现时优先复用已有逻辑，重复或相似逻辑必须评估抽象复用。
4. 技术选型必须先评估安全、性能、维护性、稳定性、生态兼容、交付效率和可替换性，不能只按最快实现决定。
5. Codex 中的专业智能体默认作为后台子任务执行，不默认创建用户可见子窗口。
6. 用户明确要求可见子智能体窗口时，主会话只能编排、派发、验收、整合和提问，禁止直接承担专项实现。
7. 主会话必须持续维护任务队列，子任务完成后验收结果、更新看板并继续派发下一批任务。
8. 只有项目完成、用户暂停或出现必须用户确认的阻塞时，主会话才暂停调度。
9. 不手搓成熟工具可解决的问题，优先使用标准库、框架能力和已安装依赖。
10. 交付前必须运行可用的 lint、typecheck、test、build 或说明未运行原因。
11. 最终回复必须包含规范执行情况、技术选型决策、修改文件、复用处理、验证结果、未执行项和风险。

## 禁止事项

- 禁止忽略 `AGENTS.md` 和 `docs/process/AI_ENFORCEMENT.md`。
- 禁止未澄清关键上下文就直接实现。
- 禁止只因为“最快实现”而选择低安全、低性能、低维护性的技术方案。
- 禁止在 Codex 中默认创建多个用户可见窗口来模拟专业智能体。
- 禁止在用户明确要求可见子窗口时，由主会话绕过子窗口直接完成专项实现。
- 禁止只派发一轮任务后停止调度；必须持续推进任务队列。
- 禁止跳过测试、安全、文档和状态看板。
- 禁止把 SDK、数据库、密钥、AI 模型调用散落在 UI 或业务函数中。
- 禁止提交密钥、token、真实用户数据、本地路径、临时文件和构建产物。

## 自检命令

当任务开始前或交付前不确定规范是否完整时，运行：

```bash
standards guard
```
