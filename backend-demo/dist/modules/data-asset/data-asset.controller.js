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
exports.DataAssetController = void 0;
const common_1 = require("@nestjs/common");
const api_response_1 = require("../../common/dto/api-response");
const data_asset_service_1 = require("./data-asset.service");
let DataAssetController = class DataAssetController {
    dataAssetService;
    // Qt/C++ 开发者可以把 Controller 理解成“HTTP 入口层”。
    constructor(dataAssetService) {
        this.dataAssetService = dataAssetService;
    }
    async getList(siteId, sceneId, dataType, status, page, pageSize) {
        // 这里只收参数，不直接写数据库逻辑。
        // 数据列表页的筛选和分页参数都会从这里进入 service。
        const data = await this.dataAssetService.getList({
            siteId,
            sceneId,
            dataType,
            status,
            page,
            pageSize,
        });
        return (0, api_response_1.ok)(data);
    }
    async getTree(siteId, sceneId) {
        // 返回树状图数据。
        // 给“树视图”页面使用。
        const data = await this.dataAssetService.getTree(siteId, sceneId);
        return (0, api_response_1.ok)(data);
    }
    async getGraph(siteId, sceneId) {
        // 返回关系图数据。
        // 给“关系图”页面使用。
        const data = await this.dataAssetService.getGraph(siteId, sceneId);
        return (0, api_response_1.ok)(data);
    }
    async generatePointCloud(id) {
        // Param 用来读取路径参数中的 id。
        // 例如：POST /api/v1/data-assets/1/generate-point-cloud
        const data = await this.dataAssetService.generatePointCloud(id);
        return (0, api_response_1.ok)(data);
    }
};
exports.DataAssetController = DataAssetController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)('siteId')),
    __param(1, (0, common_1.Query)('sceneId')),
    __param(2, (0, common_1.Query)('dataType')),
    __param(3, (0, common_1.Query)('status')),
    __param(4, (0, common_1.Query)('page')),
    __param(5, (0, common_1.Query)('pageSize')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String, String, String]),
    __metadata("design:returntype", Promise)
], DataAssetController.prototype, "getList", null);
__decorate([
    (0, common_1.Get)('tree'),
    __param(0, (0, common_1.Query)('siteId')),
    __param(1, (0, common_1.Query)('sceneId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], DataAssetController.prototype, "getTree", null);
__decorate([
    (0, common_1.Get)('graph'),
    __param(0, (0, common_1.Query)('siteId')),
    __param(1, (0, common_1.Query)('sceneId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], DataAssetController.prototype, "getGraph", null);
__decorate([
    (0, common_1.Post)(':id/generate-point-cloud'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], DataAssetController.prototype, "generatePointCloud", null);
exports.DataAssetController = DataAssetController = __decorate([
    (0, common_1.Controller)('data-assets'),
    __metadata("design:paramtypes", [data_asset_service_1.DataAssetService])
], DataAssetController);
