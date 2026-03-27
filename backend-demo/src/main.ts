import 'dotenv/config';
import 'reflect-metadata';

import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';

import { AppModule } from './app.module';
import { ok } from './common/dto/api-response';
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter';

// main.ts 是整个后端的启动入口。
// 当你运行 `npm run start:dev` 或 `node dist/main.js` 时，
// Node.js 最先进入的就是这个文件。
//
// 对 Qt/C++ 开发者来说，可以把它理解成：
// 1. 创建应用对象
// 2. 配置 HTTPS 服务
// 3. 注册全局规则
// 4. 开始监听端口
function resolveRuntimeFile(filePath: string | undefined) {
  // 把 `.env` 里的相对路径转换成项目根目录下的绝对路径。
  // 如果文件不存在，就返回 undefined，交给后续逻辑继续尝试其他证书方案。
  if (!filePath) {
    return undefined;
  }

  const absolutePath = resolve(process.cwd(), filePath);
  return existsSync(absolutePath) ? absolutePath : undefined;
}

function createHttpsOptions(logger: Logger) {
  // 第一优先级：和参考项目保持一致，优先读取 `crt + key`。
  // 这种格式更适合 Docker、Linux、Kubernetes、华为云环境。
  const certPath = resolveRuntimeFile(process.env.SSL_CERT_FILE);
  const keyPath = resolveRuntimeFile(process.env.SSL_KEY_FILE);

  if (certPath && keyPath) {
    logger.log(`HTTPS 证书模式: crt/key (${certPath})`);
    return {
      httpsOptions: {
        cert: readFileSync(certPath),
        key: readFileSync(keyPath),
      },
      mode: 'crt/key',
    };
  }

  // 第二优先级：兼容当前本地 Windows 开发方式。
  // 如果 `crt/key` 没提供，就继续尝试读取 `pfx`。
  const pfxPath = resolveRuntimeFile(process.env.HTTPS_PFX_PATH ?? './certs/dev-cert.pfx');
  const pfxPassphrase = process.env.HTTPS_PFX_PASSPHRASE ?? 'changeit';

  if (pfxPath) {
    logger.log(`HTTPS 证书模式: pfx (${pfxPath})`);
    return {
      httpsOptions: {
        pfx: readFileSync(pfxPath),
        passphrase: pfxPassphrase,
      },
      mode: 'pfx',
    };
  }

  throw new Error(
    '未找到可用的 HTTPS 证书。请配置 SSL_CERT_FILE/SSL_KEY_FILE，或提供 HTTPS_PFX_PATH。',
  );
}

async function bootstrap() {
  const logger = new Logger('Bootstrap');

  // SERVER_HOST / SERVER_PORT 是这次和参考项目对齐后的首选字段。
  // 这里仍然兼容旧字段 HTTPS_PORT，避免现有本地环境立刻失效。
  const host = process.env.SERVER_HOST ?? '0.0.0.0';
  const portText = process.env.SERVER_PORT ?? process.env.HTTPS_PORT ?? '8443';
  const httpsPort = Number.parseInt(portText, 10);

  if (Number.isNaN(httpsPort)) {
    throw new Error(`无效的端口配置: ${portText}`);
  }

  const { httpsOptions, mode } = createHttpsOptions(logger);

  // NestFactory.create 会根据 AppModule 里的模块定义，
  // 把整个 Nest 应用装配起来。
  //
  // 这里显式指定使用 FastifyAdapter，
  // 表示底层 HTTP/HTTPS 服务器由 Fastify 提供。
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter({
      https: httpsOptions,
    }),
  );

  // 统一给所有接口加上 /api/v1 前缀。
  app.setGlobalPrefix('api/v1');

  // 注册全局异常过滤器。
  // 任何 controller/service 抛出的异常，都会在这里统一格式化。
  app.useGlobalFilters(new AllExceptionsFilter());

  // 当前业务接口仍然保留 `/api/v1/health`。
  // 这里额外补一个裸路径 `/health`，供 Docker / Helm / 华为云探针直接复用。
  const fastify = app.getHttpAdapter().getInstance();
  fastify.get('/health', async () =>
    ok({
      service: 'gaussian-backend-demo',
      status: 'running',
    }),
  );

  // 启动 HTTPS 服务并监听指定端口。
  await app.listen(httpsPort, host);

  const displayHost = host === '0.0.0.0' ? '127.0.0.1' : host;
  logger.log(`运行地址: https://${displayHost}:${httpsPort}`);
  logger.log(`业务健康检查: https://${displayHost}:${httpsPort}/api/v1/health`);
  logger.log(`探针兼容健康检查: https://${displayHost}:${httpsPort}/health`);
  logger.log(`当前 HTTPS 启动模式: ${mode}`);
}

// 真正触发启动流程。
bootstrap();
