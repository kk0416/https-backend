import { Controller, Get, Module } from '@nestjs/common';

import { ok } from './common/dto/api-response';
import { DashboardModule } from './modules/dashboard/dashboard.module';
import { DataAssetModule } from './modules/data-asset/data-asset.module';
import { ProcessTaskModule } from './modules/process-task/process-task.module';
import { PrismaModule } from './prisma/prisma.module';

// 这是一个最小健康检查控制器。
// 它不依赖数据库和业务模块，只用来确认服务有没有启动成功。
@Controller()
class HealthController {
  @Get('/health')
  getHealth() {
    return ok({
      service: 'gaussian-backend-demo',
      status: 'running',
    });
  }
}

// AppModule 是整个 Nest 应用的根模块。
// 你可以把它理解成“总装配入口”：
// 1. 在这里注册所有子模块
// 2. Nest 根据这些模块建立依赖关系
// 3. controller/service 的自动注入都从这里开始串起来
@Module({
  imports: [
    // PrismaModule 提供全局数据库访问能力。
    PrismaModule,
    // 总览模块。
    DashboardModule,
    // 数据资产模块，是当前最核心的业务模块。
    DataAssetModule,
    // 任务模块。
    ProcessTaskModule,
  ],
  controllers: [HealthController],
})
export class AppModule {}
