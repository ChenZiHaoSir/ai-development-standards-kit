# 环境配置与 Feature Flag

本文件定义环境变量管理、配置层级和 Feature Flag 使用规范。

## 环境变量层级

| 环境 | 用途 | 访问范围 | 示例 |
| --- | --- | --- | --- |
| local | 本地开发 | 仅开发者本地机器 | `DB_HOST=localhost` |
| dev | 开发/联调环境 | 开发团队 | `DB_HOST=dev.db.internal` |
| staging | 预发布/测试环境 | 测试团队、部分用户 | `DB_HOST=staging.db.internal` |
| prod | 生产环境 | 所有用户 | `DB_HOST=prod.db.internal` |

## .env 文件规范

```
# .env.example（必须提交到仓库）
# 所有环境变量占位符，不含真实值
DATABASE_URL=
API_BASE_URL=
REDIS_URL=
JWT_SECRET=
SMS_PROVIDER_API_KEY=
ALLOWED_ORIGIN=
```

```
# .env.local（不提交到仓库，优先级最高）
# 本地覆盖值
DATABASE_URL=postgres://localhost:5432/myapp_dev
```

```
# .env.development / .env.test（提交到仓库的各环境默认值）
```

```
# .env.production（不提交到仓库，仅在 CI/CD 或云平台注入）
```

## 敏感变量管理

| 变量类型 | 存储位置 | 读取方式 |
| --- | --- | --- |
| 数据库连接 | 云平台秘钥管理（AWS Secrets Manager / 阿里云 KMS / Vault） | 启动时注入或运行时从秘钥服务拉取 |
| 第三方 API Key | 云平台秘钥管理 | 同上 |
| JWT Secret | 云平台秘钥管理 | 同上 |
| 加密盐 | 云平台秘钥管理 | 同上 |
| 环境标识 | CI/CD 注入的固定变量 | `process.env.NODE_ENV` |

禁止将真实密钥写入 `.env` 文件后提交到仓库。

## 环境配置最佳实践

- 所有可配置项必须进入环境变量，禁止硬编码
- 配置项必须有默认值或加载失败时的安全降级
- 敏感变量名必须清晰，禁止使用 `SECRET`、`KEY` 等泛名
- 环境变量变更必须记录到配置变更日志
- 生产环境变量变更必须经过审批流程

## Feature Flag 规范

### 何时使用 Feature Flag

- 功能灰度发布：A/B 测试、灰度放量
- 实验性功能：验证后再全量
- 紧急开关：出现问题可快速关闭而不需要回滚
- 权限控制：基于用户属性的功能开关
- 运维控制：降级开关、流量切换

### 何时不使用 Feature Flag

- 永久性功能（发布完成后删除 flag）
- 跨多个模块的架构变更（用 Feature Flag 会导致代码混乱）
- 短期调试（用完就删，长期调试改用日志）

### Feature Flag 命名

```
ff_<模块>_<功能>_<动作>
```

示例：

```
ff_user_login_sms_enabled
ff_order_payment_wxpay_enabled
ff_ai_imagegen_quality_high
```

### Feature Flag 配置内容

每个 Feature Flag 必须记录：

```markdown
## FF-XXX: 功能名称

- 模块：
- 负责人：
- 创建时间：
- 预计删除时间：
- 说明：

## 开关配置

| 环境 | 默认值 | 说明 |
| --- | --- | --- |
| local | true | 开发时默认打开 |
| dev | true | 开发环境默认打开 |
| staging | false | 预发布默认关闭 |
| prod | false | 生产默认关闭 |

## 灰度策略

- 第一批：内部用户（10%）
- 第二批：VIP 用户（30%）
- 第三批：所有用户（100%）

## 删除计划

发布后两周内删除，负责人：
```

### Feature Flag 实现

使用成熟的 Feature Flag 服务（如 Unleash、Flipt、LaunchDarkly）：

- 禁止用数据库表或配置文件模拟 Feature Flag（难以实时生效）
- Flag 评估必须在内存或缓存中进行，禁止每次请求都查询远程
- Flag 评估必须有超时降级：超时或服务不可用时走默认值
- Flag 评估必须记录评估结果和开关值（用于排查问题）

## 禁止行为

- 禁止将 `.env` 文件提交到 Git（含 example 除外）
- 禁止在代码中硬编码任何可配置值
- 禁止将真实密钥写进 Git history（即使后来删除，Git 历史仍存在）
- 禁止将 Feature Flag 用于永久性功能（导致代码复杂度累积）
- 禁止在 Feature Flag 判断中执行重计算逻辑（Flag 只是布尔判断）
