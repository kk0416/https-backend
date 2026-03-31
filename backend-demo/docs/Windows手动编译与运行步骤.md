# Windows 手动编译与运行步骤

## 1. 进入项目目录

```powershell
cd D:\docker-images\gaussian\backend-demo
```

## 2. 安装依赖

```powershell
npm ci
```

## 3. 生成 Prisma Client

```powershell
npx prisma generate
```

## 4. 手动编译 TypeScript

```powershell
npm run build
```

## 5. 检查编译产物

```powershell
dir .\dist
```

## 6. 运行编译后的程序

```powershell
node .\dist\main.js
```

## 7. 本地验证

```powershell
curl.exe -vk https://127.0.0.1:34430/health
curl.exe -vk https://127.0.0.1:34430/api/v1/health
curl.exe -vk https://127.0.0.1:34430/api/v1/dashboard/data-summary
curl.exe -vk https://127.0.0.1:34430/api/v1/data-summary
curl.exe -vk "https://127.0.0.1:34430/api/v1/data-assets?page=1&pageSize=20"
curl.exe -vk https://127.0.0.1:34430/api/v1/data-assets/tree
curl.exe -vk https://127.0.0.1:34430/api/v1/data-assets/graph
curl.exe -vk "https://127.0.0.1:34430/api/v1/tasks?page=1&pageSize=20"
```

## 8. 停止服务

```powershell
Ctrl + C
```

## 9. 最常用最小流程

```powershell
cd D:\docker-images\gaussian\backend-demo
npx prisma generate
npm run build
node .\dist\main.js
```
