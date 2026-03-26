-- 3D 高斯场景管理
-- SQLite schema for plan A
-- First version: 5 core tables
-- site / scene / dataAsset / processTask / operationLog
-- No dataRelation table in v1
-- data lineage is represented by dataAsset.sourceDataId

PRAGMA foreign_keys = ON;

BEGIN TRANSACTION;

CREATE TABLE IF NOT EXISTS site (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  siteCode TEXT NOT NULL,
  siteName TEXT NOT NULL,
  status INTEGER NOT NULL DEFAULT 1 CHECK (status IN (0, 1)),
  remark TEXT,
  createdAt TEXT NOT NULL DEFAULT (datetime('now')),
  updatedAt TEXT NOT NULL DEFAULT (datetime('now')),
  UNIQUE(siteCode)
);

CREATE TABLE IF NOT EXISTS scene (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  siteId INTEGER NOT NULL,
  sceneCode TEXT NOT NULL,
  sceneName TEXT NOT NULL,
  status INTEGER NOT NULL DEFAULT 1 CHECK (status IN (0, 1)),
  remark TEXT,
  createdAt TEXT NOT NULL DEFAULT (datetime('now')),
  updatedAt TEXT NOT NULL DEFAULT (datetime('now')),
  UNIQUE(siteId, sceneCode),
  FOREIGN KEY (siteId) REFERENCES site(id)
);

CREATE TABLE IF NOT EXISTS dataAsset (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  siteId INTEGER NOT NULL,
  sceneId INTEGER NOT NULL,
  dataType TEXT NOT NULL CHECK (
    dataType IN ('raw', 'point_cloud', 'gaussian', 'map_2d', 'map_3d')
  ),
  dataName TEXT NOT NULL,
  status TEXT NOT NULL CHECK (
    status IN ('uploading', 'queued', 'processing', 'ready', 'failed', 'deleted')
  ),
  progress INTEGER NOT NULL DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
  sourceDataId INTEGER,
  currentTaskId INTEGER,
  storagePath TEXT,
  fileName TEXT,
  fileSize INTEGER,
  fileHash TEXT,
  metadataJson TEXT,
  operatorId TEXT,
  operatorName TEXT,
  createdAt TEXT NOT NULL DEFAULT (datetime('now')),
  updatedAt TEXT NOT NULL DEFAULT (datetime('now')),
  deletedAt TEXT,
  FOREIGN KEY (siteId) REFERENCES site(id),
  FOREIGN KEY (sceneId) REFERENCES scene(id),
  FOREIGN KEY (sourceDataId) REFERENCES dataAsset(id)
);

CREATE TABLE IF NOT EXISTS processTask (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  siteId INTEGER NOT NULL,
  sceneId INTEGER NOT NULL,
  taskType TEXT NOT NULL CHECK (
    taskType IN (
      'upload_raw',
      'generate_point_cloud',
      'generate_2d',
      'generate_3d',
      'generate_gaussian'
    )
  ),
  taskTitle TEXT,
  sourceDataId INTEGER,
  targetDataId INTEGER,
  status TEXT NOT NULL CHECK (
    status IN ('queued', 'running', 'success', 'failed', 'canceled')
  ),
  progress INTEGER NOT NULL DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
  paramsJson TEXT,
  resultJson TEXT,
  errorCode TEXT,
  errorMessage TEXT,
  operatorId TEXT,
  operatorName TEXT,
  createdAt TEXT NOT NULL DEFAULT (datetime('now')),
  startedAt TEXT,
  finishedAt TEXT,
  updatedAt TEXT NOT NULL DEFAULT (datetime('now')),
  FOREIGN KEY (siteId) REFERENCES site(id),
  FOREIGN KEY (sceneId) REFERENCES scene(id),
  FOREIGN KEY (sourceDataId) REFERENCES dataAsset(id),
  FOREIGN KEY (targetDataId) REFERENCES dataAsset(id)
);

CREATE TABLE IF NOT EXISTS operationLog (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  siteId INTEGER NOT NULL,
  sceneId INTEGER NOT NULL,
  dataId INTEGER,
  taskId INTEGER,
  operationType TEXT NOT NULL CHECK (
    operationType IN (
      'upload_raw',
      'generate_point_cloud',
      'generate_2d',
      'generate_3d',
      'generate_gaussian',
      'edit',
      'delete',
      'download',
      'view'
    )
  ),
  operationDesc TEXT,
  status TEXT NOT NULL CHECK (
    status IN ('success', 'processing', 'failed')
  ),
  operatorId TEXT,
  operatorName TEXT,
  createdAt TEXT NOT NULL DEFAULT (datetime('now')),
  FOREIGN KEY (siteId) REFERENCES site(id),
  FOREIGN KEY (sceneId) REFERENCES scene(id),
  FOREIGN KEY (dataId) REFERENCES dataAsset(id),
  FOREIGN KEY (taskId) REFERENCES processTask(id)
);

CREATE INDEX IF NOT EXISTS idx_scene_siteId
  ON scene(siteId);

CREATE INDEX IF NOT EXISTS idx_scene_status
  ON scene(status);

CREATE INDEX IF NOT EXISTS idx_dataAsset_siteId
  ON dataAsset(siteId);

CREATE INDEX IF NOT EXISTS idx_dataAsset_sceneId
  ON dataAsset(sceneId);

CREATE INDEX IF NOT EXISTS idx_dataAsset_dataType
  ON dataAsset(dataType);

CREATE INDEX IF NOT EXISTS idx_dataAsset_status
  ON dataAsset(status);

CREATE INDEX IF NOT EXISTS idx_dataAsset_sourceDataId
  ON dataAsset(sourceDataId);

CREATE INDEX IF NOT EXISTS idx_dataAsset_currentTaskId
  ON dataAsset(currentTaskId);

CREATE INDEX IF NOT EXISTS idx_dataAsset_createdAt
  ON dataAsset(createdAt);

CREATE INDEX IF NOT EXISTS idx_dataAsset_sceneId_dataType_status
  ON dataAsset(sceneId, dataType, status);

CREATE INDEX IF NOT EXISTS idx_processTask_siteId
  ON processTask(siteId);

CREATE INDEX IF NOT EXISTS idx_processTask_sceneId
  ON processTask(sceneId);

CREATE INDEX IF NOT EXISTS idx_processTask_taskType
  ON processTask(taskType);

CREATE INDEX IF NOT EXISTS idx_processTask_status
  ON processTask(status);

CREATE INDEX IF NOT EXISTS idx_processTask_sourceDataId
  ON processTask(sourceDataId);

CREATE INDEX IF NOT EXISTS idx_processTask_targetDataId
  ON processTask(targetDataId);

CREATE INDEX IF NOT EXISTS idx_processTask_createdAt
  ON processTask(createdAt);

CREATE INDEX IF NOT EXISTS idx_processTask_sceneId_status
  ON processTask(sceneId, status);

CREATE INDEX IF NOT EXISTS idx_operationLog_siteId
  ON operationLog(siteId);

CREATE INDEX IF NOT EXISTS idx_operationLog_sceneId
  ON operationLog(sceneId);

CREATE INDEX IF NOT EXISTS idx_operationLog_dataId
  ON operationLog(dataId);

CREATE INDEX IF NOT EXISTS idx_operationLog_taskId
  ON operationLog(taskId);

CREATE INDEX IF NOT EXISTS idx_operationLog_operationType
  ON operationLog(operationType);

CREATE INDEX IF NOT EXISTS idx_operationLog_status
  ON operationLog(status);

CREATE INDEX IF NOT EXISTS idx_operationLog_createdAt
  ON operationLog(createdAt);

CREATE INDEX IF NOT EXISTS idx_operationLog_sceneId_createdAt
  ON operationLog(sceneId, createdAt);

COMMIT;

-- Note:
-- currentTaskId is intentionally not declared as a foreign key in v1
-- to avoid circular dependency between dataAsset and processTask.
