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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DashboardController = void 0;
const common_1 = require("@nestjs/common");
const api_response_1 = require("../../common/dto/api-response");
const dashboard_service_1 = require("./dashboard.service");
let DashboardController = class DashboardController {
    dashboardService;
    // Controller 负责接收 HTTP 请求，再把工作交给 service。
    // 对应 Qt/C++ 习惯，可以把它理解成“接口入口层”。
    constructor(dashboardService) {
        this.dashboardService = dashboardService;
    }
    async getDataSummary(siteId, sceneId) {
        // Query 装饰器会把 URL 查询参数自动传进来。
        // 例如：
        // GET /api/v1/dashboard/data-summary?siteId=1&sceneId=1
        const data = await this.dashboardService.getDataSummary(siteId, sceneId);
        return (0, api_response_1.ok)(data);
    }
};
exports.DashboardController = DashboardController;
__decorate([
    (0, common_1.Get)('data-summary'),
    __param(0, (0, common_1.Query)('siteId')),
    __param(1, (0, common_1.Query)('sceneId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], DashboardController.prototype, "getDataSummary", null);
exports.DashboardController = DashboardController = __decorate([
    (0, common_1.Controller)('dashboard'),
    __metadata("design:paramtypes", [dashboard_service_1.DashboardService])
], DashboardController);
