import { Controller, Get, Module } from '@nestjs/common';

import { ok } from './common/dto/api-response';
import { DashboardModule } from './modules/dashboard/dashboard.module';
import { DataAssetModule } from './modules/data-asset/data-asset.module';
import { ProcessTaskModule } from './modules/process-task/process-task.module';
import { PrismaModule } from './prisma/prisma.module';

// 最小健康检查控制器，用来确认服务有没有启动成功。
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

@Module({
  imports: [
    PrismaModule,
    DashboardModule,
    DataAssetModule,
    ProcessTaskModule,
  ],
  controllers: [HealthController],
})
export class AppModule {}
