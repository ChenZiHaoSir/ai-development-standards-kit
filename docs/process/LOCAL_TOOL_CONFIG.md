# 本地工具配置规范

本文件约束安装规范包和使用专业技能时，AI 如何处理需要密钥、本地 token 或供应商配置的工具。

## 总原则

- 真实 API Key、token、云服务凭据、本地工具配置不得写入项目仓库。
- 真实凭据不得上传到 npm、GitHub、Gitee、PR、issue、日志、截图或文档示例。
- 优先保存到用户主目录、本机密钥管理器或明确被 `.gitignore` 忽略的本地路径。
- 仓库只能保存模板、示例字段名和配置说明，不能保存真实 key。
- 用户可以跳过可选工具配置；跳过不得阻塞规范初始化。
- AI 在提交、发布或生成补丁前，必须检查 `.env`、`openai.json`、`.gstack/`、`*.secret.json`、真实 token、本地绝对路径和敏感截图未进入 diff。

## 安装时可提示的配置

| 工具 | 用途 | 本地配置位置 | 安装时动作 |
| --- | --- | --- | --- |
| gstack UI 设计稿/生图工具 | UI 设计稿、生图、视觉探索 | `~/.gstack/openai.json` | 检测到工具或用户主动运行 `standards setup-local-config` 时提示配置 |

当前支持的 gstack 生图配置：

```json
{
  "provider": "grsai",
  "api_key": "你的本地 API Key",
  "base_url": "https://grsai.dakka.com.cn",
  "model": "gpt-image-2"
}
```

可选服务地址：

- GRSAI 国内地址：`https://grsai.dakka.com.cn`
- GRSAI 海外地址：`https://grsaiapi.com`
- OpenAI 官方兼容配置：`https://api.openai.com`

## 不应在安装时统一收集的配置

以下配置通常和具体业务项目、部署平台或运行环境有关，必须在执行对应任务时再询问用户：

- 部署平台 token，例如 Vercel、Netlify、Render、Fly.io、云厂商 AK/SK。
- 数据库连接串、对象存储密钥、短信、支付、地图、邮件等业务服务凭据。
- 生产环境账号、测试账号、后台管理账号。
- CI/CD secrets、GitHub token、Gitee token、npm token。
- 监控、日志、埋点、告警平台凭据。

## AI 执行要求

1. 初始化规范包时，运行 `standards setup-local-config` 检查安装时可配置的本地工具。
2. 如果当前不是交互式终端，只输出配置说明，不得卡住流程。
3. 如果用户跳过配置，记录“已跳过”，并继续初始化。
4. 具体任务需要项目级凭据时，先说明用途、保存位置、是否会上传、是否会进入日志，再询问用户。
5. 不得为了方便把凭据写入 `README.md`、`AGENTS.md`、`CLAUDE.md`、`GEMINI.md`、`.cursor/`、`.github/` 或任何会提交的文件。
6. 需要示例时，只能使用占位符，例如 `YOUR_API_KEY`、`[REDACTED]`。
