import { Injectable } from '@nestjs/common';
import { Prisma, TaskStatus } from '@prisma/client';

import { toApiEnum, toPositiveInt, toPrismaEnum } from '../../common/utils/api-format';
import { PrismaService } from '../../prisma/prisma.service';

type GetTaskListQuery = {
  siteId?: string;
  sceneId?: string;
  status?: string;
  page?: string;
  pageSize?: string;
};

@Injectable()
export class ProcessTaskService {
  // 任务列表的数据库查询都放在这里。
  constructor(private readonly prisma: PrismaService) {}

  async getList(query: GetTaskListQuery) {
    // 和数据列表一样，先处理分页参数。
    const page = toPositiveInt(query.page, 1);
    const pageSize = toPositiveInt(query.pageSize, 20);
    const skip = (page - 1) * pageSize;
    const where = this.buildWhere(query.siteId, query.sceneId, query.status);

    // include 会把关联对象一起查出来，避免后面再手动补现场名、场景名。
    const [list, total] = await Promise.all([
      this.prisma.processTask.findMany({
        where,
        include: {
          site: true,
          scene: true,
          sourceData: true,
          targetData: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
        skip,
        take: pageSize,
      }),
      this.prisma.processTask.count({ where }),
    ]);

    // 这里把任务记录转换成前端更容易直接显示的结构。
    return {
      list: list.map((item) => ({
        id: item.id,
        siteId: item.siteId,
        siteName: item.site.siteName,
        sceneId: item.sceneId,
        sceneName: item.scene.sceneName,
        taskType: toApiEnum(item.taskType),
        taskTitle: item.taskTitle,
        sourceDataId: item.sourceDataId,
        sourceDataName: item.sourceData?.dataName ?? null,
        targetDataId: item.targetDataId,
        targetDataName: item.targetData?.dataName ?? null,
        status: toApiEnum(item.status),
        progress: item.progress,
        errorCode: item.errorCode,
        errorMessage: item.errorMessage,
        operatorId: item.operatorId,
        operatorName: item.operatorName,
        createdAt: item.createdAt.toISOString(),
        startedAt: item.startedAt?.toISOString() ?? null,
        finishedAt: item.finishedAt?.toISOString() ?? null,
        updatedAt: item.updatedAt.toISOString(),
      })),
      page,
      pageSize,
      total,
    };
  }

  // 把查询参数翻译成任务表的 where 条件。
  private buildWhere(
    siteId?: string,
    sceneId?: string,
    status?: string,
  ): Prisma.ProcessTaskWhereInput {
    const where: Prisma.ProcessTaskWhereInput = {};

    if (siteId) {
      where.siteId = Number.parseInt(siteId, 10);
    }

    if (sceneId) {
      where.sceneId = Number.parseInt(sceneId, 10);
    }

    const prismaStatus = toPrismaEnum(status);
    if (prismaStatus) {
      where.status = prismaStatus as TaskStatus;
    }

    return where;
  }
}
