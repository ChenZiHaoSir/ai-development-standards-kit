# Standards Evolution

本规范定义当其他项目使用本规范库时，如何发现、记录、自动提出和审核规范改进。

目标：

- 让使用者项目中的 AI 能主动发现规范缺口。
- 让 AI 能生成可审核的优化提案。
- 允许使用者项目先执行本地补丁规范。
- 上游规范仓库必须由维护者审核后才正式合并。

## 两层规范

| 层级 | 位置 | 生效方式 |
| --- | --- | --- |
| 上游基线规范 | `ai-development-standards-kit` | 由维护者审核合并后生效 |
| 项目本地补丁规范 | 使用者项目内 `docs/process/STANDARDS_LOCAL_PATCHES.md` | 项目内立即生效，但不得削弱上游底线 |

项目本地补丁只能增强、细化或澄清规范，不能取消安全、测试、质量门禁、权限、数据保护、发布回滚等底线。

## 什么时候提出规范优化

AI 在以下情况下必须记录规范反馈：

- 同类问题在项目中重复出现 2 次及以上。
- 现有规范没有覆盖某个新技术栈、新平台、新端或新 AI 能力。
- 规范表述含糊，导致不同智能体理解不一致。
- 现有规范过度严格，阻碍合理交付，且有更可验证的替代规则。
- 线上事故、P0/P1 缺陷、安全问题、发布失败暴露了规范缺口。
- 某条规范无法自动化、无法评审、无法验证，需要改写。
- 使用者项目沉淀出更好的模板、检查清单、工作流或质量门禁。

## 本地执行规则

使用者项目可以先新增：

```text
docs/process/STANDARDS_UPSTREAM_CONFIG.json
docs/process/STANDARDS_LOCAL_PATCHES.md
docs/process/STANDARDS_FEEDBACK.md
docs/process/STANDARDS_UPSTREAM_PROPOSALS.md
```

其中：

- `STANDARDS_UPSTREAM_CONFIG.json`：上游规范仓库地址、默认分支、候选分支前缀和审核策略。
- `STANDARDS_LOCAL_PATCHES.md`：本项目立即执行的补丁规范。
- `STANDARDS_FEEDBACK.md`：发现的问题、证据和上下文。
- `STANDARDS_UPSTREAM_PROPOSALS.md`：准备提交给上游仓库的优化建议。

AI 必须在主会话中说明：

```text
本地补丁已在当前项目执行，但尚未成为上游规范。
上游规范变更需要提交候选提案，由维护者审核后合并。
```

## 上游仓库配置

如果使用者拿到的是压缩包或普通文件夹，而不是 Git 仓库，AI 必须先查找上游配置文件：

```text
docs/process/STANDARDS_UPSTREAM_CONFIG.json
standards-upstream.json
standards-upstream.example.json
```

配置示例：

```json
{
  "name": "ai-development-standards-kit",
  "primaryRemote": "https://gitee.com/czh1126/ai-development-standards-kit.git",
  "mirrors": [
    {
      "name": "github",
      "url": ""
    }
  ],
  "defaultBranch": "main",
  "proposalBranchPrefix": "proposal/standards-",
  "proposalCommitPrefix": "proposal: 优化开发规范-",
  "maintainerReviewRequired": true,
  "allowAutoMerge": false
}
```

规则：

- `primaryRemote` 是默认提交提案的上游仓库地址。
- `mirrors` 可填写 GitHub、GitLab 或其他镜像地址；如果 `primaryRemote` 不可用，AI 可以使用镜像地址创建提案。
- `allowAutoMerge` 必须默认为 `false`。
- 如果配置缺失，AI 只能生成 patch 和提案文档，不能猜测上游地址。
- 如果使用者指定新的 GitHub 仓库地址，AI 必须更新该配置，而不是只改远端。

## 上游提案格式

每条提案必须包含：

```markdown
## 标题

一句话说明要优化什么。

## 触发场景

在哪个项目、哪个任务、哪个阶段发现。

## 问题证据

- 具体文件 / PR / 缺陷 / 事故 / 讨论：
- 现有规范哪里不足：

## 建议变更

- 新增：
- 修改：
- 删除：

## 影响范围

- 适用项目类型：
- 是否影响安全、测试、发布或 AI 行为：
- 是否需要迁移：

## 本地验证

- 当前项目是否已经试用：
- 验证结果：
- 副作用：

## 审核建议

建议：采纳 / 暂缓 / 拒绝
原因：
```

## 自动提交到上游

如果使用者环境有权限，AI 可以创建候选分支并提交到上游仓库，但必须遵守：

- 提交前必须读取 `STANDARDS_UPSTREAM_CONFIG.json` 或等价上游配置，确认 `primaryRemote`、`defaultBranch` 和 `allowAutoMerge`。
- 分支命名：`proposal/standards-短说明`
- 提交信息：`proposal: 优化开发规范-短说明`
- 只修改规范、模板、skill 或文档，不夹带业务项目代码。
- 不直接推送到上游主分支。
- 不自动合并。
- 提交说明必须包含提案背景、证据、影响范围和本地验证。

如果没有权限，AI 应生成 patch 或提案文档，由使用者手动提交。

## 维护者审核门禁

维护者审核时必须判断：

- 是否解决真实重复问题，而不是单个项目偏好。
- 是否不削弱安全、测试、质量、发布和数据保护底线。
- 是否足够通用，适合进入上游基线。
- 是否可执行、可评审、可验证。
- 是否会让规范过度复杂。
- 是否需要放入专项参考，而不是主规范。

审核结论：

```text
ACCEPTED / NEEDS_REVISION / REJECTED / LOCAL_ONLY
```

## 自我更新但不失控

AI 可以在使用过程中自动优化当前项目的本地规范，并立即按本地补丁执行；但上游规范必须走候选提案和维护者审核。

一句话规则：

```text
本地可以自动改进并执行，上游只能自动提案，不能自动生效。
```
