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
exports.ProcessTaskService = void 0;
const common_1 = require("@nestjs/common");
const api_format_1 = require("../../common/utils/api-format");
const prisma_service_1 = require("../../prisma/prisma.service");
let ProcessTaskService = class ProcessTaskService {
    prisma;
    // 任务列表的数据库查询都放在这里。
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getList(query) {
        // 和数据列表一样，先处理分页参数。
        const page = (0, api_format_1.toPositiveInt)(query.page, 1);
        const pageSize = (0, api_format_1.toPositiveInt)(query.pageSize, 20);
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
                taskType: (0, api_format_1.toApiEnum)(item.taskType),
                taskTitle: item.taskTitle,
                sourceDataId: item.sourceDataId,
                sourceDataName: item.sourceData?.dataName ?? null,
                targetDataId: item.targetDataId,
                targetDataName: item.targetData?.dataName ?? null,
                status: (0, api_format_1.toApiEnum)(item.status),
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
    buildWhere(siteId, sceneId, status) {
        const where = {};
        if (siteId) {
            where.siteId = Number.parseInt(siteId, 10);
        }
        if (sceneId) {
            where.sceneId = Number.parseInt(sceneId, 10);
        }
        const prismaStatus = (0, api_format_1.toPrismaEnum)(status);
        if (prismaStatus) {
            where.status = prismaStatus;
        }
        return where;
    }
};
exports.ProcessTaskService = ProcessTaskService;
exports.ProcessTaskService = ProcessTaskService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ProcessTaskService);
