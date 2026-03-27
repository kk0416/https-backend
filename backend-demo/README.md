# 后端 Demo

## 当前状态

1. 已完成步骤 2.1：创建项目骨架。
2. 已完成步骤 2.2：初始化 `Node.js`、`TypeScript`、`NestJS`、`Fastify`。
3. 已完成最小编译验证，当前骨架可以正常构建。
4. 已完成步骤 2.3：接入 `Prisma + SQLite`，并完成首个 migration。
5. 已完成步骤 2.4：搭建公共层与项目基础结构。
6. 已完成步骤 2.5：建立核心业务模块骨架。
7. 已完成步骤 2.6：实现第一批业务接口。
8. 已完成步骤 2.7：写入演示数据。
9. 已完成步骤 2.8：本地验证并补使用说明。
10. 已完成步骤 3.1：启动配置对齐参考项目。
11. 已完成步骤 3.2：补齐 Docker 运行骨架并完成容器验证。

## 当前已具备能力

1. 可以运行最小 NestJS 服务。
2. 已具备 `GET /api/v1/health` 与 `GET /health` 两个健康检查接口。
3. 已生成 Prisma Client。
4. 已创建 SQLite 数据库文件 `data/roboshop.db`。
5. 已落地第一版数据库结构。
6. 已具备统一响应结构与全局异常处理。
7. 已具备核心业务模块骨架。
8. 已实现第一批实际业务接口。
9. 接口代码已补充面向 TypeScript 初学者的详细注释。
10. 已写入演示数据，可直接用于联调。
11. 关键接口已经完成本地实测。
12. 已具备 Docker 运行文件：`Dockerfile`、`docker-compose.yml`、`entrypoint.sh`
13. Docker 容器内已实测通过 `HTTPS + Prisma migrate + health` 启动链路。

## 常用命令

```bash
npm run start:dev
```

```bash
npm run db:seed
```

## 使用说明

1. 详细使用说明见：[使用说明](D:/docker-images/gaussian/backend-demo/docs/使用说明.md)
2. HTTPS 接口协议见：[Qt 后端 HTTPS API 协议文档（当前项目实现版）](D:/docker-images/gaussian/backend-demo/docs/Qt 后端 HTTPS API 协议文档（当前项目实现版）.md)
3. 数据库结构说明见：[数据库表介绍文档](D:/docker-images/gaussian/backend-demo/docs/数据库表介绍文档.md)
4. Docker 运行说明见：[Docker 使用说明](D:/docker-images/gaussian/backend-demo/docs/Docker使用说明.md)
5. Helm / 华为云部署说明见：[Helm 与华为云部署说明](D:/docker-images/gaussian/backend-demo/docs/Helm与华为云部署说明.md)
6. 华为云发布命令见：[华为云发布命令](D:/docker-images/gaussian/backend-demo/docs/华为云发布命令.md)
7. `VS Code` 配置已放在 `.vscode` 目录下，可直接使用任务和调试入口
8. 代码入口与调用流程见：[代码入口与调用流程](D:/docker-images/gaussian/backend-demo/docs/代码入口与调用流程.md)
9. 当前服务已改为 `HTTPS`
10. 本地 `.env` 示例端口为 `34430`
11. 已兼容参考项目风格的 `SERVER_HOST`、`SERVER_PORT`、`SSL_CERT_FILE`、`SSL_KEY_FILE`
12. 已补齐 Docker 运行骨架
13. 已补齐 Helm / 华为云适配骨架
14. 已补一套可直接参考执行的华为云发布命令
15. 生产域名已收口为 `sep-gaussian-backend.cloud-data-dev.seer-group.com`
16. 生产命名空间已收口为 `roboshop`
17. 生产 StorageClass 已收口为 `csi-disk-topology`
18. Docker / 华为云目标内部端口建议统一为 `8443`

## 当前接口

1. `GET /api/v1/health`
2. `GET /health`
3. `GET /api/v1/dashboard/data-summary`
4. `GET /api/v1/data-assets`
5. `GET /api/v1/data-assets/tree`
6. `GET /api/v1/data-assets/graph`
7. `GET /api/v1/tasks`
8. `POST /api/v1/data-assets/:id/generate-point-cloud`
