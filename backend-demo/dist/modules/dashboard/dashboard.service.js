"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DashboardService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
let DashboardService = class DashboardService {
    prisma;
    // PrismaService 由 NestJS 自动注入。
    // 可以把它理解成“全局共享的数据库访问对象”。
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getDataSummary(siteId, sceneId) {
        // 先把页面传进来的 siteId / sceneId 翻译成数据库 where 条件。
        const assetWhere = this.buildScopedWhere(siteId, sceneId);
        const taskWhere = this.buildTaskWhere(siteId, sceneId);
        // 这里并行统计不同数据类型数量和任务数量。
        // Promise.all 的含义可以理解为“同时等待多条异步数据库查询”。
        const [rawCount, pointCloudCount, gaussianCount, map2dCount, map3dCount, totalTaskCount, runningTaskCount,] = await Promise.all([
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
    buildScopedWhere(siteId, sceneId) {
        const where = {};
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
    buildTaskWhere(siteId, sceneId) {
        const where = {};
        if (siteId) {
            where.siteId = Number.parseInt(siteId, 10);
        }
        if (sceneId) {
            where.sceneId = Number.parseInt(sceneId, 10);
        }
        return where;
    }
};
exports.DashboardService = DashboardService;
exports.DashboardService = DashboardService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], DashboardService);
