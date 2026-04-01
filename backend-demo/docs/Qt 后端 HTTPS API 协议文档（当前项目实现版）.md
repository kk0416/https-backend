# Qt 后端 HTTPS API 协议文档（当前项目实现版）

## 1. 文档说明

- 文档用途：基于当前 `backend-demo` 项目实际代码，整理 Qt 客户端与后端之间的 HTTPS API 协议。
- 适用范围：仅覆盖仓库当前已经实现并可从代码确认的接口能力。
- 文档状态：实现对照稿。内容以 `src/controller`、`src/service`、`main.ts`、`AllExceptionsFilter` 为准。
- 参考格式：对齐 `Qt 后端 HTTP API 协议文档（初稿）.md` 的章节组织方式，但接口内容以当前项目真实实现为准。

## 2. 当前接口能力概览

### 2.1 已实现接口

| 模块 | 接口 | 说明 |
| --- | --- | --- |
| 健康检查 | `GET /api/v1/health` | 业务前缀下健康检查 |
| 健康检查 | `GET /health` | Docker / Helm / 华为云探针兼容健康检查 |
| 总览统计 | `GET /api/v1/dashboard/data-summary` | 同时返回数据数量和任务数量统计 |
| 数据管理 | `GET /api/v1/data-assets` | 数据资产分页列表 |
| 数据管理 | `GET /api/v1/data-assets/upload-options` | 返回上传弹窗使用的现场和场景选项 |
| 数据管理 | `POST /api/v1/data-assets/upload-raw` | 上传原始数据并创建上传任务记录 |
| 数据管理 | `GET /api/v1/data-assets/tree` | 基于 `sourceDataId` 生成树状结构 |
| 数据管理 | `GET /api/v1/data-assets/graph` | 基于 `sourceDataId` 生成关系图 |
| 任务管理 | `GET /api/v1/tasks` | 任务分页列表 |
| 数据处理 | `POST /api/v1/data-assets/{id}/generate-point-cloud` | 从原始数据创建点云生成任务 |

### 2.2 当前未实现能力

以下能力在参考初稿中出现过，但当前项目代码中尚未落地：

- `GET /api/v1/dashboard/task-summary`
- `GET /api/v1/dashboard/tasks`
- `GET /api/v1/dashboard/operation-logs`
- `GET /api/v1/data-assets/{id}`
- `PATCH /api/v1/data-assets/{id}`
- `DELETE /api/v1/data-assets/{id}`
- `POST /api/v1/data-assets/batch-delete`
- `POST /api/v1/data-assets/{id}/generate-2d`
- `POST /api/v1/data-assets/{id}/generate-3d`
- `POST /api/v1/data-assets/{id}/generate-gaussian`
- `GET /api/v1/data-assets/{id}/download-url`
- `GET /api/v1/tasks/{taskId}`
- `GET /api/v1/tasks/{taskId}/target`

### 2.3 当前项目与参考初稿的关键差异

| 项目 | 参考初稿 | 当前实现 |
| --- | --- | --- |
| 协议 | `HTTP` | 实际启动为 `HTTPS` |
| 认证 | 预留 Bearer Token | 当前未实现鉴权 |
| 统一响应 | 含 `requestId` | 当前无 `requestId` 字段 |
| 数据 ID | 字符串 ID | 当前全部为整数主键 |
| 总览统计 | 数据统计、任务统计分成多个接口 | 当前合并在 `GET /dashboard/data-summary` 一个接口里 |
| 关系图路由 | `/data-assets/relation-graph` | 当前为 `/data-assets/graph` |

## 3. 核心对象模型

### 3.1 DataAsset 数据资产

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `id` | integer | 数据主键 |
| `siteId` | integer | 所属现场 ID |
| `siteName` | string | 现场名称，列表接口通过关联查询补出 |
| `sceneId` | integer | 所属场景 ID |
| `sceneName` | string | 场景名称，列表接口通过关联查询补出 |
| `dataType` | enum | `raw` / `point_cloud` / `gaussian` / `map_2d` / `map_3d` |
| `dataName` | string | 数据名称 |
| `status` | enum | `uploading` / `queued` / `processing` / `ready` / `failed` / `deleted` |
| `progress` | integer | 进度，`0-100` |
| `sourceDataId` | integer\|null | 上游数据 ID |
| `currentTaskId` | integer\|null | 当前关联任务 ID |
| `storagePath` | string\|null | 存储路径 |
| `fileName` | string\|null | 文件名 |
| `fileSize` | integer\|null | 文件大小，单位字节 |
| `operatorId` | string\|null | 操作人 ID |
| `operatorName` | string\|null | 操作人名称 |
| `createdAt` | string | ISO 8601 时间 |
| `updatedAt` | string | ISO 8601 时间 |
| `deletedAt` | string\|null | 逻辑删除时间 |

### 3.2 ProcessTask 处理任务

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `id` | integer | 任务主键 |
| `siteId` | integer | 现场 ID |
| `siteName` | string | 现场名称 |
| `sceneId` | integer | 场景 ID |
| `sceneName` | string | 场景名称 |
| `taskType` | enum | `upload_raw` / `generate_point_cloud` / `generate_2d` / `generate_3d` / `generate_gaussian` |
| `taskTitle` | string\|null | 任务标题 |
| `sourceDataId` | integer\|null | 输入数据 ID |
| `sourceDataName` | string\|null | 输入数据名称 |
| `targetDataId` | integer\|null | 输出数据 ID |
| `targetDataName` | string\|null | 输出数据名称 |
| `status` | enum | `queued` / `running` / `success` / `failed` / `canceled` |
| `progress` | integer | 进度，`0-100` |
| `errorCode` | string\|null | 错误码 |
| `errorMessage` | string\|null | 错误信息 |
| `operatorId` | string\|null | 操作人 ID |
| `operatorName` | string\|null | 操作人名称 |
| `createdAt` | string | 创建时间 |
| `startedAt` | string\|null | 开始时间 |
| `finishedAt` | string\|null | 结束时间 |
| `updatedAt` | string | 更新时间 |

### 3.3 TreeNode 树视图节点

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `id` | integer | 数据 ID |
| `dataName` | string | 数据名称 |
| `dataType` | string | 数据类型，小写下划线 |
| `status` | string | 数据状态，小写下划线 |
| `progress` | integer | 进度 |
| `sourceDataId` | integer\|null | 上游数据 ID |
| `children` | TreeNode[] | 子节点列表 |

### 3.4 Graph 关系图结构

`GET /api/v1/data-assets/graph` 返回：

- `nodes`：图节点数组
- `edges`：边数组，表示 `sourceDataId -> id`

## 4. 公共协议约定

### 4.1 Base URL

业务接口统一前缀：

```text
/api/v1
```

探针兼容健康检查：

```text
/health
```

### 4.2 传输协议

- 当前服务通过 HTTPS 启动。
- 本地 `.env` 默认端口为 `34430`。
- 默认本地示例地址：

```text
https://127.0.0.1:34430
```

### 4.3 认证方式

- 当前项目未实现登录和鉴权。
- 当前所有接口均未要求 `Authorization` 请求头。

### 4.4 通用请求头

当前接口未强制要求特殊请求头。JSON 接口建议使用：

```http
Content-Type: application/json
Accept: application/json
```

### 4.5 统一成功响应

```json
{
  "code": 0,
  "message": "ok",
  "data": {}
}
```

说明：

- `code = 0` 表示成功。
- 当前实现没有 `requestId` 字段。
- 各接口实际业务内容放在 `data` 字段中。

### 4.6 统一错误响应

全局异常过滤器会返回：

```json
{
  "code": 400,
  "message": "invalid data asset id",
  "data": {
    "path": "/api/v1/data-assets/abc/generate-point-cloud",
    "timestamp": "2026-03-27T05:20:00.000Z"
  }
}
```

说明：

- `code` 直接等于 HTTP 状态码，而不是业务错误码。
- `message` 为异常消息字符串。
- `data.path` 为请求路径。
- `data.timestamp` 为错误返回时间，ISO 8601 格式。

### 4.7 分页结构

列表接口统一返回：

```json
{
  "list": [],
  "page": 1,
  "pageSize": 20,
  "total": 0
}
```

### 4.8 时间格式

- 列表和详情中的时间统一通过 `Date.toISOString()` 输出。
- 示例：

```text
2026-03-25T14:10:00.000Z
```

### 4.9 枚举格式转换

- 数据库存储和 Prisma 使用大写枚举，例如 `POINT_CLOUD`。
- API 返回给前端时统一转成小写下划线，例如 `point_cloud`。
- 列表筛选时也应传小写下划线值，例如：
  - `dataType=point_cloud`
  - `status=processing`

## 5. 枚举定义

### 5.1 数据类型 `dataType`

| 枚举值 | 中文 |
| --- | --- |
| `raw` | 原始数据 |
| `point_cloud` | 点云数据 |
| `gaussian` | 高斯数据 |
| `map_2d` | 2D 数据 |
| `map_3d` | 3D 数据 |

### 5.2 数据状态 `status`

| 枚举值 | 中文 |
| --- | --- |
| `uploading` | 上传中 |
| `queued` | 排队中 |
| `processing` | 处理中 |
| `ready` | 可用 |
| `failed` | 失败 |
| `deleted` | 已删除 |

### 5.3 任务类型 `taskType`

| 枚举值 | 中文 |
| --- | --- |
| `upload_raw` | 上传原始数据 |
| `generate_point_cloud` | 生成点云 |
| `generate_2d` | 生成 2D |
| `generate_3d` | 生成 3D |
| `generate_gaussian` | 生成高斯 |

### 5.4 任务状态 `task.status`

| 枚举值 | 中文 |
| --- | --- |
| `queued` | 排队中 |
| `running` | 运行中 |
| `success` | 成功 |
| `failed` | 失败 |
| `canceled` | 已取消 |

## 6. 页面到接口映射表

| 页面/功能 | 当前接口 | 说明 |
| --- | --- | --- |
| 服务健康检查 | `GET /api/v1/health` | 业务前缀下使用 |
| 探针健康检查 | `GET /health` | 探针使用 |
| 首页总览统计 | `GET /api/v1/dashboard/data-summary` | 同时返回数据数量和任务数量 |
| 数据列表页 | `GET /api/v1/data-assets` | 支持分页和筛选 |
| 原始数据上传弹窗 | `GET /api/v1/data-assets/upload-options` | 获取现场和场景下拉选项 |
| 原始数据上传提交 | `POST /api/v1/data-assets/upload-raw` | 提交文件和上传元数据 |
| 树状视图 | `GET /api/v1/data-assets/tree` | 直接返回树节点数组 |
| 关系图视图 | `GET /api/v1/data-assets/graph` | 返回 `nodes + edges` |
| 任务列表页 | `GET /api/v1/tasks` | 支持分页和状态筛选 |
| 原始数据生成点云 | `POST /api/v1/data-assets/{id}/generate-point-cloud` | 创建任务、目标资产和日志 |

## 7. API 详细定义

### 7.1 业务健康检查

```http
GET /api/v1/health
```

说明：

- 由 `HealthController` 提供。
- 不依赖数据库，仅用于确认服务启动成功。

响应示例：

```json
{
  "code": 0,
  "message": "ok",
  "data": {
    "service": "gaussian-backend-demo",
    "status": "running"
  }
}
```

### 7.2 探针兼容健康检查

```http
GET /health
```

说明：

- 由 `main.ts` 直接在 Fastify 实例上注册。
- 返回结构与 `/api/v1/health` 一致。

### 7.3 获取总览统计

```http
GET /api/v1/dashboard/data-summary
```

请求参数：

| 参数 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| `siteId` | string | 否 | 现场 ID，代码中会转为整数 |
| `sceneId` | string | 否 | 场景 ID，代码中会转为整数 |

说明：

- 接口名称叫 `data-summary`，但实际同时返回数据数量和任务数量。
- 当前项目没有单独的 `task-summary` 接口。

响应示例：

```json
{
  "code": 0,
  "message": "ok",
  "data": {
    "rawCount": 1,
    "pointCloudCount": 1,
    "gaussianCount": 1,
    "map2dCount": 1,
    "map3dCount": 1,
    "totalTaskCount": 4,
    "runningTaskCount": 1
  }
}
```

### 7.4 获取数据资产列表

```http
GET /api/v1/data-assets
```

请求参数：

| 参数 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| `siteId` | string | 否 | 现场 ID |
| `sceneId` | string | 否 | 场景 ID |
| `dataType` | string | 否 | 小写下划线枚举 |
| `status` | string | 否 | 小写下划线枚举 |
| `page` | string | 否 | 默认 `1`，非正整数会回退到默认值 |
| `pageSize` | string | 否 | 默认 `20`，非正整数会回退到默认值 |

响应示例：

```json
{
  "code": 0,
  "message": "ok",
  "data": {
    "list": [
      {
        "id": 12,
        "siteId": 1,
        "siteName": "A 线",
        "sceneId": 1,
        "sceneName": "仓库",
        "dataType": "raw",
        "dataName": "仓库原始数据-01",
        "status": "ready",
        "progress": 100,
        "sourceDataId": null,
        "currentTaskId": 22,
        "storagePath": "/data/raw/warehouse-01.zip",
        "fileName": "warehouse-01.zip",
        "fileSize": 2097152,
        "operatorId": "demo-user",
        "operatorName": "演示用户",
        "createdAt": "2026-03-25T14:00:00.000Z",
        "updatedAt": "2026-03-25T14:05:00.000Z",
        "deletedAt": null
      }
    ],
    "page": 1,
    "pageSize": 20,
    "total": 5
  }
}
```

### 7.5 获取树状视图

```http
GET /api/v1/data-assets/tree
```

请求参数：

| 参数 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| `siteId` | string | 否 | 现场 ID |
| `sceneId` | string | 否 | 场景 ID |

说明：

- 该接口不分页。
- 服务端先查出符合条件的全部资产，再按 `sourceDataId` 挂接父子关系。
- 响应中的 `data` 直接是数组，不再包一层 `list`。

响应示例：

```json
{
  "code": 0,
  "message": "ok",
  "data": [
    {
      "id": 12,
      "dataName": "仓库原始数据-01",
      "dataType": "raw",
      "status": "ready",
      "progress": 100,
      "sourceDataId": null,
      "children": [
        {
          "id": 13,
          "dataName": "仓库点云数据-01",
          "dataType": "point_cloud",
          "status": "ready",
          "progress": 100,
          "sourceDataId": 12,
          "children": [
            {
              "id": 14,
              "dataName": "仓库高斯数据-01",
              "dataType": "gaussian",
              "status": "ready",
              "progress": 100,
              "sourceDataId": 13,
              "children": []
            }
          ]
        }
      ]
    }
  ]
}
```

### 7.6 获取关系图

```http
GET /api/v1/data-assets/graph
```

请求参数：

| 参数 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| `siteId` | string | 否 | 现场 ID |
| `sceneId` | string | 否 | 场景 ID |

响应示例：

```json
{
  "code": 0,
  "message": "ok",
  "data": {
    "nodes": [
      {
        "id": 12,
        "label": "仓库原始数据-01",
        "dataType": "raw",
        "status": "ready",
        "progress": 100,
        "siteId": 1,
        "sceneId": 1
      },
      {
        "id": 13,
        "label": "仓库点云数据-01",
        "dataType": "point_cloud",
        "status": "ready",
        "progress": 100,
        "siteId": 1,
        "sceneId": 1
      }
    ],
    "edges": [
      {
        "source": 12,
        "target": 13
      }
    ]
  }
}
```

### 7.7 获取任务列表

```http
GET /api/v1/tasks
```

请求参数：

| 参数 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| `siteId` | string | 否 | 现场 ID |
| `sceneId` | string | 否 | 场景 ID |
| `status` | string | 否 | 任务状态，小写下划线枚举 |
| `page` | string | 否 | 默认 `1` |
| `pageSize` | string | 否 | 默认 `20` |

说明：

- 当前任务列表接口暂不支持 `taskType`、`sourceDataId`、`targetDataId` 筛选。
- 返回结果已自动补充现场名、场景名、输入数据名、输出数据名。

响应示例：

```json
{
  "code": 0,
  "message": "ok",
  "data": {
    "list": [
      {
        "id": 31,
        "siteId": 1,
        "siteName": "A 线",
        "sceneId": 1,
        "sceneName": "仓库",
        "taskType": "generate_3d",
        "taskTitle": "仓库3D生成任务",
        "sourceDataId": 13,
        "sourceDataName": "仓库点云数据-01",
        "targetDataId": 15,
        "targetDataName": "仓库3D数据-01",
        "status": "running",
        "progress": 45,
        "errorCode": null,
        "errorMessage": null,
        "operatorId": "demo-user",
        "operatorName": "演示用户",
        "createdAt": "2026-03-26T01:00:00.000Z",
        "startedAt": "2026-03-26T01:00:00.000Z",
        "finishedAt": null,
        "updatedAt": "2026-03-26T01:00:00.000Z"
      }
    ],
    "page": 1,
    "pageSize": 20,
    "total": 4
  }
}
```

### 7.8 获取原始数据上传可选项

```http
GET /api/v1/data-assets/upload-options
```

说明：

- 当前用于“上传原始数据”弹窗。
- 返回所有现场，以及每个现场下属的场景列表。
- 当前不接收请求参数。

成功响应示例：

```json
{
  "code": 0,
  "message": "ok",
  "data": {
    "sites": [
      {
        "id": 2,
        "siteCode": "site-a",
        "siteName": "A 线",
        "scenes": [
          {
            "id": 2,
            "sceneCode": "warehouse",
            "sceneName": "仓库"
          }
        ]
      }
    ]
  }
}
```

### 7.9 上传原始数据

```http
POST /api/v1/data-assets/upload-raw
```

请求类型：

- `multipart/form-data`

表单字段：

| 参数 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| `siteId` | string | 是 | 现场 ID，代码中会转为整数 |
| `sceneId` | string | 是 | 场景 ID，代码中会转为整数 |
| `dataName` | string | 否 | 数据名称；为空时会退回到“原始文件名去掉扩展名” |
| `file` | binary | 是 | 上传文件本体 |

请求体说明：

- 当前实现通过 Fastify multipart 解析表单。
- 当前前端实现建议按 `siteId -> sceneId -> dataName -> file` 的顺序追加字段，`file` 放最后。

业务规则：

- 请求必须是有效的 `multipart/form-data`，否则返回 `400`。
- `file` 必须存在，否则返回 `400`。
- `siteId` 必须是有效整数，否则返回 `400`。
- `sceneId` 必须是有效整数，否则返回 `400`。
- 上传文件名不能为空，否则返回 `400`。
- 现场必须存在，否则返回 `404`。
- 场景必须存在，否则返回 `404`。
- 场景必须属于所选现场，否则返回 `400`。
- `dataName` 为空时，自动使用“原始文件名去掉扩展名”作为数据名。
- 文件会落盘到 `data/uploads/raw/{siteId}/{sceneId}/{原始文件名}`。
- 同一现场/场景目录下如果已存在同名文件，返回 `400`，不会覆盖旧文件。
- 上传成功后会创建：
  - 一条 `DataAsset`
  - 一条 `ProcessTask`
  - 一条 `OperationLog`
- 数据库写入过程使用事务，保证数据资产、任务、资产回写、操作日志要么一起成功，要么一起失败。
- 如果文件已经写盘，但后续数据库事务失败，服务端会删除刚写入的文件，避免留下脏文件。

成功响应示例：

```json
{
  "code": 0,
  "message": "ok",
  "data": {
    "assetId": 14,
    "taskId": 12,
    "dataName": "absolute-path-check",
    "fileName": "absolute-path-check-20260401.txt",
    "fileSize": 19,
    "storagePath": "data/uploads/raw/2/2/absolute-path-check-20260401.txt",
    "absolutePath": "D:\\docker-images\\gaussian\\backend-demo\\data\\uploads\\raw\\2\\2\\absolute-path-check-20260401.txt",
    "status": "ready"
  }
}
```

错误响应示例 1：现场参数非法

```json
{
  "code": 400,
  "message": "invalid site id",
  "data": {
    "path": "/api/v1/data-assets/upload-raw",
    "timestamp": "2026-04-01T09:30:00.000Z"
  }
}
```

错误响应示例 2：同名文件已存在

```json
{
  "code": 400,
  "message": "file already exists in target directory",
  "data": {
    "path": "/api/v1/data-assets/upload-raw",
    "timestamp": "2026-04-01T09:31:00.000Z"
  }
}
```

### 7.10 从原始数据创建点云生成任务

```http
POST /api/v1/data-assets/{id}/generate-point-cloud
```

路径参数：

| 参数 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| `id` | string | 是 | 数据资产 ID，代码中会转为整数 |

请求体：

- 当前实现不接收请求体。

业务规则：

- `id` 必须是有效整数，否则返回 `400`。
- 源数据必须存在，否则返回 `404`。
- 源数据 `dataType` 必须为 `RAW`，否则返回 `400`。
- 源数据状态不能是 `DELETED`，否则返回 `400`。
- 创建过程中使用数据库事务，保证任务、目标资产、源资产回写、操作日志要么一起成功，要么一起失败。

成功响应示例：

```json
{
  "code": 0,
  "message": "ok",
  "data": {
    "taskId": 42,
    "targetDataId": 43,
    "status": "queued"
  }
}
```

错误响应示例 1：路径参数非法

```json
{
  "code": 400,
  "message": "invalid data asset id",
  "data": {
    "path": "/api/v1/data-assets/abc/generate-point-cloud",
    "timestamp": "2026-03-27T05:20:00.000Z"
  }
}
```

错误响应示例 2：数据类型不支持

```json
{
  "code": 400,
  "message": "only raw data can generate point cloud",
  "data": {
    "path": "/api/v1/data-assets/13/generate-point-cloud",
    "timestamp": "2026-03-27T05:21:00.000Z"
  }
}
```

## 8. 轮询与刷新建议

基于当前接口实现，前端可按下面方式刷新：

- 总览页轮询 `GET /api/v1/dashboard/data-summary`
- 数据列表页轮询 `GET /api/v1/data-assets`
- 任务列表页轮询 `GET /api/v1/tasks`
- 原始数据上传成功后，建议立即刷新：
  - `GET /api/v1/data-assets`
  - `GET /api/v1/tasks`
  - `GET /api/v1/dashboard/data-summary`
- 点云任务创建成功后，建议立即刷新：
  - `GET /api/v1/data-assets`
  - `GET /api/v1/tasks`
  - `GET /api/v1/dashboard/data-summary`

## 9. 当前实现限制

- 当前没有鉴权、用户体系、权限控制。
- 当前没有请求级 `requestId`。
- `siteId`、`sceneId` 查询参数没有显式的数值合法性校验，建议前端始终传正整数。
- `dashboard/data-summary` 同时承载数据和任务统计，后续如页面拆分，建议再拆独立接口。
- 树视图和关系图都基于 `sourceDataId` 推导，没有单独的关系表。

## 10. 建议的后续补充

- 增加数据详情、编辑、删除、下载等接口。
- 增加首页任务列表和最近操作接口，和 UI 初稿保持一致。
- 增加 `generate-2d`、`generate-3d`、`generate-gaussian` 接口。
- 为列表筛选增加更严格的参数校验和业务错误码体系。
- 为统一响应增加 `requestId`，便于日志排查和联调。
