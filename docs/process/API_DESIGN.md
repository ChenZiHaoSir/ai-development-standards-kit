# API Design

本文件定义前后端 API 的设计规范。所有 HTTP API 必须按本文件执行。

## 统一响应格式

所有 API 响应必须使用统一包装格式：

```json
{
  "code": 0,
  "message": "success",
  "data": {},
  "requestId": "req_abc123",
  "timestamp": 1740000000000
}
```

| 字段 | 类型 | 必须 | 说明 |
| --- | --- | --- | --- |
| code | number | 是 | 业务状态码，0=成功，非0=失败 |
| message | string | 是 | 状态描述，成功时为 "success" |
| data | any | 是 | 业务数据，失败时为 null |
| requestId | string | 是 | 请求追踪 ID，用于日志关联 |
| timestamp | number | 是 | 响应时间戳（毫秒） |

禁止直接返回 HTTP 状态码作为业务错误依据。前端必须以 `code` 字段判断成功或失败。

## 业务错误码规范

### 错误码分层

| 层级 | 范围 | 说明 |
| --- | --- | --- |
| 系统级 | 1000-1999 | 系统错误，如服务不可用、限流、内部异常 |
| 鉴权级 | 2000-2999 | 认证授权错误，如 token 失效、无权限 |
| 参数级 | 3000-3999 | 请求参数校验失败 |
| 业务级 | 4000-4999 | 业务逻辑错误，如资源不存在、业务规则冲突 |
| 第三方级 | 5000-5999 | 外部服务调用失败 |

### 常用错误码

| code | message | 说明 |
| --- | --- | --- |
| 0 | success | 成功 |
| 1001 | internal error | 内部错误 |
| 1002 | service unavailable | 服务不可用 |
| 1003 | rate limit exceeded | 请求过于频繁 |
| 2001 | unauthorized | 未登录 |
| 2002 | token expired | token 过期 |
| 2003 | forbidden | 无权限 |
| 3001 | invalid parameter | 参数错误 |
| 3002 | missing required field | 缺少必填字段 |
| 4001 | resource not found | 资源不存在 |
| 4002 | resource already exists | 资源已存在 |
| 4003 | business rule violation | 业务规则冲突 |

## RESTful 路由规范

- 使用名词表示资源，不用动词：`GET /users`、`POST /orders`
- 使用 HTTP 方法表示动作：`GET`（查询）、`POST`（创建）、`PUT`（全量更新）、`PATCH`（部分更新）、`DELETE`（删除）
- 使用复数形式：`/users` 而非 `/user`
- 嵌套资源限制在一级：`/users/{id}/orders`（可），`/users/{id}/orders/{orderId}/items/{itemId}`（不可）
- URL 全部小写，用中划线分隔：`/order-items` 而非 `/orderItems`
- 文件上传：`POST /files/upload`
- 批量操作：`POST /users/batch-delete`

## 分页规范

所有列表接口必须支持分页：

```json
{
  "code": 0,
  "message": "success",
  "data": {
    "list": [],
    "pagination": {
      "page": 1,
      "pageSize": 20,
      "total": 100,
      "totalPages": 5
    }
  }
}
```

分页参数：

| 参数 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| page | number | 1 | 页码，从 1 开始 |
| pageSize | number | 20 | 每页条数，最大 100 |
| sort | string | | 排序字段，如 `createdAt:desc` |
| filter | string | | 过滤条件，URLEncode 的 JSON |

禁止在不指定分页的情况下返回全量数据。

## 过滤、排序、字段选择

| 参数 | 说明 | 示例 |
| --- | --- | --- |
| filter | URLEncode 的 JSON 过滤条件 | `{"status":"active","role":"admin"}` |
| fields | 逗号分隔的返回字段 | `id,name,email` |
| expand | 展开关联资源 | `orders,profile` |
| sort | 排序字段和方向 | `createdAt:desc,name:asc` |

## 字段命名规范

- 请求和响应字段统一使用 camelCase：`userName`、`orderId`
- 布尔字段前缀：`is`、`has`、`can`、`should`
- 时间字段统一毫秒时间戳（除非 RFC3339 另有要求）
- 金额统一分为单位（整数），不用小数：`100` 表示 1.00 元
- ID 类型统一为 string，避免大数问题

## API 版本策略

- 使用 URL 路径版本：`/v1/users`、`/v2/users`
- 除非有重大不兼容，否则不轻易升级主版本
- 新增字段、可选参数不破坏兼容性时可以同版本
- 删除字段、修改类型、修改语义必须升级版本
- 旧版本至少保留一个 LTS 周期（建议 6 个月）再废弃
- 废弃前必须通知用户，提供迁移指南

## 超时规范

| 场景 | 默认超时 |
| --- | --- |
| 简单查询 | ≤ 5s |
| 普通写操作 | ≤ 10s |
| 复杂查询/计算 | ≤ 30s |
| 文件上传 | ≤ 120s |
| 文件下载 | ≤ 300s |
| 异步任务提交 | ≤ 5s |

## 安全约束

- 敏感操作（修改密码、删除数据、支付）必须验证身份和权限
- 接口必须有防重复提交机制（幂等 token 或天然幂等设计）
- 请求频率必须有限流，401 后登录失败超过 5 次必须临时封禁 IP
- 禁止在 URL query 参数中传递密码、token、密钥等敏感信息
- CORS 配置必须明确允许的域名
- 所有 API 必须通过 HTTPS 提供

## API 文档要求

每个 API 必须包含：

- 接口路径和方法
- 权限要求（登录/特定角色/管理员）
- 请求字段表（含类型、必填、校验规则）
- 响应字段表（含类型和空值语义）
- 错误码表
- 请求/响应示例
- 认证方式（Bearer Token / API Key / Session）

## 禁止行为

- 禁止直接返回数据库原始错误信息
- 禁止返回 HTTP 500 而 code 为 0
- 禁止无分页返回全量数据
- 禁止在 URL 中传递敏感信息
- 禁止同一个 API 每次返回字段不一致
- 禁止返回非公开接口的路径信息（如 `/api/internal/xxx`）
