-- 3D 高斯场景管理
-- Recommended schema based on current UI designs
-- Assumption: MySQL 8.x / InnoDB / utf8mb4

CREATE DATABASE IF NOT EXISTS roboshop_3d_scene
  DEFAULT CHARACTER SET utf8mb4
  DEFAULT COLLATE utf8mb4_0900_ai_ci;

USE roboshop_3d_scene;

CREATE TABLE IF NOT EXISTS site (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT 'PK',
  siteCode VARCHAR(64) NOT NULL COMMENT '现场编码',
  siteName VARCHAR(128) NOT NULL COMMENT '现场名称',
  status TINYINT NOT NULL DEFAULT 1 COMMENT '状态: 1启用 0停用',
  remark VARCHAR(255) NULL COMMENT '备注',
  createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  updatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (id),
  UNIQUE KEY uk_site_siteCode (siteCode),
  KEY idx_site_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='现场表';

CREATE TABLE IF NOT EXISTS scene (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT 'PK',
  siteId BIGINT UNSIGNED NOT NULL COMMENT '现场ID',
  sceneCode VARCHAR(64) NOT NULL COMMENT '场景编码',
  sceneName VARCHAR(128) NOT NULL COMMENT '场景名称',
  status TINYINT NOT NULL DEFAULT 1 COMMENT '状态: 1启用 0停用',
  remark VARCHAR(255) NULL COMMENT '备注',
  createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  updatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (id),
  UNIQUE KEY uk_scene_siteId_sceneCode (siteId, sceneCode),
  KEY idx_scene_siteId (siteId),
  KEY idx_scene_status (status),
  CONSTRAINT fk_scene_siteId
    FOREIGN KEY (siteId) REFERENCES site(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='场景表';

CREATE TABLE IF NOT EXISTS dataAsset (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT 'PK',
  siteId BIGINT UNSIGNED NOT NULL COMMENT '现场ID',
  sceneId BIGINT UNSIGNED NOT NULL COMMENT '场景ID',
  dataType VARCHAR(32) NOT NULL COMMENT '数据类型: raw/pointCloud/gaussian/map2d/map3d',
  dataName VARCHAR(128) NOT NULL COMMENT '数据名称',
  status VARCHAR(32) NOT NULL COMMENT '状态: uploading/queued/processing/ready/failed/deleted',
  progress TINYINT UNSIGNED NOT NULL DEFAULT 0 COMMENT '进度 0-100',
  sourceDataId BIGINT UNSIGNED NULL COMMENT '来源数据ID, 简化血缘关系',
  currentTaskId BIGINT UNSIGNED NULL COMMENT '当前关联任务ID',
  storagePath VARCHAR(512) NULL COMMENT '存储路径',
  fileName VARCHAR(255) NULL COMMENT '文件名',
  fileSize BIGINT UNSIGNED NULL COMMENT '文件大小(字节)',
  fileHash VARCHAR(128) NULL COMMENT '文件Hash',
  metadataJson JSON NULL COMMENT '扩展元数据',
  operatorId BIGINT UNSIGNED NULL COMMENT '最后操作人ID',
  createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  updatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  deletedAt DATETIME NULL COMMENT '逻辑删除时间',
  PRIMARY KEY (id),
  KEY idx_dataAsset_siteId (siteId),
  KEY idx_dataAsset_sceneId (sceneId),
  KEY idx_dataAsset_dataType (dataType),
  KEY idx_dataAsset_status (status),
  KEY idx_dataAsset_sourceDataId (sourceDataId),
  KEY idx_dataAsset_currentTaskId (currentTaskId),
  KEY idx_dataAsset_operatorId (operatorId),
  KEY idx_dataAsset_createdAt (createdAt),
  KEY idx_dataAsset_sceneId_dataType_status (sceneId, dataType, status),
  KEY idx_dataAsset_siteId_sceneId (siteId, sceneId),
  CONSTRAINT fk_dataAsset_siteId
    FOREIGN KEY (siteId) REFERENCES site(id),
  CONSTRAINT fk_dataAsset_sceneId
    FOREIGN KEY (sceneId) REFERENCES scene(id),
  CONSTRAINT fk_dataAsset_sourceDataId
    FOREIGN KEY (sourceDataId) REFERENCES dataAsset(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='统一数据主表';

CREATE TABLE IF NOT EXISTS processTask (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT 'PK',
  siteId BIGINT UNSIGNED NOT NULL COMMENT '现场ID',
  sceneId BIGINT UNSIGNED NOT NULL COMMENT '场景ID',
  taskType VARCHAR(32) NOT NULL COMMENT '任务类型: uploadRaw/generatePointCloud/generate2d/generate3d/generateGaussian',
  taskTitle VARCHAR(255) NULL COMMENT '任务标题',
  sourceDataId BIGINT UNSIGNED NULL COMMENT '输入数据ID',
  targetDataId BIGINT UNSIGNED NULL COMMENT '输出数据ID',
  status VARCHAR(32) NOT NULL COMMENT '状态: queued/running/success/failed/canceled',
  progress TINYINT UNSIGNED NOT NULL DEFAULT 0 COMMENT '进度 0-100',
  paramsJson JSON NULL COMMENT '任务参数',
  resultJson JSON NULL COMMENT '任务结果',
  errorCode VARCHAR(64) NULL COMMENT '错误码',
  errorMessage VARCHAR(500) NULL COMMENT '错误信息',
  operatorId BIGINT UNSIGNED NULL COMMENT '操作人ID',
  createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  startedAt DATETIME NULL COMMENT '开始时间',
  finishedAt DATETIME NULL COMMENT '结束时间',
  updatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (id),
  KEY idx_processTask_siteId (siteId),
  KEY idx_processTask_sceneId (sceneId),
  KEY idx_processTask_taskType (taskType),
  KEY idx_processTask_status (status),
  KEY idx_processTask_sourceDataId (sourceDataId),
  KEY idx_processTask_targetDataId (targetDataId),
  KEY idx_processTask_operatorId (operatorId),
  KEY idx_processTask_createdAt (createdAt),
  KEY idx_processTask_sceneId_status (sceneId, status),
  KEY idx_processTask_sourceDataId_taskType_status (sourceDataId, taskType, status),
  CONSTRAINT fk_processTask_siteId
    FOREIGN KEY (siteId) REFERENCES site(id),
  CONSTRAINT fk_processTask_sceneId
    FOREIGN KEY (sceneId) REFERENCES scene(id),
  CONSTRAINT fk_processTask_sourceDataId
    FOREIGN KEY (sourceDataId) REFERENCES dataAsset(id),
  CONSTRAINT fk_processTask_targetDataId
    FOREIGN KEY (targetDataId) REFERENCES dataAsset(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='处理任务表';

CREATE TABLE IF NOT EXISTS dataRelation (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT 'PK',
  sourceDataId BIGINT UNSIGNED NOT NULL COMMENT '来源数据ID',
  targetDataId BIGINT UNSIGNED NOT NULL COMMENT '目标数据ID',
  relationType VARCHAR(32) NOT NULL DEFAULT 'generatedTo' COMMENT '关系类型',
  createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  PRIMARY KEY (id),
  UNIQUE KEY uk_dataRelation_source_target_type (sourceDataId, targetDataId, relationType),
  KEY idx_dataRelation_sourceDataId (sourceDataId),
  KEY idx_dataRelation_targetDataId (targetDataId),
  CONSTRAINT fk_dataRelation_sourceDataId
    FOREIGN KEY (sourceDataId) REFERENCES dataAsset(id),
  CONSTRAINT fk_dataRelation_targetDataId
    FOREIGN KEY (targetDataId) REFERENCES dataAsset(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='数据血缘关系表';

CREATE TABLE IF NOT EXISTS operationLog (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT 'PK',
  siteId BIGINT UNSIGNED NOT NULL COMMENT '现场ID',
  sceneId BIGINT UNSIGNED NOT NULL COMMENT '场景ID',
  dataId BIGINT UNSIGNED NULL COMMENT '关联数据ID',
  taskId BIGINT UNSIGNED NULL COMMENT '关联任务ID',
  operationType VARCHAR(32) NOT NULL COMMENT '操作类型: uploadRaw/generatePointCloud/generate2d/generate3d/generateGaussian/edit/delete/download/view',
  status VARCHAR(32) NOT NULL COMMENT '状态: success/processing/failed',
  operatorId BIGINT UNSIGNED NULL COMMENT '操作人ID',
  content VARCHAR(500) NULL COMMENT '操作描述',
  createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  PRIMARY KEY (id),
  KEY idx_operationLog_siteId (siteId),
  KEY idx_operationLog_sceneId (sceneId),
  KEY idx_operationLog_dataId (dataId),
  KEY idx_operationLog_taskId (taskId),
  KEY idx_operationLog_operationType (operationType),
  KEY idx_operationLog_status (status),
  KEY idx_operationLog_operatorId (operatorId),
  KEY idx_operationLog_createdAt (createdAt),
  KEY idx_operationLog_sceneId_createdAt (sceneId, createdAt),
  CONSTRAINT fk_operationLog_siteId
    FOREIGN KEY (siteId) REFERENCES site(id),
  CONSTRAINT fk_operationLog_sceneId
    FOREIGN KEY (sceneId) REFERENCES scene(id),
  CONSTRAINT fk_operationLog_dataId
    FOREIGN KEY (dataId) REFERENCES dataAsset(id),
  CONSTRAINT fk_operationLog_taskId
    FOREIGN KEY (taskId) REFERENCES processTask(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='操作日志表';

-- Optional:
-- If the system does not have a shared user center, add a sysUser table.

-- Suggested post-create patch:
-- ALTER TABLE dataAsset
--   ADD CONSTRAINT fk_dataAsset_currentTaskId FOREIGN KEY (currentTaskId) REFERENCES processTask(id);
--
-- Note:
-- The constraint above is intentionally not created in the initial DDL to avoid
-- circular dependency issues during first-time schema creation.
