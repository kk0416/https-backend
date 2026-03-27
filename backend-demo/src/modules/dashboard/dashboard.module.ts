import { Module } from '@nestjs/common';

import { DashboardAliasController, DashboardController } from './dashboard.controller';
import { DashboardService } from './dashboard.service';

@Module({
  controllers: [DashboardController, DashboardAliasController],
  providers: [DashboardService],
  exports: [DashboardService],
})
export class DashboardModule {}
