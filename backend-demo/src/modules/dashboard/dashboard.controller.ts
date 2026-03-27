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

@Controller()
export class DashboardAliasController {
  // 兼容一个更短的路由别名：
  // GET /api/v1/data-summary
  //
  // 原始标准路由仍然保留在 /api/v1/dashboard/data-summary。
  // 这样做的原因是联调阶段前端更容易把“总览统计”理解成顶层接口，
  // 给一个别名可以减少不必要的 404 试错。
  constructor(private readonly dashboardService: DashboardService) {}

  @Get('data-summary')
  async getDataSummaryAlias(
    @Query('siteId') siteId?: string,
    @Query('sceneId') sceneId?: string,
  ) {
    const data = await this.dashboardService.getDataSummary(siteId, sceneId);
    return ok(data);
  }
}
