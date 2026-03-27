-- CreateTable
CREATE TABLE "Site" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "siteCode" TEXT NOT NULL,
    "siteName" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'ENABLED',
    "remark" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Scene" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "siteId" INTEGER NOT NULL,
    "sceneCode" TEXT NOT NULL,
    "sceneName" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'ENABLED',
    "remark" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Scene_siteId_fkey" FOREIGN KEY ("siteId") REFERENCES "Site" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "DataAsset" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "siteId" INTEGER NOT NULL,
    "sceneId" INTEGER NOT NULL,
    "dataType" TEXT NOT NULL,
    "dataName" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "progress" INTEGER NOT NULL DEFAULT 0,
    "sourceDataId" INTEGER,
    "currentTaskId" INTEGER,
    "storagePath" TEXT,
    "fileName" TEXT,
    "fileSize" INTEGER,
    "fileHash" TEXT,
    "metadataJson" TEXT,
    "operatorId" TEXT,
    "operatorName" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "deletedAt" DATETIME,
    CONSTRAINT "DataAsset_siteId_fkey" FOREIGN KEY ("siteId") REFERENCES "Site" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "DataAsset_sceneId_fkey" FOREIGN KEY ("sceneId") REFERENCES "Scene" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "DataAsset_sourceDataId_fkey" FOREIGN KEY ("sourceDataId") REFERENCES "DataAsset" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ProcessTask" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "siteId" INTEGER NOT NULL,
    "sceneId" INTEGER NOT NULL,
    "taskType" TEXT NOT NULL,
    "taskTitle" TEXT,
    "sourceDataId" INTEGER,
    "targetDataId" INTEGER,
    "status" TEXT NOT NULL,
    "progress" INTEGER NOT NULL DEFAULT 0,
    "paramsJson" TEXT,
    "resultJson" TEXT,
    "errorCode" TEXT,
    "errorMessage" TEXT,
    "operatorId" TEXT,
    "operatorName" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "startedAt" DATETIME,
    "finishedAt" DATETIME,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "ProcessTask_siteId_fkey" FOREIGN KEY ("siteId") REFERENCES "Site" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "ProcessTask_sceneId_fkey" FOREIGN KEY ("sceneId") REFERENCES "Scene" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "ProcessTask_sourceDataId_fkey" FOREIGN KEY ("sourceDataId") REFERENCES "DataAsset" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "ProcessTask_targetDataId_fkey" FOREIGN KEY ("targetDataId") REFERENCES "DataAsset" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "OperationLog" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "siteId" INTEGER NOT NULL,
    "sceneId" INTEGER NOT NULL,
    "dataId" INTEGER,
    "taskId" INTEGER,
    "operationType" TEXT NOT NULL,
    "operationDesc" TEXT,
    "status" TEXT NOT NULL,
    "operatorId" TEXT,
    "operatorName" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "OperationLog_siteId_fkey" FOREIGN KEY ("siteId") REFERENCES "Site" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "OperationLog_sceneId_fkey" FOREIGN KEY ("sceneId") REFERENCES "Scene" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "OperationLog_dataId_fkey" FOREIGN KEY ("dataId") REFERENCES "DataAsset" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "OperationLog_taskId_fkey" FOREIGN KEY ("taskId") REFERENCES "ProcessTask" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Site_siteCode_key" ON "Site"("siteCode");

-- CreateIndex
CREATE INDEX "Scene_siteId_idx" ON "Scene"("siteId");

-- CreateIndex
CREATE INDEX "Scene_status_idx" ON "Scene"("status");

-- CreateIndex
CREATE UNIQUE INDEX "Scene_siteId_sceneCode_key" ON "Scene"("siteId", "sceneCode");

-- CreateIndex
CREATE INDEX "DataAsset_siteId_idx" ON "DataAsset"("siteId");

-- CreateIndex
CREATE INDEX "DataAsset_sceneId_idx" ON "DataAsset"("sceneId");

-- CreateIndex
CREATE INDEX "DataAsset_dataType_idx" ON "DataAsset"("dataType");

-- CreateIndex
CREATE INDEX "DataAsset_status_idx" ON "DataAsset"("status");

-- CreateIndex
CREATE INDEX "DataAsset_sourceDataId_idx" ON "DataAsset"("sourceDataId");

-- CreateIndex
CREATE INDEX "DataAsset_currentTaskId_idx" ON "DataAsset"("currentTaskId");

-- CreateIndex
CREATE INDEX "DataAsset_createdAt_idx" ON "DataAsset"("createdAt");

-- CreateIndex
CREATE INDEX "DataAsset_sceneId_dataType_status_idx" ON "DataAsset"("sceneId", "dataType", "status");

-- CreateIndex
CREATE INDEX "ProcessTask_siteId_idx" ON "ProcessTask"("siteId");

-- CreateIndex
CREATE INDEX "ProcessTask_sceneId_idx" ON "ProcessTask"("sceneId");

-- CreateIndex
CREATE INDEX "ProcessTask_taskType_idx" ON "ProcessTask"("taskType");

-- CreateIndex
CREATE INDEX "ProcessTask_status_idx" ON "ProcessTask"("status");

-- CreateIndex
CREATE INDEX "ProcessTask_sourceDataId_idx" ON "ProcessTask"("sourceDataId");

-- CreateIndex
CREATE INDEX "ProcessTask_targetDataId_idx" ON "ProcessTask"("targetDataId");

-- CreateIndex
CREATE INDEX "ProcessTask_createdAt_idx" ON "ProcessTask"("createdAt");

-- CreateIndex
CREATE INDEX "ProcessTask_sceneId_status_idx" ON "ProcessTask"("sceneId", "status");

-- CreateIndex
CREATE INDEX "OperationLog_siteId_idx" ON "OperationLog"("siteId");

-- CreateIndex
CREATE INDEX "OperationLog_sceneId_idx" ON "OperationLog"("sceneId");

-- CreateIndex
CREATE INDEX "OperationLog_dataId_idx" ON "OperationLog"("dataId");

-- CreateIndex
CREATE INDEX "OperationLog_taskId_idx" ON "OperationLog"("taskId");

-- CreateIndex
CREATE INDEX "OperationLog_operationType_idx" ON "OperationLog"("operationType");

-- CreateIndex
CREATE INDEX "OperationLog_status_idx" ON "OperationLog"("status");

-- CreateIndex
CREATE INDEX "OperationLog_createdAt_idx" ON "OperationLog"("createdAt");

-- CreateIndex
CREATE INDEX "OperationLog_sceneId_createdAt_idx" ON "OperationLog"("sceneId", "createdAt");
