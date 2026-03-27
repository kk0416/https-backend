import { Controller, Get, Query } from '@nestjs/common';

import { ok } from '../../common/dto/api-response';
import { DashboardService } from './dashboard.service';

@Controller('dashboard')
export class DashboardController {
  // Controller 负责接收 HTTP 请求，再把工作交给 service。
  // 对应 Qt/C++ 习惯，可以把它理解成“接口入口层”。
  constructor(private readonly dashboardService: DashboardService) {}

  @Get('data-summary')
  async getDataSummary(
    @Query('siteId') siteId?: string,
    @Query('sceneId') sceneId?: string,
  ) {
    // Query 装饰器会把 URL 查询参数自动传进来。
    // 例如：
    // GET /api/v1/dashboard/data-summary?siteId=1&sceneId=1
    const data = await this.dashboardService.getDataSummary(siteId, sceneId);
    return ok(data);
  }
}
