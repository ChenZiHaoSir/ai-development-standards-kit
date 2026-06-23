# 数据库迁移规范

本文件定义 Schema 版本化、数据迁移、回滚策略和兼容性要求。

## 核心原则

- 每个数据库变更都必须有可执行的正向迁移和回滚方案。
- 迁移脚本必须版本化，按顺序执行，不得手动修改已执行的迁移。
- 生产数据库变更必须经过 DBA 或架构师审核。
- 所有迁移脚本必须可测试、可回滚、可复现。

## 迁移文件规范

### 文件命名

```
migrations/
  20240101_001_create_users_table.sql
  20240101_002_add_email_index.sql
  20240102_001_create_orders_table.sql
  20240102_002_add_user_id_to_orders.sql
```

格式：`YYYYMMDD序号_描述.sql`

### 文件结构

每个迁移文件必须包含：

```sql
-- Migration: 20240101_001_create_users_table
-- Author: developer
-- Date: 2024-01-01
-- Description: 创建用户表
-- Rollback: 20240101_001_create_users_table_rollback.sql

-- Forward
CREATE TABLE users (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(100) NOT NULL COMMENT '用户名称',
  email VARCHAR(255) NOT NULL COMMENT '邮箱',
  phone VARCHAR(20) COMMENT '手机号',
  status TINYINT DEFAULT 1 COMMENT '状态 0-禁用 1-正常',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY uk_email (email),
  INDEX idx_phone (phone)
) COMMENT='用户表';
```

## 向后兼容规则

### 列操作

- 新增列必须有默认值（MySQL 5.6+ 有默认值，新版本无此限制）
- 新增列必须允许 NULL 或有 DEFAULT（避免大表写锁）
- 修改列类型必须兼容已有数据
- 删除列必须先确认无代码引用

### 索引操作

- 新增索引使用 `ONLINE=ALGORITHM=INPLACE`（大表必须）
- 删除索引前确认无查询依赖
- 新增唯一索引前检查数据重复

### 表操作

- 删除表前确认无代码引用
- 表重命名必须有中间表或别名过渡期
- 大表 DDL 必须使用 online DDL 工具（如 `pt-osc`）

## 数据迁移规则

### 迁移脚本要求

- 大表数据迁移必须分批执行，单次不超过 10000 条
- 数据迁移脚本必须支持重试（幂等设计）
- 迁移过程中必须有日志记录进度和异常
- 迁移完成后必须有数据校验

### 数据校验

迁移完成后必须校验：

- 数据行数是否一致
- 关键字段值是否正确
- 索引是否完整生效
- 关联数据是否完整

## 回滚策略

### 回滚条件

以下情况必须回滚：

- 迁移脚本执行失败
- 数据校验不通过
- 性能下降超过阈值（P95 延迟增加 >50%）
- 业务指标异常

### 回滚操作

```sql
-- 回滚文件：同一目录下 _rollback 后缀
-- Rollback: 回滚到迁移前状态
DROP TABLE IF EXISTS users;
```

- 回滚脚本必须与正向迁移脚本同时提交
- 回滚操作必须在迁移失败后 5 分钟内完成
- 涉及数据删除的回滚，必须先备份再执行

## 生产环境审批

生产数据库变更必须经过以下审批：

```markdown
## 数据库变更申请

- 变更内容：
- 变更原因：
- 影响范围（表、行数、查询量）：
- 预计执行时间：
- 回滚方案：
- 审核人：
- 执行人：
- 执行时间窗口：
```

## 迁移验证

迁移执行前必须：

- 在 staging 环境执行一次，验证时间、数据和兼容性
- 检查迁移脚本语法（使用数据库自带的语法检查）
- 评估执行时间对线上流量的影响
- 确认回滚方案可执行

## 禁止行为

- 禁止直接修改线上表结构（必须通过迁移脚本）
- 禁止在业务高峰期执行大表 DDL
- 禁止跳过 staging 直接在生产执行迁移
- 禁止修改已执行的迁移脚本
- 禁止迁移脚本中包含真实生产数据
- 禁止不带 WHERE 的 UPDATE 或 DELETE（批量更新必须分批）
