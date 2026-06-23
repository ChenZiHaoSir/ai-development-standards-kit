# Git 规范

本文件定义 Git 分支策略、提交格式和协作流程。所有项目必须按本文件执行。

## 分支策略

采用 **Trunk-Based Development** 为主、**GitHub Flow** 为辅的混合策略：

### 分支类型

| 分支 | 命名规范 | 生命周期 | 说明 |
| --- | --- | --- | --- |
| main | `main` | 长期 | 主分支，必须保护，不允许直接推送 |
| release | `release/v1.2.0` | 短期 | 发布分支，从 main 拉出，发布完成后合并回 main |
| feature | `feat/功能名` 或 `feat/用户/功能名` | 短期 | 功能分支，从 main 拉出 |
| bugfix | `fix/bug描述` 或 `fix/用户/bug描述` | 短期 | 缺陷修复分支，从 main 拉出 |
| hotfix | `hotfix/问题描述` | 极短期 | 紧急修复，从 main 拉出，合并回 main 和 release |
| refactor | `refactor/模块名` | 短期 | 重构分支，不改功能 |
| docs | `docs/文档主题` | 短期 | 文档更新 |

### 分支规则

- 所有分支必须从 `main` 拉出，不从 release 或其他短期分支拉出新分支
- 功能分支命名：`feat/简短描述`、`feat/用户名/简短描述`
- bugfix 分支命名：`fix/issue编号-简短描述` 或 `fix/简短描述`
- release 分支命名：`release/v版本号`
- 禁止在分支名中使用中文、空格、特殊字符（仅限 `/`、`-`、`_`）
- 功能开发完成后立即合并删除，不保留超过 2 周的未合并分支

### 工作流程

```
用户需求/问题
    │
    ▼
从 main 创建 feat/xxx 或 fix/xxx 分支
    │
    ▼
在功能分支开发，包含 1-N 个提交
    │
    ▼
提交 PR 到 main，请求 Code Review
    │
    ▼
Review 通过，CI 绿灯，合并到 main
    │
    ▼
删除功能分支
    │
    ▼
从 main 拉出 release 分支做发布准备
    │
    ▼
发布完成，release 合并回 main，删除 release
```

## 提交信息规范

采用 **Conventional Commits** 格式：

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Type 类型

| type | 说明 | 是否在 changelog |
| --- | --- | --- |
| feat | 新功能 | 是 |
| fix | 缺陷修复 | 是 |
| docs | 文档更新 | 是 |
| style | 代码格式（不影响功能） | 否 |
| refactor | 重构（非新功能非修复） | 否 |
| perf | 性能优化 | 是 |
| test | 测试相关 | 否 |
| build | 构建或依赖变更 | 是 |
| ci | CI/CD 配置变更 | 否 |
| chore | 杂项（工具、配置） | 否 |
| revert | 回滚提交 | 是 |

### Scope 范围

可选，表示影响模块：`feat(api):`、`fix(ui):`、`refactor(auth):`、`fix(db):`

不使用 scope 时：`feat: add user login feature`

### Subject 规范

- 使用中文描述（项目规范默认中文）
- 不超过 72 字符
- 动词开头（add/create/fix/update/remove/delete）
- 不使用句号结尾
- 描述"做什么"而非"怎么做的"

### 示例

```
feat(auth): 新增短信验证码登录功能

支持手机号+短信验证码登录，包含：
- 发送验证码接口（含频率限制）
- 验证码登录接口（含 JWT 颁发）
- 登录失败锁定机制

Closes #123
```

```
fix(order): 修复支付回调重复处理问题

- 添加幂等键校验，防止重复回调
- 添加分布式锁确保并发安全

Fixes #456
```

```
refactor(api): 重构统一响应拦截器

- 抽取 code/message/data 包装逻辑为中间件
- 统一错误处理格式
```

## PR 规范

### PR 命名

`[TYPE] 简短描述 (#issue)`

示例：`[feat] 用户注册与邮箱验证 (#23)`

### PR 内容

必须包含：

- **背景**：为什么做这个改动
- **改动内容**：主要变更点
- **影响范围**：影响哪些模块、哪些功能
- **验证方式**：如何验证这个 PR 没有破坏已有功能
- **截图/录屏**：UI 改动必须附图

### PR 合并条件

以下条件必须全部满足才能合并：

- CI/CD 全部通过（lint、typecheck、test、build）
- 至少 1 人 approve（高风险模块至少 2 人）
- 无未解决的 conversation
- 分支是最新的 main（需要 rebase 或 merge main）
- 密钥扫描通过（无 `.env`、token、真实数据进入 diff）
- 功能测试/集成测试/自动化测试通过

### PR 大小限制

- 单个 PR 建议不超过 400 行有效代码变更
- 超过 400 行必须说明原因
- 超过 1000 行建议拆分为多个 PR
- 禁止将功能改动和格式改动混在一个 PR 中（格式改动单独一个 PR）

### Review Checklist

Reviewer 必须检查：

- 功能是否符合需求和验收标准
- 是否有安全和权限漏洞
- 是否有未处理的错误和边界情况
- 是否有重复造轮子（标准库或已有依赖是否足够）
- 是否有性能风险（循环、查询、渲染）
- 代码注释和命名是否清晰
- 测试覆盖率是否足够
- 是否符合本项目 Git 规范

## Commit 频率

- 每个功能分支建议 3-10 个提交
- 禁止一次性提交整个功能（原子性提交）
- 每次提交必须是一个独立、可回滚的变更
- WIP 提交允许，但合并前必须 squash 或 rebase

## 禁止行为

- 禁止直接向 main 分支 push
- 禁止在 main 上开发（必须从分支合并）
- 禁止提交包含密钥、token、`.env`、真实用户数据的代码
- 禁止提交构建产物（`node_modules`、`dist`、`build`）
- 禁止强制推送已合并的分支
- 禁止删除已发布版本的 tag
- 禁止在 commit message 中写"待定"、"TODO"作为已完成的内容
