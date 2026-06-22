# Engineering Workflow

## 单功能开发闭环

1. 写清用户问题、业务目标和非目标。
2. 写清验收标准。
3. 说明涉及模块、输入输出、数据流和性能影响。
4. 执行最小必要实现判断：是否需要做、标准库/平台/已有依赖是否已覆盖、是否必须新增自定义代码。
5. 执行上下文预算判断：先搜索和摘要，再读取必要文件片段；长输出保存到文件并只引用关键证据。
6. 先定义契约，再实现模块。
7. 修改代码。
8. 补充单元测试、集成测试或 smoke 验证。
9. 运行必要验证命令。
10. 更新相关文档和进度记录。
11. 检查工作区状态。
12. 使用中文提交信息提交，并按项目要求推送。

## 默认目录基线

```text
src/
  app/
  pages/
  features/
  shared/
  services/
  domain/
  infrastructure/
  test/
docs/
scripts/
```

框架有官方目录规范时，以官方规范优先；本文目录作为边界参考。

## 验证命令基线

```bash
pnpm typecheck
pnpm lint
pnpm test
pnpm smoke
pnpm benchmark
pnpm build
```

没有 `pnpm` 的项目应提供等价命令，并在 README 写清。

## 上下文预算

- 探索仓库优先使用 `rg --files`、`rg -n`、`git diff --stat`、`git diff --name-only`。
- 读取文件优先读取相关片段，不默认全量读取大文件。
- 测试、构建、lint 输出优先保留失败、警告和摘要。
- 如果环境安装了 `rtk`，可以优先使用 `rtk git status`、`rtk git diff`、`rtk read`、`rtk grep`、`rtk test` 等压缩输出命令。
- 详细规则见 `docs/process/CONTEXT_BUDGET.md`。

## PR 规则

- 一个 PR 只解决一个明确问题。
- 默认不超过 400 行有效代码变更，超过必须说明原因或拆分。
- 涉及 UI 必须提供截图、录屏或可复现验证证据。
- 高风险模块至少 2 名评审或负责人确认。
- CI 失败不得合并，除非有负责人批准的临时豁免和补偿任务。
