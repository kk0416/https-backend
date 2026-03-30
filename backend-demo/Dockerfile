# 1. Builder 阶段
# 这里安装完整依赖、生成 Prisma Client、编译 TypeScript。
FROM node:24-bookworm-slim AS builder

RUN apt-get update && DEBIAN_FRONTEND=noninteractive apt-get install -y --no-install-recommends \
    python3 make g++ ca-certificates openssl \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Prisma 7 的配置会读取 DATABASE_URL。
# 这里提前设置默认值，避免构建阶段执行 generate 时缺少环境变量。
ENV DATABASE_URL=file:./data/roboshop.db

COPY package.json package-lock.json ./
COPY prisma ./prisma
COPY prisma.config.ts ./prisma.config.ts
COPY tsconfig.json tsconfig.build.json ./

RUN npm ci

COPY src ./src
COPY scripts ./scripts
COPY data ./data

RUN npx prisma generate
RUN npm run build

# 2. Runner 阶段
# 这里保留运行所需的 node_modules、源码、构建产物和 Prisma 配置。
# 这样容器内既能运行服务，也能在需要时手工执行 seed 或 migrate。
FROM node:24-bookworm-slim AS runner

RUN apt-get update && DEBIAN_FRONTEND=noninteractive apt-get install -y --no-install-recommends \
    ca-certificates openssl \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

ENV NODE_ENV=production
ENV DATABASE_URL=file:./data/roboshop.db
ENV SERVER_HOST=0.0.0.0
ENV SERVER_PORT=8443
ENV SSL_CERT_FILE=/app/certs/server.crt
ENV SSL_KEY_FILE=/app/certs/server.key

COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/package-lock.json ./package-lock.json
COPY --from=builder /app/tsconfig.json ./tsconfig.json
COPY --from=builder /app/tsconfig.build.json ./tsconfig.build.json
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/prisma.config.ts ./prisma.config.ts
COPY --from=builder /app/src ./src
COPY --from=builder /app/scripts ./scripts
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/data ./data

RUN mkdir -p /app/certs /app/data \
    && sed -i 's/\r$//' /app/scripts/entrypoint.sh \
    && chmod +x /app/scripts/entrypoint.sh

EXPOSE 8443

ENTRYPOINT ["/app/scripts/entrypoint.sh"]
