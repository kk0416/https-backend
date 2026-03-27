# Helm 与华为云部署说明

## 1. 文档目的

1. 说明当前 `gaussian-backend-demo` 如何对齐参考项目的 Helm / 华为云 CCE 部署方式。
2. 说明当前 chart 文件分别负责什么。
3. 说明 SQLite 版本在云上部署时必须注意的限制。

## 2. 当前新增目录

当前已新增 `helm` 目录，包含：

1. `helm/Chart.yaml`
2. `helm/values.yaml`
3. `helm/values-production.yaml`
4. `helm/templates/_helpers.tpl`
5. `helm/templates/configmap.yaml`
6. `helm/templates/deployment.yaml`
7. `helm/templates/service.yaml`
8. `helm/templates/ingress.yaml`
9. `helm/templates/pvc.yaml`
10. `helm/templates/hpa.yaml`
11. `helm/templates/pdb.yaml`

## 3. 当前和参考项目的主要对齐点

### 3.1 端口模型

当前已经对齐为：

1. Pod 内部 HTTPS 端口：`8443`
2. Service 端口：`8443`
3. Ingress 外部监听端口：`443`

也就是：

`公网 443 -> Ingress -> Service 8443 -> Pod 8443`

### 3.2 环境变量模型

当前 chart 会通过 `ConfigMap` 下发：

1. `DATABASE_URL`
2. `SERVER_HOST`
3. `SERVER_PORT`
4. `SSL_CERT_FILE`
5. `SSL_KEY_FILE`

### 3.3 探针模型

当前 `Deployment` 中的启动探针、存活探针、就绪探针都使用：

1. 协议：`HTTPS`
2. 路径：`/health`

这样可以直接复用当前已经补好的裸路径健康检查接口。

### 3.4 证书模型

当前 chart 支持两种方式：

1. 不传后端证书 Secret，容器启动时自动生成自签名证书
2. 通过 `tls.existingSecret` 挂载正式 `server.crt` / `server.key`

前端 Ingress 证书仍由 `ingress.tls[].secretName` 管理。

## 4. 当前和参考项目的关键区别

### 4.1 当前项目使用 SQLite

这是和参考项目最大的区别。

因此当前 chart 默认设计成：

1. `replicaCount = 1`
2. `autoscaling.enabled = false`
3. `persistence.enabled = true`
4. 生产环境推荐 `persistence.storageClassName = csi-disk-topology`

原因：

1. SQLite 是单文件数据库
2. 如果没有持久化卷，Pod 被重建后数据库文件会丢失
3. 如果盲目扩成多副本，会带来文件锁和一致性风险

### 4.2 当前不建议把 SQLite 版本直接扩成多副本

如果后面需要：

1. 多副本
2. 自动扩缩容
3. 更稳的生产高可用

建议下一阶段把数据库切到 MySQL / PostgreSQL，再打开 HPA 和更高副本数。

## 5. `values.yaml` 里最重要的字段

### 5.1 镜像

1. `image.repository`
2. `image.tag`
3. `image.pullPolicy`

### 5.2 服务与端口

1. `service.type`
2. `service.port`
3. `service.targetPort`

### 5.3 业务运行配置

1. `server.host`
2. `server.port`
3. `database.url`

### 5.4 后端 HTTPS 证书

1. `tls.certFile`
2. `tls.keyFile`
3. `tls.existingSecret`

### 5.5 数据持久化

1. `persistence.enabled`
2. `persistence.existingClaim`
3. `persistence.storageClassName`
4. `persistence.size`

### 5.6 Ingress 与公网地址

1. `ingress.enabled`
2. `ingress.className`
3. `ingress.publicUrl`
4. `ingress.annotations`
5. `ingress.tls`

## 6. 华为云 CCE 部署前需要改哪些值

至少要确认并修改：

1. `image.repository`
2. `image.tag`
3. `imagePullSecrets`
4. `ingress.publicUrl`
5. `ingress.annotations.kubernetes.io/elb.id`
6. `ingress.tls[0].secretName`
7. `ingress.tls[0].hosts`
8. `persistence.storageClassName` 或 `persistence.existingClaim`

## 7. 当前推荐部署命令

### 7.1 本地静态检查

```powershell
helm lint .\helm
helm template gaussian-backend-v1 .\helm -n roboshop
```

### 7.2 使用生产覆盖值渲染

```powershell
helm template gaussian-backend-v1 .\helm -n roboshop -f .\helm\values-production.yaml
```

### 7.3 打包 chart

```powershell
helm package .\helm -d .
```

## 8. 华为云部署时的推荐关系

### 8.1 Ingress 前端证书

浏览器访问域名时看到的证书，建议放在：

1. `ingress.tls[].secretName`

### 8.2 后端服务证书

Pod 内部应用监听 `8443` 时使用的证书，建议两种方式二选一：

1. 测试阶段继续让容器自动生成
2. 正式环境使用 `tls.existingSecret`

### 8.3 数据卷

SQLite 文件建议必须放到 PVC 上。

否则：

1. Pod 重建可能丢数据
2. 发版滚动更新后数据库状态不可控

## 9. 当前验证结果

1. `helm lint .\helm` 已通过
2. `helm template gaussian-backend-v1 .\helm -n roboshop` 已通过
3. 当前验证是本地静态验证，不是实际集群部署验证
4. 华为云发布命令见：[华为云发布命令](D:/docker-images/gaussian/backend-demo/docs/华为云发布命令.md)

## 10. 下一阶段建议

### 10.1 如果继续保持 SQLite

建议：

1. 继续单副本
2. 明确 PVC
3. 当前集群优先使用 `csi-disk-topology`
3. 不开启 HPA

### 10.2 如果准备上正式生产

建议：

1. 将数据库迁移到 MySQL
2. 再考虑多副本
3. 再开启 HPA / PDB / 更高可用策略
