import { BadRequestException, Controller, Get, Inject, Param, Post, Query, Req } from '@nestjs/common';

import { ok } from '../../common/dto/api-response';
import { DataAssetService } from './data-asset.service';

@Controller('data-assets')
export class DataAssetController {
  // Qt/C++ 开发者可以把 Controller 理解成“HTTP 入口层”。
  constructor(
    @Inject(DataAssetService)
    private readonly dataAssetService: DataAssetService,
  ) {}

  @Get('upload-options')
  async getUploadOptions() {
    const data = await this.dataAssetService.getUploadOptions();
    return ok(data);
  }

  @Get()
  async getList(
    @Query('siteId') siteId?: string,
    @Query('sceneId') sceneId?: string,
    @Query('dataType') dataType?: string,
    @Query('status') status?: string,
    @Query('page') page?: string,
    @Query('pageSize') pageSize?: string,
  ) {
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
    return ok(data);
  }

  @Get('tree')
  async getTree(
    @Query('siteId') siteId?: string,
    @Query('sceneId') sceneId?: string,
  ) {
    // 返回树状图数据。
    // 给“树视图”页面使用。
    const data = await this.dataAssetService.getTree(siteId, sceneId);
    return ok(data);
  }

  @Get('graph') 
  async getGraph(
    @Query('siteId') siteId?: string,
    @Query('sceneId') sceneId?: string,
  ) {
    // 返回关系图数据。
    // 给“关系图”页面使用。
    const data = await this.dataAssetService.getGraph(siteId, sceneId);
    return ok(data);
  }

  @Post(':id/generate-point-cloud')
  async generatePointCloud(@Param('id') id: string) {
    // Param 用来读取路径参数中的 id。
    // 例如：POST /api/v1/data-assets/1/generate-point-cloud
    const data = await this.dataAssetService.generatePointCloud(id);
    return ok(data);
  }

  @Post('upload-raw')
  async uploadRawData(@Req() request: any) {
    if (!request.file) {
      throw new BadRequestException('multipart parser is not enabled');
    }

    const uploadedFile = await request.file();

    if (!uploadedFile) {
      throw new BadRequestException('file is required');
    }

    const fields = uploadedFile.fields as Record<
      string,
      { value?: string } | undefined
    >;
    console.log('Received file upload with fields:', fields);
    const data = await this.dataAssetService.uploadRawData({
      siteId: String(fields['siteId']?.value ?? ''),
      sceneId: String(fields['sceneId']?.value ?? ''),
      dataName: String(fields['dataName']?.value ?? ''),
      file: uploadedFile,
    });

    return ok(data);
  }
}
