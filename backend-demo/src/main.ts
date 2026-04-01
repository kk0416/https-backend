import 'dotenv/config';
import 'reflect-metadata';

import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import multipart from '@fastify/multipart';

import { AppModule } from './app.module';
import { ok } from './common/dto/api-response';
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter';

function resolveRuntimeFile(filePath: string | undefined) {
  
  if (!filePath) {
    return undefined;
  }
 // 把相对路径转换成项目根目录下的绝对路径
  const absolutePath = resolve(process.cwd(), filePath);
  return existsSync(absolutePath) ? absolutePath : undefined;
}

function readOptionalRuntimeTextFile(filePath: string) {
  const absolutePath = resolve(process.cwd(), filePath);
  if (!existsSync(absolutePath)) {
    return undefined;
  }

  return readFileSync(absolutePath, 'utf8');
}
// 证书: 优先 crt + key，然后 pfx
function createHttpsOptions(logger: Logger) {
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
  const host = process.env.SERVER_HOST ?? '0.0.0.0';
  const portText = process.env.SERVER_PORT ?? process.env.HTTPS_PORT ?? '8443';
  const httpsPort = Number.parseInt(portText, 10);

  if (Number.isNaN(httpsPort)) {
    throw new Error(`无效的端口配置: ${portText}`);
  }

  const { httpsOptions, mode } = createHttpsOptions(logger);

  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter({ // Fastify 
      https: httpsOptions,
    }),
  );

  app.setGlobalPrefix('api/v1');

  app.useGlobalFilters(new AllExceptionsFilter());

  // 裸路径 `/health`，直接通过 fastify 定义，不经过 Nest 的全局前缀和全局过滤器。
  const fastify = app.getHttpAdapter().getInstance();
  await fastify.register(multipart as any, {
    limits: {
      files: 1,
    },
  });

  fastify.get('/health', async () =>
    ok({
      service: 'gaussian-backend-demo',
      status: 'running',
    }),
  );

  fastify.get('/tester', async (_request, reply) => {
    const testerHtml = readOptionalRuntimeTextFile('src/test-client/index.html');

    if (!testerHtml) {
      logger.warn('测试页面资源缺失: src/test-client/index.html');
      return reply.status(404).send({
        code: 404,
        message: 'tester page not found',
        data: {
          path: '/tester',
        },
      });
    }

    return reply.type('text/html; charset=utf-8').send(testerHtml);
  });

  fastify.get('/tester/', async (_request, reply) => {
    const testerHtml = readOptionalRuntimeTextFile('src/test-client/index.html');

    if (!testerHtml) {
      logger.warn('测试页面资源缺失: src/test-client/index.html');
      return reply.status(404).send({
        code: 404,
        message: 'tester page not found',
        data: {
          path: '/tester',
        },
      });
    }

    return reply.type('text/html; charset=utf-8').send(testerHtml);
  });

  await app.listen(httpsPort, host);

  const displayHost = host === '0.0.0.0' ? '127.0.0.1' : host;
  logger.log(`运行地址: https://${displayHost}:${httpsPort}`);
  logger.log(`业务健康检查: https://${displayHost}:${httpsPort}/api/v1/health`);
  logger.log(`探针兼容健康检查: https://${displayHost}:${httpsPort}/health`);
  logger.log(`接口测试页面: https://${displayHost}:${httpsPort}/tester`);
  logger.log(`当前 HTTPS 启动模式: ${mode}`);
  logger.log(`cwd = ${process.cwd()}`);
  logger.log(`__dirname = ${__dirname}`);


}

bootstrap();
