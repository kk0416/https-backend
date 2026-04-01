function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function toIso(text) {
  return new Date(text).toISOString();
}

function createInitialState() {
  const sites = [
    { id: 1, siteCode: 'site-a', siteName: 'A 线' },
    { id: 2, siteCode: 'site-b', siteName: 'B 线' },
  ];

  const scenes = [
    { id: 1, siteId: 1, sceneCode: 'warehouse', sceneName: '仓库' },
    { id: 2, siteId: 2, sceneCode: 'production', sceneName: '产线' },
  ];

  const siteMap = new Map(sites.map((item) => [item.id, item]));
  const sceneMap = new Map(scenes.map((item) => [item.id, item]));

  const assets = [
    {
      id: 1,
      siteId: 1,
      sceneId: 1,
      dataType: 'raw',
      dataName: 'xx原始数据包-01',
      status: 'ready',
      progress: 100,
      sourceDataId: null,
      currentTaskId: 2,
      storagePath: '/data/raw/warehouse-01.zip',
      fileName: 'warehouse-01.zip',
      fileSize: 2097152,
      operatorId: 'demo-user',
      operatorName: 'xxx',
      createdAt: toIso('2026-03-19T13:40:00+08:00'),
      updatedAt: toIso('2026-03-19T14:05:00+08:00'),
      deletedAt: null,
    },
    {
      id: 2,
      siteId: 1,
      sceneId: 1,
      dataType: 'point_cloud',
      dataName: 'xx点云数据-01',
      status: 'ready',
      progress: 100,
      sourceDataId: 1,
      currentTaskId: 3,
      storagePath: '/data/point-cloud/warehouse-01.pcd',
      fileName: 'warehouse-01.pcd',
      fileSize: 8388608,
      operatorId: 'demo-user',
      operatorName: 'xxx',
      createdAt: toIso('2026-03-19T14:10:00+08:00'),
      updatedAt: toIso('2026-03-19T14:18:00+08:00'),
      deletedAt: null,
    },
    {
      id: 3,
      siteId: 1,
      sceneId: 1,
      dataType: 'gaussian',
      dataName: 'xx高斯地图-01',
      status: 'ready',
      progress: 100,
      sourceDataId: 2,
      currentTaskId: 3,
      storagePath: '/data/gaussian/warehouse-01.gaussian',
      fileName: 'warehouse-01.gaussian',
      fileSize: 5242880,
      operatorId: 'demo-user',
      operatorName: 'xxx',
      createdAt: toIso('2026-03-19T14:20:00+08:00'),
      updatedAt: toIso('2026-03-19T14:30:00+08:00'),
      deletedAt: null,
    },
    {
      id: 4,
      siteId: 1,
      sceneId: 1,
      dataType: 'map_2d',
      dataName: 'xx 2D 地图',
      status: 'processing',
      progress: 10,
      sourceDataId: 2,
      currentTaskId: 4,
      storagePath: null,
      fileName: null,
      fileSize: null,
      operatorId: 'demo-user',
      operatorName: 'xxx',
      createdAt: toIso('2026-03-19T14:32:00+08:00'),
      updatedAt: toIso('2026-03-19T14:40:00+08:00'),
      deletedAt: null,
    },
    {
      id: 5,
      siteId: 1,
      sceneId: 1,
      dataType: 'map_3d',
      dataName: 'xx 3D 地图',
      status: 'processing',
      progress: 10,
      sourceDataId: 2,
      currentTaskId: 5,
      storagePath: null,
      fileName: null,
      fileSize: null,
      operatorId: 'demo-user',
      operatorName: 'xxx',
      createdAt: toIso('2026-03-19T14:33:00+08:00'),
      updatedAt: toIso('2026-03-19T14:40:00+08:00'),
      deletedAt: null,
    },
    {
      id: 6,
      siteId: 2,
      sceneId: 2,
      dataType: 'raw',
      dataName: 'xx原始数据包-02',
      status: 'ready',
      progress: 100,
      sourceDataId: null,
      currentTaskId: 7,
      storagePath: '/data/raw/production-01.zip',
      fileName: 'production-01.zip',
      fileSize: 3145728,
      operatorId: 'demo-user',
      operatorName: 'xxx',
      createdAt: toIso('2026-03-19T13:40:00+08:00'),
      updatedAt: toIso('2026-03-19T14:05:00+08:00'),
      deletedAt: null,
    },
    {
      id: 7,
      siteId: 2,
      sceneId: 2,
      dataType: 'point_cloud',
      dataName: 'xx点云数据-02',
      status: 'ready',
      progress: 100,
      sourceDataId: 6,
      currentTaskId: 7,
      storagePath: '/data/point-cloud/production-01.pcd',
      fileName: 'production-01.pcd',
      fileSize: 9437184,
      operatorId: 'demo-user',
      operatorName: 'xxx',
      createdAt: toIso('2026-03-19T14:10:00+08:00'),
      updatedAt: toIso('2026-03-19T14:18:00+08:00'),
      deletedAt: null,
    },
    {
      id: 8,
      siteId: 2,
      sceneId: 2,
      dataType: 'gaussian',
      dataName: 'xx高斯地图-02',
      status: 'processing',
      progress: 10,
      sourceDataId: 7,
      currentTaskId: 8,
      storagePath: null,
      fileName: null,
      fileSize: null,
      operatorId: 'demo-user',
      operatorName: 'xxx',
      createdAt: toIso('2026-03-19T14:20:00+08:00'),
      updatedAt: toIso('2026-03-19T14:40:00+08:00'),
      deletedAt: null,
    },
    {
      id: 9,
      siteId: 2,
      sceneId: 2,
      dataType: 'map_2d',
      dataName: 'xx地图',
      status: 'processing',
      progress: 20,
      sourceDataId: 7,
      currentTaskId: 9,
      storagePath: null,
      fileName: null,
      fileSize: null,
      operatorId: 'demo-user',
      operatorName: 'xxx',
      createdAt: toIso('2026-03-19T14:28:00+08:00'),
      updatedAt: toIso('2026-03-19T14:40:00+08:00'),
      deletedAt: null,
    },
    {
      id: 10,
      siteId: 2,
      sceneId: 2,
      dataType: 'map_3d',
      dataName: 'xx 3D 地图',
      status: 'uploading',
      progress: 10,
      sourceDataId: 7,
      currentTaskId: 10,
      storagePath: null,
      fileName: null,
      fileSize: null,
      operatorId: 'demo-user',
      operatorName: 'xxx',
      createdAt: toIso('2026-03-19T14:29:00+08:00'),
      updatedAt: toIso('2026-03-19T14:40:00+08:00'),
      deletedAt: null,
    },
  ].map((item) => ({
    ...item,
    siteName: siteMap.get(item.siteId)?.siteName ?? '-',
    sceneName: sceneMap.get(item.sceneId)?.sceneName ?? '-',
  }));

  const tasks = [
    {
      id: 1,
      siteId: 1,
      sceneId: 1,
      taskType: 'upload_raw',
      taskTitle: 'xx原始数据上传任务',
      sourceDataId: 1,
      targetDataId: 1,
      status: 'success',
      progress: 100,
      operatorId: 'demo-user',
      operatorName: 'xxx',
      createdAt: toIso('2026-03-19T13:40:00+08:00'),
      startedAt: toIso('2026-03-19T13:40:00+08:00'),
      finishedAt: toIso('2026-03-19T14:00:00+08:00'),
      updatedAt: toIso('2026-03-19T14:00:00+08:00'),
    },
    {
      id: 2,
      siteId: 1,
      sceneId: 1,
      taskType: 'generate_point_cloud',
      taskTitle: 'xx点云生成任务',
      sourceDataId: 1,
      targetDataId: 2,
      status: 'success',
      progress: 100,
      operatorId: 'demo-user',
      operatorName: 'xxx',
      createdAt: toIso('2026-03-19T14:00:00+08:00'),
      startedAt: toIso('2026-03-19T14:00:00+08:00'),
      finishedAt: toIso('2026-03-19T14:10:00+08:00'),
      updatedAt: toIso('2026-03-19T14:10:00+08:00'),
    },
    {
      id: 3,
      siteId: 1,
      sceneId: 1,
      taskType: 'generate_gaussian',
      taskTitle: 'xx高斯生成任务',
      sourceDataId: 2,
      targetDataId: 3,
      status: 'success',
      progress: 100,
      operatorId: 'demo-user',
      operatorName: 'xxx',
      createdAt: toIso('2026-03-19T14:10:00+08:00'),
      startedAt: toIso('2026-03-19T14:10:00+08:00'),
      finishedAt: toIso('2026-03-19T14:20:00+08:00'),
      updatedAt: toIso('2026-03-19T14:20:00+08:00'),
    },
    {
      id: 4,
      siteId: 1,
      sceneId: 1,
      taskType: 'generate_2d',
      taskTitle: 'xx 2D 地图生成任务',
      sourceDataId: 2,
      targetDataId: 4,
      status: 'running',
      progress: 10,
      operatorId: 'demo-user',
      operatorName: 'xxx',
      createdAt: toIso('2026-03-19T14:30:00+08:00'),
      startedAt: toIso('2026-03-19T14:30:00+08:00'),
      finishedAt: null,
      updatedAt: toIso('2026-03-19T14:40:00+08:00'),
    },
    {
      id: 5,
      siteId: 1,
      sceneId: 1,
      taskType: 'generate_3d',
      taskTitle: 'xx 3D 地图生成任务',
      sourceDataId: 2,
      targetDataId: 5,
      status: 'running',
      progress: 10,
      operatorId: 'demo-user',
      operatorName: 'xxx',
      createdAt: toIso('2026-03-19T14:30:00+08:00'),
      startedAt: toIso('2026-03-19T14:31:00+08:00'),
      finishedAt: null,
      updatedAt: toIso('2026-03-19T14:40:00+08:00'),
    },
    {
      id: 6,
      siteId: 2,
      sceneId: 2,
      taskType: 'upload_raw',
      taskTitle: '产线原始数据上传任务',
      sourceDataId: 6,
      targetDataId: 6,
      status: 'success',
      progress: 100,
      operatorId: 'demo-user',
      operatorName: 'xxx',
      createdAt: toIso('2026-03-19T13:40:00+08:00'),
      startedAt: toIso('2026-03-19T13:40:00+08:00'),
      finishedAt: toIso('2026-03-19T14:00:00+08:00'),
      updatedAt: toIso('2026-03-19T14:00:00+08:00'),
    },
    {
      id: 7,
      siteId: 2,
      sceneId: 2,
      taskType: 'generate_point_cloud',
      taskTitle: '产线点云生成任务',
      sourceDataId: 6,
      targetDataId: 7,
      status: 'success',
      progress: 100,
      operatorId: 'demo-user',
      operatorName: 'xxx',
      createdAt: toIso('2026-03-19T14:00:00+08:00'),
      startedAt: toIso('2026-03-19T14:00:00+08:00'),
      finishedAt: toIso('2026-03-19T14:12:00+08:00'),
      updatedAt: toIso('2026-03-19T14:12:00+08:00'),
    },
    {
      id: 8,
      siteId: 2,
      sceneId: 2,
      taskType: 'generate_gaussian',
      taskTitle: '产线高斯生成任务',
      sourceDataId: 7,
      targetDataId: 8,
      status: 'running',
      progress: 10,
      operatorId: 'demo-user',
      operatorName: 'xxx',
      createdAt: toIso('2026-03-19T14:20:00+08:00'),
      startedAt: toIso('2026-03-19T14:22:00+08:00'),
      finishedAt: null,
      updatedAt: toIso('2026-03-19T14:40:00+08:00'),
    },
    {
      id: 9,
      siteId: 2,
      sceneId: 2,
      taskType: 'generate_2d',
      taskTitle: '产线 2D 地图生成任务',
      sourceDataId: 7,
      targetDataId: 9,
      status: 'running',
      progress: 20,
      operatorId: 'demo-user',
      operatorName: 'xxx',
      createdAt: toIso('2026-03-19T14:24:00+08:00'),
      startedAt: toIso('2026-03-19T14:25:00+08:00'),
      finishedAt: null,
      updatedAt: toIso('2026-03-19T14:40:00+08:00'),
    },
    {
      id: 10,
      siteId: 2,
      sceneId: 2,
      taskType: 'generate_3d',
      taskTitle: '产线 3D 地图生成任务',
      sourceDataId: 7,
      targetDataId: 10,
      status: 'queued',
      progress: 10,
      operatorId: 'demo-user',
      operatorName: 'xxx',
      createdAt: toIso('2026-03-19T14:29:00+08:00'),
      startedAt: null,
      finishedAt: null,
      updatedAt: toIso('2026-03-19T14:40:00+08:00'),
    },
  ].map((item) => {
    const source = assets.find((asset) => asset.id === item.sourceDataId);
    const target = assets.find((asset) => asset.id === item.targetDataId);

    return {
      ...item,
      siteName: siteMap.get(item.siteId)?.siteName ?? '-',
      sceneName: sceneMap.get(item.sceneId)?.sceneName ?? '-',
      sourceDataName: source?.dataName ?? null,
      targetDataName: target?.dataName ?? null,
      errorCode: null,
      errorMessage: null,
    };
  });

  return {
    sites,
    scenes,
    assets,
    tasks,
    nextAssetId: 11,
    nextTaskId: 11,
  };
}

let mockState = createInitialState();

function findScene(siteId, sceneId) {
  return mockState.scenes.find((item) => item.siteId === siteId && item.id === sceneId);
}

function nowIso() {
  return new Date().toISOString();
}

function parseOptionalInt(value) {
  if (value === undefined || value === null || String(value).trim() === '') {
    return undefined;
  }

  const parsed = Number.parseInt(String(value), 10);
  return Number.isNaN(parsed) ? undefined : parsed;
}

function toPositiveInt(value, fallback) {
  const parsed = parseOptionalInt(value);
  if (!parsed || parsed <= 0) {
    return fallback;
  }

  return parsed;
}

function ok(data, message = 'ok') {
  return {
    code: 0,
    message,
    data,
  };
}

function errorPayload(code, message, path) {
  return {
    code,
    message,
    data: {
      path,
      timestamp: nowIso(),
    },
  };
}

function buildResponse({ status = 200, statusText = 'OK', url, payload, durationMs }) {
  return {
    ok: status >= 200 && status < 300,
    status,
    statusText,
    url,
    durationMs,
    data: payload,
    rawText: JSON.stringify(payload, null, 2),
  };
}

function withFilter(items, query, extraPredicate = () => true) {
  const siteId = parseOptionalInt(query?.siteId);
  const sceneId = parseOptionalInt(query?.sceneId);
  const status = query?.status ? String(query.status).trim().toLowerCase() : '';

  return items.filter((item) => {
    if (siteId && item.siteId !== siteId) {
      return false;
    }

    if (sceneId && item.sceneId !== sceneId) {
      return false;
    }

    if (status && item.status !== status) {
      return false;
    }

    return extraPredicate(item);
  });
}

function queryAssets(query = {}) {
  const dataType = query?.dataType ? String(query.dataType).trim().toLowerCase() : '';

  return withFilter(mockState.assets, query, (item) => {
    if (dataType && item.dataType !== dataType) {
      return false;
    }

    return true;
  });
}

function listAssets(query = {}) {
  const page = toPositiveInt(query.page, 1);
  const pageSize = toPositiveInt(query.pageSize, 20);
  const filtered = queryAssets(query).sort(
    (left, right) => new Date(right.createdAt).getTime() - new Date(left.createdAt).getTime(),
  );
  const start = (page - 1) * pageSize;

  return {
    list: clone(filtered.slice(start, start + pageSize)),
    page,
    pageSize,
    total: filtered.length,
  };
}

function listTasks(query = {}) {
  const page = toPositiveInt(query.page, 1);
  const pageSize = toPositiveInt(query.pageSize, 20);
  const filtered = withFilter(mockState.tasks, query).sort(
    (left, right) => new Date(right.createdAt).getTime() - new Date(left.createdAt).getTime(),
  );
  const start = (page - 1) * pageSize;

  return {
    list: clone(filtered.slice(start, start + pageSize)),
    page,
    pageSize,
    total: filtered.length,
  };
}

function buildSummary(query = {}) {
  const assets = queryAssets(query);
  const tasks = withFilter(mockState.tasks, query);

  return {
    rawCount: assets.filter((item) => item.dataType === 'raw').length,
    pointCloudCount: assets.filter((item) => item.dataType === 'point_cloud').length,
    gaussianCount: assets.filter((item) => item.dataType === 'gaussian').length,
    map2dCount: assets.filter((item) => item.dataType === 'map_2d').length,
    map3dCount: assets.filter((item) => item.dataType === 'map_3d').length,
    totalTaskCount: tasks.length,
    runningTaskCount: tasks.filter((item) => item.status === 'running').length,
  };
}

function buildTree(query = {}) {
  const assets = queryAssets(query).sort(
    (left, right) => new Date(left.createdAt).getTime() - new Date(right.createdAt).getTime(),
  );
  const map = new Map();

  for (const asset of assets) {
    map.set(asset.id, {
      id: asset.id,
      dataName: asset.dataName,
      dataType: asset.dataType,
      status: asset.status,
      progress: asset.progress,
      sourceDataId: asset.sourceDataId,
      children: [],
    });
  }

  const roots = [];

  for (const asset of assets) {
    const node = map.get(asset.id);
    if (asset.sourceDataId && map.has(asset.sourceDataId)) {
      map.get(asset.sourceDataId).children.push(node);
    } else {
      roots.push(node);
    }
  }

  return roots;
}

function buildGraph(query = {}) {
  const assets = queryAssets(query).sort(
    (left, right) => new Date(left.createdAt).getTime() - new Date(right.createdAt).getTime(),
  );
  const ids = new Set(assets.map((item) => item.id));

  return {
    nodes: assets.map((item) => ({
      id: item.id,
      label: item.dataName,
      dataType: item.dataType,
      status: item.status,
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

function buildUploadOptions() {
  return {
    sites: mockState.sites.map((site) => ({
      id: site.id,
      siteCode: site.siteCode,
      siteName: site.siteName,
      scenes: mockState.scenes
        .filter((scene) => scene.siteId === site.id)
        .map((scene) => ({
          id: scene.id,
          sceneCode: scene.sceneCode,
          sceneName: scene.sceneName,
        })),
    })),
  };
}

function createRawUpload(body, path) {
  if (!(body instanceof FormData)) {
    return {
      status: 400,
      statusText: 'Bad Request',
      payload: errorPayload(400, 'form data is required', path),
    };
  }

  const file = body.get('file');
  const siteId = parseOptionalInt(body.get('siteId'));
  const sceneId = parseOptionalInt(body.get('sceneId'));
  const dataName = String(body.get('dataName') ?? '').trim();

  if (!(file instanceof File)) {
    return {
      status: 400,
      statusText: 'Bad Request',
      payload: errorPayload(400, 'file is required', path),
    };
  }

  if (!siteId) {
    return {
      status: 400,
      statusText: 'Bad Request',
      payload: errorPayload(400, 'invalid site id', path),
    };
  }

  if (!sceneId) {
    return {
      status: 400,
      statusText: 'Bad Request',
      payload: errorPayload(400, 'invalid scene id', path),
    };
  }

  const site = mockState.sites.find((item) => item.id === siteId);
  const scene = mockState.scenes.find((item) => item.id === sceneId);
  if (!site || !scene || scene.siteId !== site.id) {
    return {
      status: 400,
      statusText: 'Bad Request',
      payload: errorPayload(400, 'scene does not belong to the selected site', path),
    };
  }

  const timestamp = nowIso();
  const normalizedDataName = dataName || String(file.name).replace(/\.[^.]+$/, '');
  const storagePath = `data/uploads/raw/${site.id}/${scene.id}/${file.name}`.replace(/\\/g, '/');
  const absolutePath = `D:\\mock-data\\uploads\\raw\\${site.id}\\${scene.id}\\${file.name}`;

  if (mockState.assets.some((item) => item.storagePath === storagePath)) {
    return {
      status: 400,
      statusText: 'Bad Request',
      payload: errorPayload(400, 'file already exists in target directory', path),
    };
  }

  const assetId = mockState.nextAssetId++;
  const taskId = mockState.nextTaskId++;

  const asset = {
    id: assetId,
    siteId: site.id,
    siteName: site.siteName,
    sceneId: scene.id,
    sceneName: scene.sceneName,
    dataType: 'raw',
    dataName: normalizedDataName,
    status: 'ready',
    progress: 100,
    sourceDataId: null,
    currentTaskId: taskId,
    storagePath,
    fileName: file.name,
    fileSize: file.size,
    fileHash: `mock-${assetId}`,
    operatorId: 'manual-upload',
    operatorName: '前端上传',
    createdAt: timestamp,
    updatedAt: timestamp,
    deletedAt: null,
  };

  const task = {
    id: taskId,
    siteId: site.id,
    siteName: site.siteName,
    sceneId: scene.id,
    sceneName: scene.sceneName,
    taskType: 'upload_raw',
    taskTitle: `${normalizedDataName} 上传任务`,
    sourceDataId: asset.id,
    sourceDataName: asset.dataName,
    targetDataId: asset.id,
    targetDataName: asset.dataName,
    status: 'success',
    progress: 100,
    errorCode: null,
    errorMessage: null,
    operatorId: 'manual-upload',
    operatorName: '前端上传',
    createdAt: timestamp,
    startedAt: timestamp,
    finishedAt: timestamp,
    updatedAt: timestamp,
  };

  mockState.assets.push(asset);
  mockState.tasks.push(task);

  return {
    status: 200,
    statusText: 'OK',
    payload: ok({
      assetId,
      taskId,
      dataName: asset.dataName,
      fileName: asset.fileName,
      fileSize: asset.fileSize,
      storagePath: asset.storagePath,
      absolutePath,
      status: asset.status,
    }),
  };
}

function createPointCloudTask(assetId, path) {
  const id = parseOptionalInt(assetId);

  if (!id) {
    return {
      status: 400,
      statusText: 'Bad Request',
      payload: errorPayload(400, 'invalid data asset id', path),
    };
  }

  const source = mockState.assets.find((item) => item.id === id);
  if (!source) {
    return {
      status: 404,
      statusText: 'Not Found',
      payload: errorPayload(404, 'data asset not found', path),
    };
  }

  if (source.dataType !== 'raw') {
    return {
      status: 400,
      statusText: 'Bad Request',
      payload: errorPayload(400, 'only raw data can generate point cloud', path),
    };
  }

  if (source.status === 'deleted') {
    return {
      status: 400,
      statusText: 'Bad Request',
      payload: errorPayload(400, 'deleted data cannot create tasks', path),
    };
  }

  const timestamp = nowIso();
  const scene = findScene(source.siteId, source.sceneId);
  const taskId = mockState.nextTaskId++;
  const targetId = mockState.nextAssetId++;

  const target = {
    id: targetId,
    siteId: source.siteId,
    siteName: source.siteName,
    sceneId: source.sceneId,
    sceneName: scene?.sceneName ?? source.sceneName,
    dataType: 'point_cloud',
    dataName: `${source.dataName}-point-cloud-mock`,
    status: 'queued',
    progress: 0,
    sourceDataId: source.id,
    currentTaskId: taskId,
    storagePath: null,
    fileName: null,
    fileSize: null,
    operatorId: source.operatorId ?? 'system',
    operatorName: source.operatorName ?? 'system',
    createdAt: timestamp,
    updatedAt: timestamp,
    deletedAt: null,
  };

  const task = {
    id: taskId,
    siteId: source.siteId,
    siteName: source.siteName,
    sceneId: source.sceneId,
    sceneName: scene?.sceneName ?? source.sceneName,
    taskType: 'generate_point_cloud',
    taskTitle: `${source.dataName} 点云生成任务`,
    sourceDataId: source.id,
    sourceDataName: source.dataName,
    targetDataId: targetId,
    targetDataName: target.dataName,
    status: 'queued',
    progress: 0,
    errorCode: null,
    errorMessage: null,
    operatorId: source.operatorId ?? 'system',
    operatorName: source.operatorName ?? 'system',
    createdAt: timestamp,
    startedAt: null,
    finishedAt: null,
    updatedAt: timestamp,
  };

  source.currentTaskId = taskId;
  source.updatedAt = timestamp;
  mockState.assets.push(target);
  mockState.tasks.push(task);

  return {
    status: 200,
    statusText: 'OK',
    payload: ok({
      taskId,
      targetDataId: targetId,
      status: task.status,
    }),
  };
}

async function simulateLatency() {
  const delay = 140 + Math.round(Math.random() * 160);
  await new Promise((resolve) => setTimeout(resolve, delay));
}

export function resetMockState() {
  mockState = createInitialState();
}

export async function mockRequest({ method, path, query, body, url }) {
  const startedAt = performance.now();
  await simulateLatency();

  let result;

  if (method === 'GET' && path === '/health') {
    result = {
      status: 200,
      statusText: 'OK',
      payload: ok({
        service: 'gaussian-backend-demo',
        status: 'running',
        source: 'mock',
      }),
    };
  } else if (method === 'GET' && (path === '/dashboard/data-summary' || path === '/data-summary')) {
    result = {
      status: 200,
      statusText: 'OK',
      payload: ok(buildSummary(query)),
    };
  } else if (method === 'GET' && path === '/data-assets/upload-options') {
    result = {
      status: 200,
      statusText: 'OK',
      payload: ok(buildUploadOptions()),
    };
  } else if (method === 'GET' && path === '/data-assets') {
    result = {
      status: 200,
      statusText: 'OK',
      payload: ok(listAssets(query)),
    };
  } else if (method === 'GET' && path === '/data-assets/tree') {
    result = {
      status: 200,
      statusText: 'OK',
      payload: ok(buildTree(query)),
    };
  } else if (method === 'GET' && path === '/data-assets/graph') {
    result = {
      status: 200,
      statusText: 'OK',
      payload: ok(buildGraph(query)),
    };
  } else if (method === 'GET' && path === '/tasks') {
    result = {
      status: 200,
      statusText: 'OK',
      payload: ok(listTasks(query)),
    };
  } else if (method === 'POST' && path === '/data-assets/upload-raw') {
    result = createRawUpload(body, path);
  } else if (method === 'POST' && /^\/data-assets\/[^/]+\/generate-point-cloud$/.test(path)) {
    const [, assetId] = path.match(/^\/data-assets\/([^/]+)\/generate-point-cloud$/) || [];
    result = createPointCloudTask(assetId, path);
  } else {
    result = {
      status: 404,
      statusText: 'Not Found',
      payload: errorPayload(404, 'mock route not found', path),
    };
  }

  return buildResponse({
    status: result.status,
    statusText: result.statusText,
    url,
    payload: result.payload,
    durationMs: Math.round(performance.now() - startedAt),
  });
}
