import { Controller, Get, Inject, Query } from '@nestjs/common';

import { ok } from '../../common/dto/api-response';
import { DashboardService } from './dashboard.service';

@Controller('dashboard') //设置路由前缀为 '/dashboard'
export class DashboardController {
  constructor(
    @Inject(DashboardService)
    private readonly dashboardService: DashboardService,
  ) {}

  @Get('data-summary')
  async getDataSummary(// Query 装饰器会把 URL 查询参数自动传进来。
    @Query('siteId') siteId?: string,
    @Query('sceneId') sceneId?: string,
  ) {
    
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
  constructor(
    @Inject(DashboardService)
    private readonly dashboardService: DashboardService,
  ) {}

  @Get('data-summary')
  async getDataSummaryAlias(
    @Query('siteId') siteId?: string,
    @Query('sceneId') sceneId?: string,
  ) {
    const data = await this.dashboardService.getDataSummary(siteId, sceneId);
    return ok(data);
  }
}
