import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { DataAssetStatus, DataType, Prisma } from '@prisma/client';

import { toApiEnum, toPositiveInt, toPrismaEnum } from '../../common/utils/api-format';
import { PrismaService } from '../../prisma/prisma.service';

type GetDataAssetListQuery = {
  siteId?: string;
  sceneId?: string;
  dataType?: string;
  status?: string;
  page?: string;
  pageSize?: string;
};

type TreeNode = {
  id: number;
  dataName: string;
  dataType: string;
  status: string;
  progress: number;
  sourceDataId: number | null;
  children: TreeNode[];
};

@Injectable()
export class DataAssetService {
  // Service 层负责真正的数据库访问和业务处理。
  // Controller 不直接写 SQL/Prisma 查询，而是调用这里的方法。
  constructor(private readonly prisma: PrismaService) {}

  async getList(query: GetDataAssetListQuery) {
    // URL 查询参数天然都是字符串，所以先做一次安全转换。
    const page = toPositiveInt(query.page, 1);
    const pageSize = toPositiveInt(query.pageSize, 20);
    const skip = (page - 1) * pageSize;
    const where = this.buildWhere(query.siteId, query.sceneId, query.dataType, query.status);

    // 列表查询和总数统计同时执行，减少等待时间。
    const [list, total] = await Promise.all([
      this.prisma.dataAsset.findMany({
        where,
        include: {
          site: true,
          scene: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
        skip,
        take: pageSize,
      }),
      this.prisma.dataAsset.count({ where }),
    ]);

    // 这里故意把数据库原始记录转成更适合前端使用的输出结构：
    // 1. 枚举转成小写
    // 2. 时间转成字符串
    // 3. site/scene 名称直接带出来
    return {
      list: list.map((item) => ({
        id: item.id,
        siteId: item.siteId,
        siteName: item.site.siteName,
        sceneId: item.sceneId,
        sceneName: item.scene.sceneName,
        dataType: toApiEnum(item.dataType),
        dataName: item.dataName,
        status: toApiEnum(item.status),
        progress: item.progress,
        sourceDataId: item.sourceDataId,
        currentTaskId: item.currentTaskId,
        storagePath: item.storagePath,
        fileName: item.fileName,
        fileSize: item.fileSize,
        operatorId: item.operatorId,
        operatorName: item.operatorName,
        createdAt: item.createdAt.toISOString(),
        updatedAt: item.updatedAt.toISOString(),
        deletedAt: item.deletedAt?.toISOString() ?? null,
      })),
      page,
      pageSize,
      total,
    };
  }

  async getTree(siteId?: string, sceneId?: string) {
    const where = this.buildWhere(siteId, sceneId);
    // 树结构必须先拿到完整节点集合，因此这里不分页。
    const assets = await this.prisma.dataAsset.findMany({
      where,
      orderBy: {
        createdAt: 'asc',
      },
    });

    return this.buildTree(assets);
  }

  async getGraph(siteId?: string, sceneId?: string) {
    const where = this.buildWhere(siteId, sceneId);
    const assets = await this.prisma.dataAsset.findMany({
      where,
      orderBy: {
        createdAt: 'asc',
      },
    });

    const ids = new Set(assets.map((item) => item.id));

    // 关系图接口返回 nodes + edges，前端图形库通常可以直接消费这类结构。
    // nodes 表示节点，edges 表示连接线。
    return {
      nodes: assets.map((item) => ({
        id: item.id,
        label: item.dataName,
        dataType: toApiEnum(item.dataType),
        status: toApiEnum(item.status),
        progress: item.progress,
        siteId: item.siteId,
        sceneId: item.sceneId,
      })),
      edges: assets
        .filter((item) => item.sourceDataId !== null && ids.has(item.sourceDataId))
        .map((item) => ({
          source: item.sourceDataId,
          target: item.id,
        })),
    };
  }

  async generatePointCloud(id: string) {
    // 路由参数先转换成数据库主键。
    const sourceId = Number.parseInt(id, 10);
    if (Number.isNaN(sourceId)) {
      throw new BadRequestException('invalid data asset id');
    }

    // 先检查源数据是否存在。
    const source = await this.prisma.dataAsset.findUnique({
      where: { id: sourceId },
    });

    if (!source) {
      throw new NotFoundException('data asset not found');
    }

    if (source.dataType !== 'RAW') {
      throw new BadRequestException('only raw data can generate point cloud');
    }

    if (source.status === 'DELETED') {
      throw new BadRequestException('deleted data cannot create tasks');
    }

    // 事务的作用是保证这一组操作要么全部成功，要么全部失败。
    // 这里要同时创建任务、创建目标数据、更新源数据、写操作日志。
    const result = await this.prisma.$transaction(async (tx) => {
      // 第 1 步：创建任务记录。
      const task = await tx.processTask.create({
        data: {
          siteId: source.siteId,
          sceneId: source.sceneId,
          taskType: 'GENERATE_POINT_CLOUD',
          taskTitle: `${source.dataName} 点云生成任务`,
          sourceDataId: source.id,
          status: 'QUEUED',
          progress: 0,
          operatorId: source.operatorId ?? 'system',
          operatorName: source.operatorName ?? 'system',
        },
      });

      // 目标点云数据先以 QUEUED 状态创建出来，表示任务已提交、结果尚未完成。
      // 第 2 步：创建目标数据记录。
      const target = await tx.dataAsset.create({
        data: {
          siteId: source.siteId,
          sceneId: source.sceneId,
          dataType: 'POINT_CLOUD',
          dataName: `${source.dataName}-point-cloud`,
          status: 'QUEUED',
          progress: 0,
          sourceDataId: source.id,
          currentTaskId: task.id,
          operatorId: source.operatorId ?? 'system',
          operatorName: source.operatorName ?? 'system',
        },
      });

      const updatedTask = await tx.processTask.update({
        where: { id: task.id },
        data: {
          targetDataId: target.id,
        },
      });

      // 第 3 步：更新源数据的 currentTaskId。
      await tx.dataAsset.update({
        where: { id: source.id },
        data: {
          currentTaskId: task.id,
        },
      });

      // 第 4 步：写一条操作日志。
      await tx.operationLog.create({
        data: {
          siteId: source.siteId,
          sceneId: source.sceneId,
          dataId: source.id,
          taskId: task.id,
          operationType: 'GENERATE_POINT_CLOUD',
          operationDesc: `从原始数据 ${source.dataName} 创建点云生成任务`,
          status: 'PROCESSING',
          operatorId: source.operatorId ?? 'system',
          operatorName: source.operatorName ?? 'system',
        },
      });

      return {
        taskId: updatedTask.id,
        targetDataId: target.id,
        status: toApiEnum(updatedTask.status),
      };
    });

    // 这里返回的是“任务已创建成功”，不是“点云已处理完成”。
    return result;
  }

  // buildWhere 负责把 URL 查询参数翻译成 Prisma where 条件。
  private buildWhere(
    siteId?: string,
    sceneId?: string,
    dataType?: string,
    status?: string,
  ): Prisma.DataAssetWhereInput {
    const where: Prisma.DataAssetWhereInput = {};

    if (siteId) {
      where.siteId = Number.parseInt(siteId, 10);
    }

    if (sceneId) {
      where.sceneId = Number.parseInt(sceneId, 10);
    }

    const prismaDataType = toPrismaEnum(dataType);
    if (prismaDataType) {
      where.dataType = prismaDataType as DataType;
    }

    const prismaStatus = toPrismaEnum(status);
    if (prismaStatus) {
      where.status = prismaStatus as DataAssetStatus;
    }

    return where;
  }

  // 把“平铺数组”组装成真正的树结构。
  // nodeMap 可以理解成一个按 id 建立的快速索引。
  private buildTree(
    assets: Array<{
      id: number;
      dataName: string;
      dataType: string;
      status: string;
      progress: number;
      sourceDataId: number | null;
    }>,
  ): TreeNode[] {
    const nodeMap = new Map<number, TreeNode>();

    for (const asset of assets) {
      // 先为每条数据记录生成一个节点对象，但先不处理父子关系。
      nodeMap.set(asset.id, {
        id: asset.id,
        dataName: asset.dataName,
        dataType: toApiEnum(asset.dataType),
        status: toApiEnum(asset.status),
        progress: asset.progress,
        sourceDataId: asset.sourceDataId,
        children: [],
      });
    }

    const roots: TreeNode[] = [];

    for (const asset of assets) {
      const node = nodeMap.get(asset.id)!;
      // 如果当前节点存在父节点，就挂到父节点 children 下。
      if (asset.sourceDataId && nodeMap.has(asset.sourceDataId)) {
        nodeMap.get(asset.sourceDataId)!.children.push(node);
      } else {
        // 没有父节点时，它就是一棵树的根节点。
        roots.push(node);
      }
    }

    return roots;
  }
}
