# Git 提交清单

## 1. 应该提交到 Git 的内容

### 1.1 源码与配置

1. `src/`
2. `prisma/`
3. `scripts/`
4. `helm/`
5. `.vscode/`
6. `package.json`
7. `package-lock.json`
8. `tsconfig.json`
9. `tsconfig.build.json`
10. `prisma.config.ts`
11. `Dockerfile`
12. `docker-compose.yml`
13. `.dockerignore`
14. `.gitignore`
15. `README.md`
16. `STEP-LOG.md`

### 1.2 文档

1. `docs/`

说明：

1. 当前项目的说明文档、部署文档、联调文档都属于源码资产的一部分
2. 应继续纳入 Git 管理

## 2. 不应该提交到 Git 的内容

### 2.1 依赖和编译产物

1. `node_modules/`
2. `dist/`

### 2.2 本地环境与运行态数据

1. `.env`
2. `.docker-tmp-config/`
3. `data/*.db`
4. `data/*.sqlite`
5. `data/*.sqlite3`

### 2.3 本地证书和密钥

1. `certs/dev-cert.pfx`
2. `certs/server.crt`
3. `certs/server.key`
4. `tls.crt`
5. `tls.key`
6. `privkey.pem`

说明：

1. 这些文件属于本地开发证书、部署证书或私钥
2. 不应纳入 Git

## 3. 当前项目的一句话规则

### 3.1 提交

提交：

1. 源码
2. 配置
3. 脚本
4. 文档

### 3.2 不提交

不提交：

1. 依赖
2. 编译产物
3. 数据库文件
4. 本地证书
5. 私钥

## 4. 当前项目最常见的判断结果

### 4.1 这些提交

1. `src`
2. `prisma`
3. `helm`
4. `docs`
5. `package.json`
6. `package-lock.json`
7. `Dockerfile`
8. `docker-compose.yml`
9. `.vscode`

### 4.2 这些不提交

1. `node_modules`
2. `dist`
3. `.env`
4. `data/roboshop.db`
5. `certs/dev-cert.pfx`
6. `certs/server.crt`
7. `certs/server.key`
8. `tls.crt`
9. `tls.key`
10. `privkey.pem`

## 5. 当前补充说明

### 5.1 为什么 `dist` 不提交

1. `dist` 是每次编译生成的产物
2. 当前项目本地、Docker、发布流程都可以重新生成 `dist`

### 5.2 为什么 `node_modules` 不提交

1. `node_modules` 可由 `package-lock.json` 重新安装
2. 体积大，不适合进 Git

### 5.3 为什么数据库文件不提交

1. `SQLite` 数据库属于运行态数据
2. 应视为本地数据或部署数据，不应和源码混在一起

### 5.4 为什么证书不提交

1. 证书和私钥属于敏感文件
2. 本地开发证书也不应纳入仓库
