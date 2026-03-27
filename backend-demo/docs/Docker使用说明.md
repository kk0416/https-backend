# Docker 使用说明

## 1. 文档目的

1. 说明当前 `gaussian-backend-demo` 的 Docker 运行方式。
2. 说明它如何向参考项目的 URL、端口、证书和入口脚本风格对齐。
3. 说明本地 Docker 联调时的数据目录、证书目录和验证方法。

## 2. 当前新增文件

1. `Dockerfile`
2. `.dockerignore`
3. `docker-compose.yml`
4. `scripts/entrypoint.sh`

## 3. 当前 Docker 运行模型

### 3.1 端口约定

1. 容器内部统一监听 `8443`
2. `docker-compose.yml` 默认映射为宿主机 `8443 -> 容器 8443`
3. 这个端口模型是为了和参考项目保持一致，后续也更容易对接华为云

### 3.2 环境变量约定

容器内默认使用：

1. `DATABASE_URL=file:./data/roboshop.db`
2. `SERVER_HOST=0.0.0.0`
3. `SERVER_PORT=8443`
4. `SSL_CERT_FILE=/app/certs/server.crt`
5. `SSL_KEY_FILE=/app/certs/server.key`

### 3.3 入口脚本行为

容器启动时会执行 `scripts/entrypoint.sh`，它会做这几件事：

1. 检查 `server.crt` 和 `server.key` 是否存在
2. 如果不存在，就自动生成一套自签名证书
3. 执行 `npx prisma migrate deploy`
4. 最后启动 `node dist/main.js`

### 3.4 数据目录与证书目录

`docker-compose.yml` 默认挂载：

1. `./data -> /app/data`
2. `./certs -> /app/certs`

这样做的目的：

1. SQLite 数据文件可以持久化
2. 自动生成的 `server.crt` / `server.key` 不会随着容器删除而丢失

## 4. 如何启动

### 4.1 进入项目目录

```powershell
cd D:\docker-images\gaussian\backend-demo
```

### 4.2 构建并启动

```powershell
docker compose up --build -d
```

### 4.3 查看日志

```powershell
docker compose logs -f
```

## 5. 如何停止

### 5.1 停止并保留容器

```powershell
docker compose stop
```

### 5.2 停止并删除容器

```powershell
docker compose down
```

## 6. 如何验证

### 6.1 健康检查

```text
https://127.0.0.1:8443/health
```

### 6.2 业务健康检查

```text
https://127.0.0.1:8443/api/v1/health
```

### 6.3 其他接口

1. `https://127.0.0.1:8443/api/v1/dashboard/data-summary`
2. `https://127.0.0.1:8443/api/v1/data-assets`
3. `https://127.0.0.1:8443/api/v1/data-assets/tree`
4. `https://127.0.0.1:8443/api/v1/data-assets/graph`
5. `https://127.0.0.1:8443/api/v1/tasks`

## 7. 当前与参考项目的对齐点

1. 统一使用 `SERVER_HOST`、`SERVER_PORT`
2. 统一使用 `SSL_CERT_FILE`、`SSL_KEY_FILE`
3. 统一由入口脚本负责证书准备和启动
4. 统一将容器内部 HTTPS 端口收口到 `8443`

## 8. 当前限制

### 8.1 还没有补 Helm / CCE 文件

当前这一步只完成 Docker 运行骨架，还没有开始补：

1. `helm/Chart.yaml`
2. `helm/templates/deployment.yaml`
3. `helm/templates/service.yaml`
4. `helm/templates/ingress.yaml`

### 8.2 空数据卷不会自动写入演示数据

当前入口脚本会自动执行 migration，但不会自动覆盖已有数据。

如果你挂载了一个全新的空数据目录，并且希望补演示数据，可以进入容器后手工执行：

```powershell
docker compose exec gaussian-backend-demo npx tsx scripts/seed.ts
```

说明：

1. 这条命令会清空当前库里的数据，再重新写入演示数据
2. 适合本地演示环境，不适合正式生产数据

## 9. 本次验证结果

1. `docker compose config` 已通过
2. `docker compose build` 已通过
3. 容器已成功启动
4. 已实测返回 `200`：
   1. `https://127.0.0.1:8443/health`
   2. `https://127.0.0.1:8443/api/v1/health`
5. 验证完成后，临时容器已经执行 `docker compose down`
