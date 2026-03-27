import 'reflect-metadata';

import { PrismaClient } from '@prisma/client';

import { createPrismaClientOptions } from '../src/prisma/prisma-client-options';

const prisma = new PrismaClient(createPrismaClientOptions());

async function main() {
  // 为了保证反复执行 seed 结果一致，先清空已有演示数据。
  await prisma.operationLog.deleteMany();
  await prisma.processTask.deleteMany();
  await prisma.dataAsset.deleteMany();
  await prisma.scene.deleteMany();
  await prisma.site.deleteMany();

  const siteA = await prisma.site.create({
    data: {
      siteCode: 'site-a',
      siteName: 'A 线',
      status: 'ENABLED',
      remark: '演示现场 A',
    },
  });

  const sceneWarehouse = await prisma.scene.create({
    data: {
      siteId: siteA.id,
      sceneCode: 'warehouse',
      sceneName: '仓库',
      status: 'ENABLED',
      remark: '演示场景 仓库',
    },
  });

  const raw1 = await prisma.dataAsset.create({
    data: {
      siteId: siteA.id,
      sceneId: sceneWarehouse.id,
      dataType: 'RAW',
      dataName: '仓库原始数据-01',
      status: 'READY',
      progress: 100,
      storagePath: '/data/raw/warehouse-01.zip',
      fileName: 'warehouse-01.zip',
      fileSize: 1024 * 1024 * 2,
      operatorId: 'demo-user',
      operatorName: '演示用户',
    },
  });

  const pointCloud1 = await prisma.dataAsset.create({
    data: {
      siteId: siteA.id,
      sceneId: sceneWarehouse.id,
      dataType: 'POINT_CLOUD',
      dataName: '仓库点云数据-01',
      status: 'READY',
      progress: 100,
      sourceDataId: raw1.id,
      storagePath: '/data/point-cloud/warehouse-01.pcd',
      fileName: 'warehouse-01.pcd',
      fileSize: 1024 * 1024 * 8,
      operatorId: 'demo-user',
      operatorName: '演示用户',
    },
  });

  const gaussian1 = await prisma.dataAsset.create({
    data: {
      siteId: siteA.id,
      sceneId: sceneWarehouse.id,
      dataType: 'GAUSSIAN',
      dataName: '仓库高斯数据-01',
      status: 'READY',
      progress: 100,
      sourceDataId: pointCloud1.id,
      storagePath: '/data/gaussian/warehouse-01.gaussian',
      fileName: 'warehouse-01.gaussian',
      fileSize: 1024 * 1024 * 5,
      operatorId: 'demo-user',
      operatorName: '演示用户',
    },
  });

  const map2d1 = await prisma.dataAsset.create({
    data: {
      siteId: siteA.id,
      sceneId: sceneWarehouse.id,
      dataType: 'MAP_2D',
      dataName: '仓库2D数据-01',
      status: 'READY',
      progress: 100,
      sourceDataId: pointCloud1.id,
      storagePath: '/data/map2d/warehouse-01.png',
      fileName: 'warehouse-01.png',
      fileSize: 1024 * 512,
      operatorId: 'demo-user',
      operatorName: '演示用户',
    },
  });

  const map3d1 = await prisma.dataAsset.create({
    data: {
      siteId: siteA.id,
      sceneId: sceneWarehouse.id,
      dataType: 'MAP_3D',
      dataName: '仓库3D数据-01',
      status: 'PROCESSING',
      progress: 45,
      sourceDataId: pointCloud1.id,
      operatorId: 'demo-user',
      operatorName: '演示用户',
    },
  });

  const task1 = await prisma.processTask.create({
    data: {
      siteId: siteA.id,
      sceneId: sceneWarehouse.id,
      taskType: 'UPLOAD_RAW',
      taskTitle: '仓库原始数据上传任务',
      sourceDataId: raw1.id,
      targetDataId: raw1.id,
      status: 'SUCCESS',
      progress: 100,
      operatorId: 'demo-user',
      operatorName: '演示用户',
      startedAt: new Date('2026-03-25T14:00:00Z'),
      finishedAt: new Date('2026-03-25T14:05:00Z'),
    },
  });

  const task2 = await prisma.processTask.create({
    data: {
      siteId: siteA.id,
      sceneId: sceneWarehouse.id,
      taskType: 'GENERATE_POINT_CLOUD',
      taskTitle: '仓库点云生成任务',
      sourceDataId: raw1.id,
      targetDataId: pointCloud1.id,
      status: 'SUCCESS',
      progress: 100,
      operatorId: 'demo-user',
      operatorName: '演示用户',
      startedAt: new Date('2026-03-25T14:06:00Z'),
      finishedAt: new Date('2026-03-25T14:10:00Z'),
    },
  });

  const task3 = await prisma.processTask.create({
    data: {
      siteId: siteA.id,
      sceneId: sceneWarehouse.id,
      taskType: 'GENERATE_GAUSSIAN',
      taskTitle: '仓库高斯生成任务',
      sourceDataId: pointCloud1.id,
      targetDataId: gaussian1.id,
      status: 'SUCCESS',
      progress: 100,
      operatorId: 'demo-user',
      operatorName: '演示用户',
      startedAt: new Date('2026-03-25T14:11:00Z'),
      finishedAt: new Date('2026-03-25T14:18:00Z'),
    },
  });

  const task4 = await prisma.processTask.create({
    data: {
      siteId: siteA.id,
      sceneId: sceneWarehouse.id,
      taskType: 'GENERATE_3D',
      taskTitle: '仓库3D生成任务',
      sourceDataId: pointCloud1.id,
      targetDataId: map3d1.id,
      status: 'RUNNING',
      progress: 45,
      operatorId: 'demo-user',
      operatorName: '演示用户',
      startedAt: new Date('2026-03-26T01:00:00Z'),
    },
  });

  await prisma.dataAsset.update({
    where: { id: raw1.id },
    data: { currentTaskId: task2.id },
  });

  await prisma.dataAsset.update({
    where: { id: pointCloud1.id },
    data: { currentTaskId: task4.id },
  });

  await prisma.dataAsset.update({
    where: { id: gaussian1.id },
    data: { currentTaskId: task3.id },
  });

  await prisma.dataAsset.update({
    where: { id: map3d1.id },
    data: { currentTaskId: task4.id },
  });

  await prisma.operationLog.createMany({
    data: [
      {
        siteId: siteA.id,
        sceneId: sceneWarehouse.id,
        dataId: raw1.id,
        taskId: task1.id,
        operationType: 'UPLOAD_RAW',
        operationDesc: '上传原始数据成功',
        status: 'SUCCESS',
        operatorId: 'demo-user',
        operatorName: '演示用户',
        createdAt: new Date('2026-03-25T14:05:00Z'),
      },
      {
        siteId: siteA.id,
        sceneId: sceneWarehouse.id,
        dataId: pointCloud1.id,
        taskId: task2.id,
        operationType: 'GENERATE_POINT_CLOUD',
        operationDesc: '点云生成完成',
        status: 'SUCCESS',
        operatorId: 'demo-user',
        operatorName: '演示用户',
        createdAt: new Date('2026-03-25T14:10:00Z'),
      },
      {
        siteId: siteA.id,
        sceneId: sceneWarehouse.id,
        dataId: gaussian1.id,
        taskId: task3.id,
        operationType: 'GENERATE_GAUSSIAN',
        operationDesc: '高斯生成完成',
        status: 'SUCCESS',
        operatorId: 'demo-user',
        operatorName: '演示用户',
        createdAt: new Date('2026-03-25T14:18:00Z'),
      },
      {
        siteId: siteA.id,
        sceneId: sceneWarehouse.id,
        dataId: map3d1.id,
        taskId: task4.id,
        operationType: 'GENERATE_3D',
        operationDesc: '3D 生成中',
        status: 'PROCESSING',
        operatorId: 'demo-user',
        operatorName: '演示用户',
        createdAt: new Date('2026-03-26T01:10:00Z'),
      },
    ],
  });

  console.log('Seed completed.');
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
