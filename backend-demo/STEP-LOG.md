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

## 补充步骤 3.1 启动配置对齐参考项目

### 状态

已完成。

### 本步目标

1. 先不补 Docker 和 Helm
2. 先把启动配置层改成兼容参考项目的部署风格
3. 为后续适配 Docker 和华为云打基础

### 本步操作

1. 调整了 `src/main.ts`
2. 启动时优先读取：
   1. `SERVER_HOST`
   2. `SERVER_PORT`
   3. `SSL_CERT_FILE`
   4. `SSL_KEY_FILE`
3. 保留了旧字段兼容：
   1. `HTTPS_PORT`
   2. `HTTPS_PFX_PATH`
   3. `HTTPS_PFX_PASSPHRASE`
4. 新增了 HTTPS 证书双模式启动逻辑：
   1. 优先 `crt/key`
   2. 回退 `pfx`
5. 新增了兼容探针路径：`GET /health`
6. 保留原有业务健康检查路径：`GET /api/v1/health`
7. 更新了 `.env`
   1. 增加 `SERVER_HOST`
   2. 增加 `SERVER_PORT`
   3. 本地示例端口暂保留为 `34430`
8. 更新了以下文档：
   1. `README.md`
   2. `docs/使用说明.md`
   3. `docs/代码入口与调用流程.md`

### 当前结果

1. 当前项目已经能够识别参考项目风格的服务地址和端口配置
2. 当前项目已经为后续 Docker / 华为云适配准备好 `crt/key` 证书入口
3. 当前本地 Windows 开发方式仍可继续使用 `pfx`

### 下一步建议

1. 先执行本地构建和启动验证
2. 确认 `/health` 与 `/api/v1/health` 都能正常访问
3. 用户确认后，再进入下一步 Docker 骨架补齐

## 步骤 3.2 补齐 Docker 运行骨架

### 状态

已完成。

### 本步目标

1. 让当前项目具备参考项目风格的 Docker 启动方式
2. 暂不补 Helm / 华为云模板
3. 先把本地容器运行所需文件补齐

### 本步操作

1. 新增了 `Dockerfile`
2. 新增了 `.dockerignore`
3. 新增了 `docker-compose.yml`
4. 新增了 `scripts/entrypoint.sh`
5. 新增了 Docker 说明文档：`docs/Docker使用说明.md`
6. 更新了：
   1. `.gitignore`
   2. `README.md`
   3. `docs/使用说明.md`

### 当前 Docker 设计

1. 容器内部统一使用 `8443`
2. 入口脚本会：
   1. 检查或生成 `crt/key`
   2. 执行 `npx prisma migrate deploy`
   3. 启动 `node dist/main.js`
3. `docker-compose.yml` 默认挂载：
   1. `./data:/app/data`
   2. `./certs:/app/certs`

### 当前结果

1. 当前项目已经具备本地 Docker 运行骨架
2. 当前配置方式已经和参考项目的端口、证书、入口脚本风格基本一致
3. 后续可以继续补 Helm / CCE 对接文件

### 本地验证结果

1. `docker compose config` 已通过
2. `docker compose build` 已通过
3. 容器可以成功启动
4. 已实测返回 `200`：
   1. `GET /health`
   2. `GET /api/v1/health`
5. 验证完成后已执行 `docker compose down`，没有持续占用 `8443`

### 下一步建议

1. 下一步进入 Helm / 华为云适配
2. 需要补 `helm/Chart.yaml` 与 `helm/templates/*`
3. 目标是继续对齐参考项目的 `Service + Ingress + publicUrl + 443 -> 8443` 模型

## 步骤 3.3 补齐 Helm / 华为云适配骨架

### 状态

已完成。

### 本步目标

1. 对齐参考项目的 Helm chart 结构
2. 让当前项目具备 `Service + Ingress + ConfigMap + Deployment` 部署能力
3. 补上 SQLite 场景下必须的持久化卷配置

### 本步操作

1. 新增了 `helm/Chart.yaml`
2. 新增了 `helm/values.yaml`
3. 新增了 `helm/values-production.yaml`
4. 新增了：
   1. `helm/templates/_helpers.tpl`
   2. `helm/templates/configmap.yaml`
   3. `helm/templates/deployment.yaml`
   4. `helm/templates/service.yaml`
   5. `helm/templates/ingress.yaml`
   6. `helm/templates/pvc.yaml`
   7. `helm/templates/hpa.yaml`
   8. `helm/templates/pdb.yaml`
5. 新增了部署文档：`docs/Helm与华为云部署说明.md`
6. 更新了：
   1. `README.md`
   2. `docs/使用说明.md`

### 当前 Helm 设计

1. Pod 内部端口：`8443`
2. Service 端口：`8443`
3. Ingress 前端端口：`443`
4. 探针路径统一使用：`/health`
5. 通过 `ConfigMap` 下发：
   1. `DATABASE_URL`
   2. `SERVER_HOST`
   3. `SERVER_PORT`
   4. `SSL_CERT_FILE`
   5. `SSL_KEY_FILE`
6. 支持：
   1. Ingress TLS Secret
   2. 后端证书 Secret 挂载
   3. PVC 持久化卷

### SQLite 相关限制

1. 当前默认 `replicaCount = 1`
2. 当前默认 `autoscaling.enabled = false`
3. 当前默认 `persistence.enabled = true`
4. 原因是 SQLite 不适合当前阶段直接多副本

### 本地验证结果

1. `helm lint .\helm` 已通过
2. `helm template gaussian-backend-v1 .\helm -n roboshop` 已通过
3. 当前验证属于静态渲染验证，还没有连接真实 CCE 集群

### 下一步建议

1. 如果要继续云上验证，下一步就需要准备：
   1. `image.repository`
   2. `image.tag`
   3. `imagePullSecrets`
   4. `ingress.publicUrl`
   5. `kubernetes.io/elb.id`
   6. `ingress TLS Secret`
   7. `PVC / StorageClass`
2. 如果后面准备多副本部署，建议先把数据库从 SQLite 切到 MySQL

## 步骤 3.4 收口华为云发布参数与命令

### 状态

已完成。

### 本步目标

1. 尽量复用参考项目已经确认过的华为云部署参数
2. 让当前项目具备一套可直接参考执行的发布命令
3. 将仍需人工确认的参数缩减到最少

### 本步操作

1. 在 `helm/values.yaml` 中写入共享 ELB：
   1. `32bb8857-86a4-475b-b80a-f650ab200a8a`
2. 在 `helm/values-production.yaml` 中写入：
   1. 镜像仓库 `swr.cn-north-4.myhuaweicloud.com/seer_develop/sep-gaussian-backend-demo`
   2. 公网地址 `https://sep-gaussian-backend.cloud-data-dev.seer-group.com/`
   3. 共享 ELB `32bb8857-86a4-475b-b80a-f650ab200a8a`
   4. `default-secret`
   5. `sep-gaussian-backend-ingress-tls`
3. 新增文档：`docs/华为云发布命令.md`
4. 更新了：
   1. `README.md`
   2. `docs/Helm与华为云部署说明.md`
   3. `docs/使用说明.md`

### 当前结果

1. 当前生产覆盖值已经不再包含 ELB ID 占位符
2. 当前已经具备镜像推送、TLS Secret 创建、Helm 安装、部署后检查命令
3. 当前仍需要人工最终确认：
   1. 域名
   2. 命名空间
   3. StorageClass
   4. 是否启用后端证书 Secret

### 下一步建议

1. 如果你提供真实命名空间与域名，我可以继续把发布命令改成最终可执行版
2. 如果你已经有 kubeconfig，也可以继续进入真实 `helm upgrade --install` 部署准备

## 步骤 3.5 收口生产域名与命名空间，并解释后端证书 Secret

### 状态

已完成。

### 本步输入

1. 生产域名：`sep-gaussian-backend.cloud-data-dev.seer-group.com`
2. 命名空间：`roboshop`
3. 集群没有默认 `StorageClass`

### 本步操作

1. 更新了 `helm/values-production.yaml`
   1. 公网地址改为 `https://sep-gaussian-backend.cloud-data-dev.seer-group.com/`
   2. Ingress TLS Secret 改为 `sep-gaussian-backend-ingress-tls`
2. 更新了发布命令文档：
   1. 命名空间统一改为 `roboshop`
   2. 域名统一改为 `sep-gaussian-backend.cloud-data-dev.seer-group.com`
   3. 补充了 “4.4 是什么意思” 的解释
3. 更新了：
   1. `README.md`
   2. `docs/Helm与华为云部署说明.md`

### 当前结果

1. 生产域名和命名空间已经收口
2. 当前仍然缺少最后一个真实基础设施参数：`StorageClass` 名字
3. 我当前建议：
   1. 不启用后端证书 Secret
   2. 先继续让容器自动生成后端证书
   3. 重点保证 Ingress 前端证书 Secret 正确

### 下一步建议

1. 你只要再告诉我 `StorageClass` 名字
2. 我就可以把华为云发布命令整理成最后版本

## 步骤 3.6 收口 StorageClass 并整理最终发布假设

### 状态

已完成。

### 本步输入

用户提供的可用 `StorageClass` 列表中包含：

1. `csi-disk`
2. `csi-disk-topology`
3. `csi-nas`
4. 其他若干类

### 本步决策

当前项目采用：

`csi-disk-topology`

### 选择原因

1. 当前项目是单副本 `SQLite`
2. 更适合块存储，不建议放到对象存储或共享文件系统类上
3. `WaitForFirstConsumer` 更适合 CCE 调度与磁盘绑定

### 本步操作

1. 更新了 `helm/values-production.yaml`
   1. `persistence.storageClassName = csi-disk-topology`
2. 更新了：
   1. `docs/华为云发布命令.md`
   2. `docs/Helm与华为云部署说明.md`
   3. `README.md`

### 当前最终发布假设

1. 命名空间：`roboshop`
2. 域名：`sep-gaussian-backend.cloud-data-dev.seer-group.com`
3. StorageClass：`csi-disk-topology`
4. Ingress TLS Secret：`sep-gaussian-backend-ingress-tls`
5. Image Pull Secret：`default-secret`
6. 后端服务证书：继续由容器自动生成

### 下一步建议

1. 如果 `sep-gaussian-backend-ingress-tls` 还没创建，先创建它
2. 如果 `default-secret` 已存在，就可以直接执行 `helm upgrade --install`

## 步骤 3.7 统一镜像命名为 sep 前缀

### 状态

已完成。

### 本步输入

1. 用户确认：镜像名前缀统一使用 `sep-`

### 本步操作

1. 更新了 `helm/values.yaml`
   1. 默认镜像仓库改为 `sep-gaussian-backend-demo`
2. 更新了 `helm/values-production.yaml`
   1. 生产镜像仓库改为 `swr.cn-north-4.myhuaweicloud.com/seer_develop/sep-gaussian-backend-demo`
3. 更新了 `docs/华为云发布命令.md`
   1. 构建命令改为 `docker build -t sep-gaussian-backend-demo:$tag .`
   2. 打标签命令改为 `docker tag sep-gaussian-backend-demo:$tag ...`
   3. 推送命令改为推送 `sep-gaussian-backend-demo`

### 当前结果

1. 当前项目发布相关镜像配置已经统一到 `sep-` 前缀
2. 后续只要推送同名 tag，Helm 部署就不会继续拉取旧仓库名

### 下一步建议

1. 先确认本地是否已有 `sep-gaussian-backend-demo:0.1.0`
2. 如果没有，就重新构建并推送到 SWR
3. 推送成功后再重启 `Deployment`

## 步骤 3.8 整理接口联调文档

### 状态

已完成。

### 本步目标

1. 把当前已经可用的接口整理成一份前端可直接对照联调的文档
2. 重点面向 `Qt/C++` 开发者
3. 补充统一返回结构、错误结构和 Qt 最小调用方式

### 本步操作

1. 新增文档：`docs/接口联调说明.md`
2. 文档中整理了：
   1. 当前云上联调地址
   2. 统一成功返回结构
   3. 统一错误返回结构
   4. 枚举值格式约定
   5. 当前全部已开放接口
   6. 推荐联调顺序
   7. Qt 最小 GET / POST 调用示例
   8. 当前第一版接口边界
3. 更新了 `docs/使用说明.md`
   1. 增加了接口联调文档入口

### 当前结果

1. 现在已经可以按文档直接开始前端联调
2. Qt 前端可以先按 `QNetworkAccessManager` 方式接入
3. 网页前端也可以按统一 `code/message/data` 结构直接解析

## 步骤 3.9 补数据总览兼容别名路由

### 状态

已完成。

### 本步背景

1. 联调时访问了 `GET /api/v1/data-summary`
2. 当前原始实现只有 `GET /api/v1/dashboard/data-summary`
3. 因此前端拿到 `404 Not Found`

### 本步操作

1. 在 `dashboard` 模块中新增了兼容别名控制器
2. 保留原始标准路由：
   1. `GET /api/v1/dashboard/data-summary`
3. 新增兼容别名路由：
   1. `GET /api/v1/data-summary`
4. 更新了联调文档：
   1. `docs/接口联调说明.md`

### 当前结果

1. 后端代码现在同时兼容两种总览访问方式
2. 前端联调时即使用短路径，也不会再因为路由层级不一致直接报 `404`
