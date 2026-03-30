# Ubuntu 编译并发布到华为云步骤

## 1. 文档目的

1. 记录下次在 `Ubuntu` 上继续发布时的完整步骤。
2. 目标流程是：
   1. 在 `Ubuntu` 准备代码
   2. 做一次本机编译验证
   3. 构建 Docker 镜像
   4. 推送到华为云 `SWR`
   5. 更新华为云 `CCE / Helm`
   6. 验证公网访问

## 2. 当前项目固定参数

### 2.1 项目参数

1. 项目名：`gaussian-backend-demo`
2. Helm release：`gaussian-backend-v1`
3. Kubernetes 命名空间：`roboshop`

### 2.2 镜像参数

1. 镜像仓库：
   `swr.cn-north-4.myhuaweicloud.com/seer_develop/sep-gaussian-backend-demo`
2. 当前镜像前缀固定为：`sep-`

### 2.3 公网地址

1. 域名：
   `sep-gaussian-backend.cloud-data-dev.seer-group.com`
2. 健康检查：
   `https://sep-gaussian-backend.cloud-data-dev.seer-group.com/health`
3. 业务健康检查：
   `https://sep-gaussian-backend.cloud-data-dev.seer-group.com/api/v1/health`

### 2.4 Helm 配置文件

生产覆盖值文件：

`helm/values-production.yaml`

## 3. 先记住一件事

### 3.1 当前项目的推荐发布方式

当前项目已经有多阶段 `Dockerfile`。

所以最推荐的做法不是：

1. 先在宿主机手工编译 `dist`
2. 再把宿主机 `dist` 拷进镜像

而是：

1. 在 `Ubuntu` 上先做一次宿主机编译验证
2. 然后直接用当前 `Dockerfile` 构建镜像
3. 编译过程在 Docker builder 阶段完成
4. 最终镜像自动带上 `dist`

这样更稳，也更接近你现在已经验证通过的发布路径。

### 3.2 为什么不用普通 docker push

之前已经遇到过华为云 `SWR` 对镜像格式兼容的问题。

所以当前推荐固定使用：

`docker buildx build --provenance=false --sbom=false --push`

不要再走：

1. `docker build`
2. `docker tag`
3. `docker push`

这套旧路径在某些情况下会触发：

`Invalid image, fail to parse 'manifest.json'`

## 4. Ubuntu 机器需要的环境

### 4.1 必备软件

1. `git`
2. `nodejs`
3. `npm`
4. `docker`
5. `docker buildx`

### 4.2 如果要在 Ubuntu 直接部署到 CCE

还需要：

1. `kubectl`
2. `helm`
3. 可用的 `kubeconfig`

### 4.3 建议版本

1. `Node.js 24`
2. `Docker` 24+
3. `Helm 3`

## 5. 第一次进入 Ubuntu 后先做的事

### 5.1 进入项目目录

下面用一个示例路径：

```bash
cd ~/work/gaussian/backend-demo
```

如果你的实际路径不是这个，按实际路径替换。

### 5.2 拉取最新代码

如果这个目录是 git 仓库：

```bash
git pull
```

如果不是 git 仓库，而是你手工拷过去的项目目录，就先确认文件完整。

至少要有这些文件：

1. `package.json`
2. `Dockerfile`
3. `helm/values-production.yaml`
4. `src/main.ts`

## 6. 先做一次 Ubuntu 本机编译验证

### 6.1 安装依赖

```bash
npm ci
```

### 6.2 生成 Prisma Client

```bash
npx prisma generate
```

### 6.3 编译 TypeScript

```bash
npm run build
```

### 6.4 编译通过后检查 dist

```bash
ls -la dist
```

### 6.5 这一步的意义

1. 先确认 Ubuntu 本机环境能正常编译
2. 如果这里就失败，说明问题还在代码或依赖层
3. 如果这里通过，再进入 Docker 构建，排障范围会更小

## 7. 确定本次发布版本号

### 7.1 建议方式

每次发布都换一个新 tag，不要长期覆盖同一个 tag。

例如：

```bash
export TAG=0.1.1
```

或者：

```bash
export TAG=2026.03.27.1
```

### 7.2 固定镜像仓库变量

```bash
export IMAGE_REPO=swr.cn-north-4.myhuaweicloud.com/seer_develop/sep-gaussian-backend-demo
```

### 7.3 检查变量

```bash
echo "$TAG"
echo "$IMAGE_REPO"
```

## 8. 登录华为云 SWR

### 8.1 登录方式

去华为云 `SWR` 控制台复制官方生成的 `docker login` 命令。

示例形式一般类似：

```bash
docker login -u <用户名> -p <密码或临时令牌> swr.cn-north-4.myhuaweicloud.com
```

### 8.2 注意事项

1. 不要把登录凭据写进文档
2. 不要把登录凭据贴到群聊或长期保存的日志里
3. 如果凭据已经泄露，及时去华为云控制台轮换

## 9. 在 Ubuntu 上构建并直接推送镜像

### 9.1 当前推荐命令

```bash
docker buildx build \
  --platform linux/amd64 \
  --provenance=false \
  --sbom=false \
  -t ${IMAGE_REPO}:${TAG} \
  --push \
  .
```

### 9.2 这一步会做什么

1. 使用当前项目里的多阶段 `Dockerfile`
2. 在 Docker builder 阶段完成依赖安装、Prisma generate、TypeScript 编译
3. 生成运行镜像
4. 直接推送到华为云 `SWR`

### 9.3 推送成功的关键信号

输出里通常会出现：

1. `pushing layers`
2. `pushing manifest`

## 10. 推送后先确认镜像标签

### 10.1 如果 Ubuntu 机器可以访问集群

先更新 Helm：

```bash
helm upgrade --install gaussian-backend-v1 ./helm \
  -n roboshop \
  --create-namespace \
  -f ./helm/values-production.yaml \
  --set image.tag=${TAG}
```

### 10.2 更新后检查 Deployment 当前镜像

```bash
kubectl get deployment gaussian-backend-v1-gaussian-backend-demo \
  -n roboshop \
  -o jsonpath="{.spec.template.spec.containers[0].image}"
```

期望输出：

```text
swr.cn-north-4.myhuaweicloud.com/seer_develop/sep-gaussian-backend-demo:<你的新TAG>
```

## 11. 如果 Ubuntu 机器不能直连集群

### 11.1 这种情况下的做法

1. 仍然在 Ubuntu 上完成：
   1. `npm ci`
   2. `npx prisma generate`
   3. `npm run build`
   4. `docker buildx build ... --push`
2. 然后回到能访问 `CCE` 的机器上执行：
   1. `helm upgrade --install ... --set image.tag=<新TAG>`
   2. `kubectl get pods`
   3. `curl https://域名/health`

### 11.2 回到可访问集群的机器后执行

```bash
helm upgrade --install gaussian-backend-v1 ./helm \
  -n roboshop \
  --create-namespace \
  -f ./helm/values-production.yaml \
  --set image.tag=<新TAG>
```

## 12. 集群侧验证步骤

### 12.1 看 Deployment 是否更新成功

```bash
kubectl rollout status deployment/gaussian-backend-v1-gaussian-backend-demo \
  -n roboshop \
  --timeout=180s
```

### 12.2 看资源状态

```bash
kubectl get deploy,svc,ingress,pods,pvc -n roboshop | grep gaussian
```

### 12.3 看 Pod 当前镜像

```bash
kubectl get deployment gaussian-backend-v1-gaussian-backend-demo \
  -n roboshop \
  -o jsonpath="{.spec.template.spec.containers[0].image}"
```

### 12.4 如果 Pod 没起来

先看 Pod 名称：

```bash
kubectl get pods -n roboshop | grep gaussian
```

再看事件：

```bash
kubectl describe pod <pod-name> -n roboshop
```

## 13. 公网验证步骤

### 13.1 健康检查

```bash
curl -vk https://sep-gaussian-backend.cloud-data-dev.seer-group.com/health
```

### 13.2 业务健康检查

```bash
curl -vk https://sep-gaussian-backend.cloud-data-dev.seer-group.com/api/v1/health
```

### 13.3 数据总览

```bash
curl -vk https://sep-gaussian-backend.cloud-data-dev.seer-group.com/api/v1/dashboard/data-summary
```

## 14. 一次完整执行时建议顺序

### 14.1 顺序清单

1. 进入 Ubuntu 项目目录
2. `git pull`
3. `npm ci`
4. `npx prisma generate`
5. `npm run build`
6. 设置 `TAG`
7. 登录 `SWR`
8. 执行 `docker buildx build --provenance=false --sbom=false --push`
9. 执行 `helm upgrade --install ... --set image.tag=${TAG}`
10. 执行 `kubectl rollout status`
11. 执行 `curl -vk https://.../health`
12. 执行 `curl -vk https://.../api/v1/health`

## 15. 最小命令模板

### 15.1 如果 Ubuntu 机器同时能访问 SWR 和 CCE

```bash
cd ~/work/gaussian/backend-demo
git pull

npm ci
npx prisma generate
npm run build

export TAG=0.1.1
export IMAGE_REPO=swr.cn-north-4.myhuaweicloud.com/seer_develop/sep-gaussian-backend-demo

docker login swr.cn-north-4.myhuaweicloud.com

docker buildx build \
  --platform linux/amd64 \
  --provenance=false \
  --sbom=false \
  -t ${IMAGE_REPO}:${TAG} \
  --push \
  .

helm upgrade --install gaussian-backend-v1 ./helm \
  -n roboshop \
  --create-namespace \
  -f ./helm/values-production.yaml \
  --set image.tag=${TAG}

kubectl rollout status deployment/gaussian-backend-v1-gaussian-backend-demo \
  -n roboshop \
  --timeout=180s

curl -vk https://sep-gaussian-backend.cloud-data-dev.seer-group.com/health
curl -vk https://sep-gaussian-backend.cloud-data-dev.seer-group.com/api/v1/health
```

## 16. 下次来之前你只需要记住两件事

### 16.1 第一件事

当前项目发布到华为云时，固定优先走：

`docker buildx build --provenance=false --sbom=false --push`

### 16.2 第二件事

推完镜像后，不要只执行 `kubectl rollout restart`。

如果 tag 变了，应该执行：

`helm upgrade --install ... --set image.tag=${TAG}`

因为：

1. `rollout restart` 只会重启 Pod
2. 不会自动修改 Deployment 中的镜像 tag
