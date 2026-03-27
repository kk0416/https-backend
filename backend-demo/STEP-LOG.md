# 后端 Demo 步骤记录

## 项目说明

1. 本目录用于存放高斯建图项目的后端 Demo。
2. 开发方式采用逐步确认模式。
3. 每完成一步，都先记录到本文档，再等待用户确认进入下一步。

## 步骤 2.1 创建项目骨架

### 状态

已完成。

### 本步操作

1. 创建了后端 Demo 根目录 `backend-demo`。
2. 创建了基础目录：`src`、`prisma`、`data`、`docs`。
3. 创建了步骤记录文件和项目说明文件。
4. 当前尚未开始初始化 NestJS、Fastify、Prisma 或 SQLite。

### 当前目录结构

1. `src`
2. `prisma`
3. `data`
4. `docs`
5. `README.md`
6. `STEP-LOG.md`

## 步骤 2.2 初始化 Node、TypeScript、NestJS、Fastify

### 状态

已完成。

### 环境确认

1. `Node.js` 版本：`v24.14.0`
2. `npm` 版本：`11.9.0`

### 本步操作

1. 创建了 `package.json`。
2. 创建了 `tsconfig.json` 和 `tsconfig.build.json`。
3. 创建了 `.gitignore`。
4. 创建了最小入口文件 `src/main.ts`。
5. 创建了最小模块文件 `src/app.module.ts`。
6. 安装了 `NestJS`、`Fastify`、`TypeScript` 所需基础依赖。
7. 添加了基础健康检查接口 `GET /health`。
8. 修正了 `TypeScript 6` 下的配置兼容问题，补充了 `rootDir`，并将模块解析调整为 `Node16`。
9. 已执行 `npm run build`，确认当前骨架可以正常编译。

### 当前可运行能力

1. 可以通过 `npm run start:dev` 启动开发服务。
2. 可以通过 `GET /health` 验证服务是否正常启动。
3. 当前仍未接入 `Prisma`、`SQLite` 和业务模块。

### 下一步

1. 步骤 2.3：接入 `Prisma + SQLite`。
2. 按已确认的 `方案 A` 建立 5 张核心表模型。
3. 等待用户确认后再执行。

## 步骤 2.3 接入 Prisma、SQLite 与首个迁移

### 状态

已完成。

### 本步操作

1. 安装了 `@prisma/client`、`prisma` 和 `dotenv`。
2. 创建了环境配置文件 `.env`。
3. 创建了 `prisma/schema.prisma`。
4. 创建了 `prisma.config.ts`，用于适配 `Prisma 7` 的新配置方式。
5. 按已确认的 `方案 A` 建立了 `5` 张核心表模型：
   1. `Site`
   2. `Scene`
   3. `DataAsset`
   4. `ProcessTask`
   5. `OperationLog`
6. 按当前方案保留了 `sourceDataId` 单来源关系。
7. 未增加 `dataRelation` 表。
8. 未单独建设 `dataType` 字典表。
9. 已执行 `npx prisma generate`，成功生成 Prisma Client。
10. 已执行 `npx prisma migrate dev --name init_plan_a`，成功生成并应用首个迁移。

### 生成产物

1. Prisma 配置文件：`prisma.config.ts`
2. Prisma 模型文件：`prisma/schema.prisma`
3. 迁移目录：`prisma/migrations`
4. SQLite 数据库文件：`data/roboshop.db`

### 兼容性修正

1. 当前环境使用的是 `Prisma 7`。
2. `Prisma 7` 不再允许在 `schema.prisma` 的 `datasource` 中直接写 `url`。
3. 因此本项目改为通过 `prisma.config.ts` 管理数据库连接配置。

### 当前可运行能力

1. 项目已经具备 NestJS 运行骨架。
2. 项目已经接入 Prisma Client。
3. SQLite 数据库已经创建完成。
4. 第一版数据库结构已经通过 migration 落库。

### 下一步

1. 步骤 2.4：搭建公共层与项目基础结构。
2. 补充统一响应结构、异常处理和 PrismaService。
3. 等待用户确认后再执行。

## 步骤 2.4 搭建公共层与项目基础结构

### 状态

已完成。

### 本步操作

1. 创建了公共目录：
   1. `src/common/filters`
   2. `src/common/interceptors`
   3. `src/common/dto`
   4. `src/prisma`
2. 新增统一响应结构文件：`src/common/dto/api-response.ts`
3. 新增全局异常过滤器：`src/common/filters/all-exceptions.filter.ts`
4. 新增 `PrismaService`：`src/prisma/prisma.service.ts`
5. 新增 `PrismaModule`：`src/prisma/prisma.module.ts`
6. 调整了 `AppModule`，将 `PrismaModule` 接入应用
7. 调整了 `main.ts`
   1. 增加全局前缀：`/api/v1`
   2. 增加全局异常过滤器
   3. 健康检查接口地址更新为 `GET /api/v1/health`
8. 已执行 `npm run build`，确认当前基础结构可以正常编译

### 当前可运行能力

1. 已具备统一响应结构
2. 已具备全局异常处理
3. 已具备 Prisma 的全局注入能力
4. 已具备统一的接口前缀规范

### 下一步

1. 步骤 2.5：实现核心模块
2. 先建立 `dashboard`、`data-asset`、`process-task`、`operation-log` 等模块骨架
3. 等待用户确认后再执行

## 步骤 2.5 实现核心模块

### 状态

已完成。

### 本步操作

1. 新建了业务模块目录：`src/modules`
2. 创建了 `auth` 模块骨架
3. 创建了 `dashboard` 模块骨架
4. 创建了 `data-asset` 模块骨架
5. 创建了 `process-task` 模块骨架
6. 创建了 `operation-log` 模块骨架
7. 为每个模块补充了 `module`、`controller`、`service` 基础文件
8. 将以上模块接入了 `AppModule`
9. 已执行 `npm run build`，确认当前模块骨架可以正常编译

### 当前边界

1. 当前只完成了模块结构和最小占位
2. 还没有开始实现数据库查询
3. 还没有开始实现实际业务接口
4. 这是为了先把工程结构稳定下来，再进入接口开发

### 下一步

1. 步骤 2.6：实现第一批接口
2. 优先实现：
   1. `GET /api/v1/dashboard/data-summary`
   2. `GET /api/v1/data-assets`
   3. `GET /api/v1/tasks`
   4. `POST /api/v1/data-assets/:id/generate-point-cloud`
   5. `GET /api/v1/data-assets/tree`
   6. `GET /api/v1/data-assets/graph`
3. 等待用户确认后再执行

## 步骤 2.6 实现第一批接口

### 状态

已完成。

### 本步范围调整

1. 按当前确认结果，先不做用户管理相关内容。
2. 因此本步未实现登录接口。
3. 本步只实现和当前页面直接相关的业务接口。

### 已实现接口

1. `GET /api/v1/dashboard/data-summary`
2. `GET /api/v1/data-assets`
3. `GET /api/v1/data-assets/tree`
4. `GET /api/v1/data-assets/graph`
5. `GET /api/v1/tasks`
6. `POST /api/v1/data-assets/:id/generate-point-cloud`

### 本步实现内容

1. 为 `dashboard` 模块补充了总览查询逻辑
2. 为 `data-asset` 模块补充了：
   1. 列表查询
   2. 树状图数据
   3. 关系图数据
   4. 生成点云任务
3. 为 `process-task` 模块补充了任务列表查询
4. 生成点云接口已联动：
   1. 创建任务
   2. 创建目标点云数据
   3. 更新源数据的当前任务
   4. 写入操作日志
5. 已为关键控制器和服务添加详细注释，目标读者是第一次接触 TypeScript 的 Qt 开发者
6. 已执行 `npm run build`，确认当前接口实现可以正常编译

### 当前说明

1. 当前数据库里还没有示例数据，因此列表接口暂时可能返回空结果
2. `generate-point-cloud` 依赖源数据存在，且源数据类型必须是 `RAW`
3. 下一步需要补示例数据，方便直接联调

### 下一步

1. 步骤 2.7：添加示例数据
2. 生成 `site`、`scene`、`dataAsset`、`processTask`、`operationLog` 的演示数据
3. 让树状图、关系图、任务列表接口可以直接看到结果
4. 等待用户确认后再执行

## 步骤 2.7 添加示例数据

### 状态

已完成。

### 本步操作

1. 新增了 seed 脚本：`scripts/seed.ts`
2. 在 `package.json` 中增加了命令：`npm run db:seed`
3. 写入了一组最小但完整的演示数据，覆盖：
   1. `site`
   2. `scene`
   3. `dataAsset`
   4. `processTask`
   5. `operationLog`
4. 演示数据中包含以下链路：
   1. 原始数据
   2. 点云数据
   3. 高斯数据
   4. 2D 数据
   5. 3D 数据
5. 树状图和关系图可通过 `sourceDataId` 直接看到父子关系
6. 任务列表中包含：
   1. 上传成功任务
   2. 点云生成成功任务
   3. 高斯生成成功任务
   4. 3D 生成中任务

### 额外修正

1. 在执行 seed 时发现 `Prisma 7` 运行时要求显式传入 `adapter`
2. 因此本步额外引入了官方 SQLite 适配器：`@prisma/adapter-better-sqlite3`
3. 新增了共享配置文件：`src/prisma/prisma-client-options.ts`
4. `PrismaService` 和 `seed.ts` 现在都共用同一套 Prisma 初始化方式

### 验证结果

已验证写入后的表记录数量如下：

1. `site`: `1`
2. `scene`: `1`
3. `dataAsset`: `5`
4. `processTask`: `4`
5. `operationLog`: `4`

### 下一步

1. 步骤 2.8：本地验证并补使用说明
2. 启动服务并验证关键接口
3. 将启动方式、接口说明、seed 使用方式写入文档
4. 等待用户确认后再执行

## 步骤 2.8 本地验证并补使用说明

### 状态

已完成。

### 本步操作

1. 使用构建产物启动了本地服务
2. 实测了关键接口：
   1. `GET /api/v1/health`
   2. `GET /api/v1/dashboard/data-summary`
   3. `GET /api/v1/data-assets`
   4. `GET /api/v1/data-assets/tree`
   5. `GET /api/v1/data-assets/graph`
   6. `GET /api/v1/tasks`
   7. `POST /api/v1/data-assets/:id/generate-point-cloud`
3. `generate-point-cloud` 实测成功创建：
   1. 新任务
   2. 新目标点云数据
4. 为了保持 demo 状态可复现，验证完成后重新执行了一次 `npm run db:seed`
5. 新增了使用说明文档：`docs/使用说明.md`
6. 更新了 `README.md`

### 本地验证结果

1. `health` 返回状态：`running`
2. 总览统计结果：
   1. `rawCount = 1`
   2. `pointCloudCount = 1`
   3. `gaussianCount = 1`
   4. `map2dCount = 1`
   5. `map3dCount = 1`
   6. `totalTaskCount = 4`
   7. `runningTaskCount = 1`
3. 数据列表总数：`5`
4. 树状图根节点数：`1`
5. 关系图节点数：`5`
6. 关系图边数：`4`
7. 任务列表总数：`4`

### 当前结论

1. 后端 Demo 已可本地运行
2. 第一批接口已可直接联调
3. SQLite 演示数据已可直接用于树状图、关系图和任务列表演示
4. 当前版本适合继续对接前端页面

## 补充：VS Code 开发配置

### 状态

已完成。

### 本步操作

1. 新增 `.vscode/tasks.json`
2. 新增 `.vscode/launch.json`
3. 新增 `.vscode/extensions.json`
4. 在使用说明中补充了 IDE 推荐和 VS Code 使用方式

### 当前可直接使用的 VS Code 任务

1. `seed-db`
2. `build-backend`
3. `start-dev-server`

### 当前可直接使用的 VS Code 调试配置

1. `Debug Backend (tsx)`
2. `Run Built Backend`
