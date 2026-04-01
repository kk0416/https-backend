import { Inject, Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';

import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class DashboardService {
  // PrismaService 由 NestJS 自动注入:“全局共享的数据库访问对象”。
  constructor(
    @Inject(PrismaService)
    private readonly prisma: PrismaService,
  ) {}

  async getDataSummary(siteId?: string, sceneId?: string) {
    // 先把页面传进来的 siteId / sceneId 翻译成数据库 where 条件。
    const assetWhere = this.buildScopedWhere(siteId, sceneId);
    const taskWhere = this.buildTaskWhere(siteId, sceneId);

    // 这里并行统计不同数据类型数量和任务数量。
    // Promise.all 的含义可以理解为“同时等待多条异步数据库查询”。
    const [
      rawCount,
      pointCloudCount,
      gaussianCount,
      map2dCount,
      map3dCount,
      totalTaskCount,
      runningTaskCount,
    ] = await Promise.all([
      this.prisma.dataAsset.count({ where: { ...assetWhere, dataType: 'RAW' } }),
      this.prisma.dataAsset.count({ where: { ...assetWhere, dataType: 'POINT_CLOUD' } }),
      this.prisma.dataAsset.count({ where: { ...assetWhere, dataType: 'GAUSSIAN' } }),
      this.prisma.dataAsset.count({ where: { ...assetWhere, dataType: 'MAP_2D' } }),
      this.prisma.dataAsset.count({ where: { ...assetWhere, dataType: 'MAP_3D' } }),
      this.prisma.processTask.count({ where: taskWhere }),
      this.prisma.processTask.count({ where: { ...taskWhere, status: 'RUNNING' } }),
    ]);

    // service 返回的是页面真正需要的结果结构。
    return {
      rawCount,
      pointCloudCount,
      gaussianCount,
      map2dCount,
      map3dCount,
      totalTaskCount,
      runningTaskCount,
    };
  }

  // 资产表查询条件。
  // Prisma 对不同表的 where 类型是严格区分的，所以不要复用到任务表。
  private buildScopedWhere(siteId?: string, sceneId?: string): Prisma.DataAssetWhereInput {
    const where: Prisma.DataAssetWhereInput = {};

    // Query 参数传进来时是字符串，这里显式转成数字。
    if (siteId) {
      where.siteId = Number.parseInt(siteId, 10);
    }

    if (sceneId) {
      where.sceneId = Number.parseInt(sceneId, 10);
    }

    return where;
  }

  // 任务表查询条件。
  private buildTaskWhere(siteId?: string, sceneId?: string): Prisma.ProcessTaskWhereInput {
    const where: Prisma.ProcessTaskWhereInput = {};

    if (siteId) {
      where.siteId = Number.parseInt(siteId, 10);
    }

    if (sceneId) {
      where.sceneId = Number.parseInt(sceneId, 10);
    }

    return where;
  }
}
