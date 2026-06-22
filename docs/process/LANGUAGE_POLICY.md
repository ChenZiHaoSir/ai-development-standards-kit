# 语言策略

本规范包默认面向中文使用者。AI 在安装、初始化、生成规范文档、创建项目文档、汇报进度和提交说明时，必须默认使用简体中文。

## 默认语言

- 用户没有特别指定时，所有说明、总结、规范文档、项目状态、评审意见、任务拆分和交付物正文默认使用简体中文。
- 文件名、目录名、命令、代码、配置键、API 字段、数据库字段、协议名、库名、框架名、错误码和标准缩写可以保留英文。
- 如果项目本身要求英文文档，必须先得到用户明确确认。
- 如果引用上游英文文档，可以保留原文关键词，但需要用中文解释其含义和执行方式。

## AI 初始化要求

AI 读取本规范包后，必须先建立以下默认约定：

```text
后续除代码、命令、路径、API 字段、配置项和专有名词外，所有沟通和生成文档默认使用简体中文。
```

如果 AI 环境不支持 Codex skill，也必须手动遵守本语言策略。

## 文档生成要求

以下文档正文必须默认中文：

- `AGENTS.md`
- `PROJECT_PROGRESS.md`
- `docs/product/PRD.md`
- `docs/product/UX_SPEC.md`
- `docs/engineering/ARCHITECTURE.md`
- `docs/engineering/DEVELOPMENT_PLAN.md`
- `docs/engineering/API_SPEC.md`
- `docs/engineering/DATA_MODEL.md`
- `docs/engineering/FRONTEND_SPEC.md`
- `docs/engineering/AI_SPEC.md`
- `docs/process/DEVELOPMENT_STANDARDS.md`
- `docs/process/ENGINEERING_WORKFLOW.md`
- `docs/process/QA_STRATEGY.md`
- `docs/security/SECURITY.md`
- `docs/release/RELEASE_CHECKLIST.md`

## 允许英文的情况

- 代码注释遵循项目既有风格；新项目默认中文业务注释，技术关键字保留英文。
- API 路径、JSON 字段、数据库字段和环境变量使用英文或项目既有命名。
- README 面向国际用户时可以中英双语，但中文必须优先。
- 第三方工具生成的英文内容必须补充中文说明，不能直接作为最终交付物。

## 检查规则

项目初始化完成后，主会话必须检查：

- 新生成的项目文档是否以中文为主。
- 状态看板、任务拆分、风险说明和验收标准是否中文可读。
- 专业子智能体交付物是否默认中文。
- 是否存在第三方模板生成的大段英文未翻译内容。

发现英文模板残留时，AI 必须主动改成中文，而不是要求用户手动提醒。
