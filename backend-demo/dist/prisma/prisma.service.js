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
exports.PrismaService = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const prisma_client_options_1 = require("./prisma-client-options");
// PrismaService 继承自 PrismaClient。
// 因此它本身就具备所有数据库访问方法，例如：
// 1. this.prisma.site.findMany()
// 2. this.prisma.dataAsset.create()
// 3. this.prisma.processTask.count()
//
// 同时它又是一个 Nest Injectable，
// 所以可以像普通 service 一样被注入到业务模块中。
let PrismaService = class PrismaService extends client_1.PrismaClient {
    constructor() {
        super((0, prisma_client_options_1.createPrismaClientOptions)());
    }
    // 模块启动时自动建立数据库连接。
    async onModuleInit() {
        await this.$connect();
    }
    // 模块销毁时自动释放数据库连接。
    async onModuleDestroy() {
        await this.$disconnect();
    }
};
exports.PrismaService = PrismaService;
exports.PrismaService = PrismaService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], PrismaService);
