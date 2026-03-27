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

## 当前已具备能力

1. 可以运行最小 NestJS 服务。
2. 已具备 `GET /api/v1/health` 健康检查接口。
3. 已生成 Prisma Client。
4. 已创建 SQLite 数据库文件 `data/roboshop.db`。
5. 已落地第一版数据库结构。
6. 已具备统一响应结构与全局异常处理。
7. 已具备核心业务模块骨架。
8. 已实现第一批实际业务接口。
9. 接口代码已补充面向 TypeScript 初学者的详细注释。
10. 已写入演示数据，可直接用于联调。
11. 关键接口已经完成本地实测。

## 常用命令

```bash
npm run start:dev
```

```bash
npm run db:seed
```

## 使用说明

1. 详细使用说明见：[使用说明](D:/docker-images/gaussian/backend-demo/docs/使用说明.md)
2. `VS Code` 配置已放在 `.vscode` 目录下，可直接使用任务和调试入口
3. 代码入口与调用流程见：[代码入口与调用流程](D:/docker-images/gaussian/backend-demo/docs/代码入口与调用流程.md)

## 当前接口

1. `GET /api/v1/health`
2. `GET /api/v1/dashboard/data-summary`
3. `GET /api/v1/data-assets`
4. `GET /api/v1/data-assets/tree`
5. `GET /api/v1/data-assets/graph`
6. `GET /api/v1/tasks`
7. `POST /api/v1/data-assets/:id/generate-point-cloud`
