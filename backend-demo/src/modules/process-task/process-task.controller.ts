import { Controller, Get, Inject, Query } from '@nestjs/common';

import { ok } from '../../common/dto/api-response';
import { ProcessTaskService } from './process-task.service';

@Controller('tasks')
export class ProcessTaskController {
  // 任务模块的 HTTP 入口。
  constructor(
    @Inject(ProcessTaskService)
    private readonly processTaskService: ProcessTaskService,
  ) {}

  @Get()
  async getList(
    @Query('siteId') siteId?: string,
    @Query('sceneId') sceneId?: string,
    @Query('status') status?: string,
    @Query('page') page?: string,
    @Query('pageSize') pageSize?: string,
  ) {
    // 任务列表接口。
    // 页面上的筛选和分页参数都从这里进入 service。
    const data = await this.processTaskService.getList({
      siteId,
      sceneId,
      status,
      page,
      pageSize,
    });
    return ok(data);
  }
}
