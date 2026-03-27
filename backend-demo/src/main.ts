import 'reflect-metadata';

import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';

import { AppModule } from './app.module';
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter';

// main.ts 是整个后端的启动入口。
// 当你运行 `npm run start:dev` 或 `node dist/main.js` 时，
// Node.js 最先进入的就是这个文件。
//
// 对 Qt/C++ 开发者来说，可以把它理解成：
// 1. 创建应用对象
// 2. 配置 HTTP 服务
// 3. 注册全局规则
// 4. 开始监听端口
async function bootstrap() {
  // NestFactory.create 会根据 AppModule 里的模块定义，
  // 把整个 Nest 应用装配起来。
  //
  // 这里显式指定使用 FastifyAdapter，
  // 表示底层 HTTP 服务器由 Fastify 提供。
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
  );

  // 统一给所有接口加上 /api/v1 前缀。
  app.setGlobalPrefix('api/v1');

  // 注册全局异常过滤器。
  // 任何 controller/service 抛出的异常，都会在这里统一格式化。
  app.useGlobalFilters(new AllExceptionsFilter());

  // 启动 HTTP 服务并监听 3000 端口。
  await app.listen(3000, '0.0.0.0');

  const logger = new Logger('Bootstrap');
  logger.log('服务已启动: http://127.0.0.1:3000/api/v1/health');
}

// 真正触发启动流程。
bootstrap();
