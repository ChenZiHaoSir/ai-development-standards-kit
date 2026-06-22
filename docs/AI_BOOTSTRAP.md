# AI Bootstrap

本文件定义用户把仓库地址、压缩包或文件夹交给 AI 后，AI 应如何自动使用本规范包。

## 用户侧用法

用户只需要把以下任意一种内容发给 AI：

- 仓库地址：`https://github.com/ChenZiHaoSir/ai-development-standards-kit.git`
- 仓库地址：`https://gitee.com/czh1126/ai-development-standards-kit.git`
- 本项目压缩包。
- 解压后的本项目文件夹。

然后说：

```text
请读取这个规范包的 README，自动完成安装和初始化。完成后等待我描述项目需求。
```

## AI 必须执行的流程

1. 接收输入：
   - 如果是 Git 仓库地址，先 `git clone` 到当前工作区或临时工作区。
   - 如果是压缩包，先解压。
   - 如果是文件夹，直接进入该文件夹。
2. 定位规范包根目录，根目录必须同时存在 `README.md`、`AGENTS.md`、`scripts/` 和 `skills/ai-development-standards/`。
3. 读取 `README.md`。
4. 读取本文件 `docs/AI_BOOTSTRAP.md`。
5. 执行：

```bash
./scripts/bootstrap-ai-standards.sh
```

6. 如果脚本不可执行，先执行：

```bash
chmod +x ./scripts/bootstrap-ai-standards.sh
./scripts/bootstrap-ai-standards.sh
```

7. 如果无法执行脚本，手动降级执行：

```bash
./scripts/install-skill.sh
./scripts/setup-rtk.sh
```

8. 如果 RTK 安装失败，不阻塞后续流程，改用普通命令并遵守 `docs/process/CONTEXT_BUDGET.md`。
9. 安装完成后，AI 不应立刻创建业务项目，必须先请用户描述项目需求。

## 仓库地址处理示例

```bash
git clone https://github.com/ChenZiHaoSir/ai-development-standards-kit.git
cd ai-development-standards-kit
./scripts/bootstrap-ai-standards.sh
```

或：

```bash
git clone https://gitee.com/czh1126/ai-development-standards-kit.git
cd ai-development-standards-kit
./scripts/bootstrap-ai-standards.sh
```

## 后续项目启动提示词

安装完成后，AI 对用户输出：

```text
规范包已安装完成。请描述你的项目需求、目标用户、核心功能、技术偏好和交付形式。
```

用户提供需求后，AI 应使用：

```text
Use $ai-development-standards to initialize development standards and agent workflow for this repository.
```

如果当前 AI 环境不支持 Codex skill，也必须按 README 和 `docs/process`、`docs/agents` 中的规范手动执行同等流程。

## 自动初始化边界

- 可以自动安装本地 skill。
- 可以自动安装或初始化 RTK，但安装失败不得阻塞。
- 不得自动合并上游规范提案。
- 不得跳过用户需求澄清。
- 不得在未确认项目目录时把规范文件写入错误位置。
- 不得把本规范包本身当成用户业务项目。
- 如果 AI 环境不能联网、不能解压或不能执行 shell，必须把缺失能力明确告诉用户，并给出手动命令。
