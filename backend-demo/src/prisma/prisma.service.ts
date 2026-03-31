import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

import { createPrismaClientOptions } from './prisma-client-options';

// PrismaService 继承自 PrismaClient。
// 因此它本身就具备所有数据库访问方法，例如：
// 1. this.prisma.site.findMany()
// 2. this.prisma.dataAsset.create()
// 3. this.prisma.processTask.count()
//
// 同时它又是一个 Nest Injectable，
// 所以可以像普通 service 一样被注入到业务模块中。

//implements OnModuleInit, OnModuleDestroy 表明自己实现了 Nest 的两个生命周期接口，
// Nest 会在模块初始化时调用 onModuleInit()，
// 在模块销毁时调用 onModuleDestroy()。
@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  constructor() {
    super(createPrismaClientOptions());
  }

  // 模块启动时自动建立数据库连接。
  async onModuleInit(): Promise<void> {
    await this.$connect();
  }

  // 模块销毁时自动释放数据库连接。
  async onModuleDestroy(): Promise<void> {
    await this.$disconnect();
  }
}
