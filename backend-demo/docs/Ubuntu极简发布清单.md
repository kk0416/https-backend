# Ubuntu 极简发布清单

## 1. 能访问 SWR 和 CCE 时

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

kubectl get deployment gaussian-backend-v1-gaussian-backend-demo \
  -n roboshop \
  -o jsonpath="{.spec.template.spec.containers[0].image}"
echo

kubectl get deploy,svc,ingress,pods,pvc -n roboshop | grep gaussian

curl -vk https://sep-gaussian-backend.cloud-data-dev.seer-group.com/health
curl -vk https://sep-gaussian-backend.cloud-data-dev.seer-group.com/api/v1/health
curl -vk https://sep-gaussian-backend.cloud-data-dev.seer-group.com/api/v1/dashboard/data-summary
```

## 1.1 只记一件事

```bash
docker buildx build --platform linux/amd64 --provenance=false --sbom=false -t ${IMAGE_REPO}:${TAG} --push .
helm upgrade --install gaussian-backend-v1 ./helm -n roboshop --create-namespace -f ./helm/values-production.yaml --set image.tag=${TAG}
kubectl rollout status deployment/gaussian-backend-v1-gaussian-backend-demo -n roboshop --timeout=180s
```

## 2. 只能访问 SWR 时

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
```

## 3. 回到能访问 CCE 的机器后

```bash
cd /path/to/backend-demo

export TAG=0.1.1

helm upgrade --install gaussian-backend-v1 ./helm \
  -n roboshop \
  --create-namespace \
  -f ./helm/values-production.yaml \
  --set image.tag=${TAG}

kubectl rollout status deployment/gaussian-backend-v1-gaussian-backend-demo \
  -n roboshop \
  --timeout=180s

kubectl get deployment gaussian-backend-v1-gaussian-backend-demo \
  -n roboshop \
  -o jsonpath="{.spec.template.spec.containers[0].image}"
echo

kubectl get deploy,svc,ingress,pods,pvc -n roboshop | grep gaussian

curl -vk https://sep-gaussian-backend.cloud-data-dev.seer-group.com/health
curl -vk https://sep-gaussian-backend.cloud-data-dev.seer-group.com/api/v1/health
curl -vk https://sep-gaussian-backend.cloud-data-dev.seer-group.com/api/v1/dashboard/data-summary
```

## 4. buildx 之后固定要做的事

```bash
helm upgrade --install gaussian-backend-v1 ./helm \
  -n roboshop \
  --create-namespace \
  -f ./helm/values-production.yaml \
  --set image.tag=${TAG}

kubectl rollout status deployment/gaussian-backend-v1-gaussian-backend-demo \
  -n roboshop \
  --timeout=180s

kubectl get pods -n roboshop | grep gaussian

kubectl get deployment gaussian-backend-v1-gaussian-backend-demo \
  -n roboshop \
  -o jsonpath="{.spec.template.spec.containers[0].image}"
echo

curl -vk https://sep-gaussian-backend.cloud-data-dev.seer-group.com/health
curl -vk https://sep-gaussian-backend.cloud-data-dev.seer-group.com/api/v1/health
```
