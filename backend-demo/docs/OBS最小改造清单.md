# OBS 最小改造清单

## 1. 改造目标

1. 保留当前 `upload-raw` 接口
2. 保留当前数据库事务写入逻辑
3. 只把文件存储实现从 PVC 改成 OBS

## 2. 必改文件

### 2.1 `src/modules/data-asset/data-asset.service.ts`

当前职责：

1. `uploadRawData()` 总入口
2. `storeUploadedFile()` 把文件写到本地 `/app/data/uploads/raw/...`

改造目标：

1. 保留 `uploadRawData()`
2. 删除或替换 `storeUploadedFile()`
3. 改成调用 OBS 上传服务
4. 继续返回：
   1. `storagePath`
   2. `fileSize`
   3. `fileHash`
   4. 可选 `bucketName`

## 3. 建议新增文件

### 3.1 `src/storage/storage.module.ts`

作用：

1. 把存储能力独立成模块

### 3.2 `src/storage/storage.service.ts`

作用：

1. 封装 OBS 上传逻辑

建议最少提供方法：

1. `uploadRawFile(...)`
2. 后续可再加 `deleteObject(...)`
3. 后续可再加 `getSignedUrl(...)`

## 4. 需要接入的模块文件

### 4.1 `src/app.module.ts`

改造目标：

1. 把新的 `StorageModule` 接进项目
2. 让 `DataAssetService` 能注入存储服务

## 5. Helm 相关文件

### 5.1 `helm/templates/configmap.yaml`

增加非敏感配置：

1. `OBS_BUCKET`
2. `OBS_ENDPOINT`
3. `OBS_REGION`

### 5.2 `helm/templates/deployment.yaml`

改造目标：

1. 挂载或注入 OBS Secret
2. 给容器补环境变量来源

### 5.3 `helm/values.yaml`

建议增加默认配置项：

1. `storage.provider`
2. `storage.obs.bucket`
3. `storage.obs.endpoint`
4. `storage.obs.region`

### 5.4 `helm/values-production.yaml`

填华为云真实 OBS 配置值。

## 6. Secret 相关

### 6.1 建议新增 `helm/templates/secret-storage.yaml`

作用：

存敏感信息：

1. `OBS_ACCESS_KEY_ID`
2. `OBS_SECRET_ACCESS_KEY`

## 7. 文档必改文件

### 7.1 `docs/使用说明.md`

要改的点：

1. 上传原始数据后不再落本地 PVC
2. 改成落 OBS
3. 补充环境变量说明

### 7.2 `docs/接口联调说明.md`

要改的点：

1. 上传返回里的 `storagePath` 语义变化
2. 说明文件实体不再在容器本地目录

### 7.3 `docs/华为云发布命令.md`

要改的点：

1. 部署前需要创建 OBS Secret
2. values 增加 OBS 配置

## 8. 数据库是否必须改

### 8.1 第一版最小改造

可以不改 `prisma/schema.prisma`。

原因：

当前已经有：

1. `storagePath`
2. `fileName`
3. `fileSize`
4. `fileHash`

这四个字段足够先把 OBS 路径存进去。

### 8.2 第二阶段再考虑补字段

如果后面要更规范，可以再补：

1. `storageProvider`
2. `bucketName`
3. `storageUrl`

## 9. 可能不需要改的文件

### 9.1 `src/modules/data-asset/data-asset.controller.ts`

当前上传接口协议已经够用，第一版可以不改。

### 9.2 `src/main.ts`

当前 multipart 已经接好，通常不需要为 OBS 改它。

## 10. 核心改动压缩版

### 10.1 核心代码改动

`data-asset.service.ts + 新 storage 模块`

### 10.2 核心部署改动

`Helm ConfigMap + Secret + values`

### 10.3 核心文档改动

`使用说明 + 接口联调说明 + 华为云发布说明`

## 11. 最小落地顺序建议

1. 先新增 `storage.service.ts`
2. 再改 `data-asset.service.ts`
3. 再补 Helm 配置
4. 再补文档
5. 最后部署验证
