import { Global, Module } from '@nestjs/common';

import { PrismaService } from './prisma.service';

// @Global() 的含义是：
// 这个模块导出的 PrismaService 可以在整个应用中直接注入使用。
@Global()
@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}
