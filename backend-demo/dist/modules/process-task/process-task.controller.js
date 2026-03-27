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
exports.ProcessTaskController = void 0;
const common_1 = require("@nestjs/common");
const api_response_1 = require("../../common/dto/api-response");
const process_task_service_1 = require("./process-task.service");
let ProcessTaskController = class ProcessTaskController {
    processTaskService;
    // 任务模块的 HTTP 入口。
    constructor(processTaskService) {
        this.processTaskService = processTaskService;
    }
    async getList(siteId, sceneId, status, page, pageSize) {
        // 任务列表接口。
        // 页面上的筛选和分页参数都从这里进入 service。
        const data = await this.processTaskService.getList({
            siteId,
            sceneId,
            status,
            page,
            pageSize,
        });
        return (0, api_response_1.ok)(data);
    }
};
exports.ProcessTaskController = ProcessTaskController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)('siteId')),
    __param(1, (0, common_1.Query)('sceneId')),
    __param(2, (0, common_1.Query)('status')),
    __param(3, (0, common_1.Query)('page')),
    __param(4, (0, common_1.Query)('pageSize')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String, String]),
    __metadata("design:returntype", Promise)
], ProcessTaskController.prototype, "getList", null);
exports.ProcessTaskController = ProcessTaskController = __decorate([
    (0, common_1.Controller)('tasks'),
    __metadata("design:paramtypes", [process_task_service_1.ProcessTaskService])
], ProcessTaskController);
