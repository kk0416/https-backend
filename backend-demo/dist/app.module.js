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
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const api_response_1 = require("./common/dto/api-response");
const dashboard_module_1 = require("./modules/dashboard/dashboard.module");
const data_asset_module_1 = require("./modules/data-asset/data-asset.module");
const process_task_module_1 = require("./modules/process-task/process-task.module");
const prisma_module_1 = require("./prisma/prisma.module");
// 这是一个最小健康检查控制器。
// 它不依赖数据库和业务模块，只用来确认服务有没有启动成功。
let HealthController = class HealthController {
    getHealth() {
        return (0, api_response_1.ok)({
            service: 'gaussian-backend-demo',
            status: 'running',
        });
    }
};
__decorate([
    (0, common_1.Get)('/health'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], HealthController.prototype, "getHealth", null);
HealthController = __decorate([
    (0, common_1.Controller)()
], HealthController);
// AppModule 是整个 Nest 应用的根模块。
// 你可以把它理解成“总装配入口”：
// 1. 在这里注册所有子模块
// 2. Nest 根据这些模块建立依赖关系
// 3. controller/service 的自动注入都从这里开始串起来
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            // PrismaModule 提供全局数据库访问能力。
            prisma_module_1.PrismaModule,
            // 总览模块。
            dashboard_module_1.DashboardModule,
            // 数据资产模块，是当前最核心的业务模块。
            data_asset_module_1.DataAssetModule,
            // 任务模块。
            process_task_module_1.ProcessTaskModule,
        ],
        controllers: [HealthController],
    })
], AppModule);
