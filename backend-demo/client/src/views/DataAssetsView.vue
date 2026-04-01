<template>
  <section class="page-grid">
    <div class="page-grid__wide">
      <el-card>
        <template #header>
          <div class="section-header">
            <div>
              <h3>数据资产管理</h3>
              <p>按你给的后台界面思路做成筛选区 + 表格区 + 任务区。</p>
            </div>
            <div class="section-header__actions">
              <el-button :loading="uploadOptionsLoading || uploadSubmitting" type="success" @click="triggerUploadSelect">
                上传原始数据
              </el-button>
              <el-button :loading="assetsLoading" type="primary" @click="loadAssets">
                刷新资产
              </el-button>
              <el-button :loading="tasksLoading" @click="loadTasks">
                刷新任务
              </el-button>
            </div>
          </div>
        </template>

        <div class="toolbar-grid">
          <el-input v-model="assetFilters.siteId" placeholder="siteId" />
          <el-input v-model="assetFilters.sceneId" placeholder="sceneId" />
          <el-select v-model="assetFilters.status" clearable placeholder="状态">
            <el-option label="全部状态" value="" />
            <el-option label="上传中" value="uploading" />
            <el-option label="排队中" value="queued" />
            <el-option label="处理中" value="processing" />
            <el-option label="已完成" value="ready" />
            <el-option label="失败" value="failed" />
            <el-option label="已删除" value="deleted" />
          </el-select>
          <el-input v-model="assetFilters.page" placeholder="page" />
          <el-input v-model="assetFilters.pageSize" placeholder="pageSize" />
        </div>

        <div class="pill-filter">
          <span>数据类型视图</span>
          <el-radio-group v-model="assetFilters.dataType" size="small">
            <el-radio-button label="">全部数据</el-radio-button>
            <el-radio-button label="raw">原始数据</el-radio-button>
            <el-radio-button label="point_cloud">点云数据</el-radio-button>
            <el-radio-button label="gaussian">高斯地图</el-radio-button>
            <el-radio-button label="map_2d">机器人地图-2D</el-radio-button>
            <el-radio-button label="map_3d">机器人地图-3D</el-radio-button>
          </el-radio-group>
        </div>
      </el-card>

      <el-tabs v-model="activeTab" class="workbench-tabs">
        <el-tab-pane label="数据资产" name="assets">
          <el-card>
            <el-table
              :data="assetRows"
              stripe
              height="520"
              @row-click="openAssetDetail"
            >
              <el-table-column prop="dataName" label="名称" min-width="240" />
              <el-table-column label="类型" min-width="130">
                <template #default="{ row }">
                  <el-tag
                    effect="plain"
                    :style="{ borderColor: pickTypeColor(row.dataType), color: pickTypeColor(row.dataType) }"
                  >
                    {{ formatTypeLabel(row.dataType) }}
                  </el-tag>
                </template>
              </el-table-column>
              <el-table-column prop="siteName" label="现场" min-width="100" />
              <el-table-column prop="sceneName" label="场景" min-width="100" />
              <el-table-column label="状态" min-width="120">
                <template #default="{ row }">
                  <el-tag :type="pickStatusTag(row.status)">
                    {{ formatStatusLabel(row.status) }}
                  </el-tag>
                </template>
              </el-table-column>
              <el-table-column label="进度" min-width="160">
                <template #default="{ row }">
                  <el-progress
                    :percentage="row.progress || 0"
                    :stroke-width="10"
                    :show-text="true"
                  />
                </template>
              </el-table-column>
              <el-table-column prop="operatorName" label="操作人" min-width="100" />
              <el-table-column label="操作时间" min-width="180">
                <template #default="{ row }">
                  {{ formatDateTime(row.updatedAt || row.createdAt) }}
                </template>
              </el-table-column>
              <el-table-column label="操作" min-width="180" fixed="right">
                <template #default="{ row }">
                  <div class="table-actions">
                    <el-button link type="primary" @click.stop="openAssetDetail(row)">
                      详情
                    </el-button>
                    <el-button
                      v-if="row.dataType === 'raw'"
                      link
                      type="warning"
                      @click.stop="handleGeneratePointCloud(row)"
                    >
                      生成点云
                    </el-button>
                  </div>
                </template>
              </el-table-column>
            </el-table>
          </el-card>
        </el-tab-pane>

        <el-tab-pane label="任务队列" name="tasks">
          <el-card>
            <div class="toolbar-grid toolbar-grid--compact">
              <el-input v-model="taskFilters.siteId" placeholder="siteId" />
              <el-input v-model="taskFilters.sceneId" placeholder="sceneId" />
              <el-select v-model="taskFilters.status" clearable placeholder="任务状态">
                <el-option label="全部状态" value="" />
                <el-option label="排队中" value="queued" />
                <el-option label="运行中" value="running" />
                <el-option label="成功" value="success" />
                <el-option label="失败" value="failed" />
                <el-option label="已取消" value="canceled" />
              </el-select>
              <el-input v-model="taskFilters.page" placeholder="page" />
              <el-input v-model="taskFilters.pageSize" placeholder="pageSize" />
            </div>

            <el-table :data="taskRows" stripe height="520" @row-click="openTaskDetail">
              <el-table-column prop="taskTitle" label="任务标题" min-width="240" />
              <el-table-column prop="siteName" label="现场" min-width="100" />
              <el-table-column prop="sceneName" label="场景" min-width="100" />
              <el-table-column prop="sourceDataName" label="源数据" min-width="160" />
              <el-table-column prop="targetDataName" label="目标数据" min-width="160" />
              <el-table-column label="状态" min-width="120">
                <template #default="{ row }">
                  <el-tag :type="pickStatusTag(row.status)">
                    {{ formatStatusLabel(row.status) }}
                  </el-tag>
                </template>
              </el-table-column>
              <el-table-column label="进度" min-width="130">
                <template #default="{ row }">
                  {{ formatPercent(row.progress) }}
                </template>
              </el-table-column>
              <el-table-column label="更新时间" min-width="180">
                <template #default="{ row }">
                  {{ formatDateTime(row.updatedAt) }}
                </template>
              </el-table-column>
            </el-table>
          </el-card>
        </el-tab-pane>
      </el-tabs>
    </div>

    <JsonPanel
      title="最近接口响应"
      description="资产列表、任务列表、上传和点云生成接口的原始返回都会记录在这里。"
      :payload="lastPayload"
    />
  </section>

  <input
    ref="fileInputRef"
    type="file"
    style="display: none"
    @change="handleFileSelected"
  />

  <el-drawer
    v-model="detailVisible"
    size="420px"
    direction="rtl"
    :title="detailTitle"
  >
    <JsonPanel
      title="详情 JSON"
      description="点击表格行时打开，用于快速检查接口字段。"
      :payload="detailPayload"
    />
  </el-drawer>

  <el-dialog
    v-model="uploadDialogVisible"
    width="560px"
    title="上传原始数据"
    destroy-on-close
  >
    <div class="upload-dialog">
      <el-alert
        type="info"
        :closable="false"
        show-icon
        title="上传流程"
        description="文件已从系统资源管理器选中。下面选择现场、场景并编辑数据名称，然后提交到后端。"
      />

      <el-descriptions :column="1" border class="upload-dialog__file">
        <el-descriptions-item label="文件名">
          {{ selectedUploadFile?.name || '-' }}
        </el-descriptions-item>
        <el-descriptions-item label="文件大小">
          {{ formatFileSize(selectedUploadFile?.size) }}
        </el-descriptions-item>
        <el-descriptions-item label="数据类型">
          原始数据
        </el-descriptions-item>
      </el-descriptions>

      <el-form label-position="top" class="upload-dialog__form">
        <el-form-item label="现场">
          <el-select
            v-model="uploadForm.siteId"
            placeholder="请选择现场"
            style="width: 100%"
          >
            <el-option
              v-for="site in uploadSites"
              :key="site.id"
              :label="site.siteName"
              :value="String(site.id)"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="场景">
          <el-select
            v-model="uploadForm.sceneId"
            placeholder="请选择场景"
            style="width: 100%"
          >
            <el-option
              v-for="scene in currentSceneOptions"
              :key="scene.id"
              :label="scene.sceneName"
              :value="String(scene.id)"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="数据名称">
          <el-input
            v-model="uploadForm.dataName"
            placeholder="可编辑上传后的数据名称"
          />
        </el-form-item>
      </el-form>
    </div>

    <template #footer>
      <div class="settings-form__footer">
        <el-button @click="handleCloseUploadDialog">取消</el-button>
        <el-button :loading="uploadSubmitting" type="primary" @click="submitUpload">
          提交上传
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup>
import { computed, h, onMounted, reactive, ref, watch } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';

import JsonPanel from '../components/JsonPanel.vue';
import {
  createPointCloudTask,
  fetchDataAssets,
  fetchTasks,
  fetchUploadOptions,
  uploadRawData,
} from '../api/backend';
import { appConfig } from '../composables/useAppConfig';
import {
  extractPayload,
  formatDateTime,
  formatPercent,
  formatStatusLabel,
  formatTypeLabel,
  pickStatusTag,
  pickTypeColor,
} from '../utils/presenter';

const activeTab = ref('assets');
const assetsLoading = ref(false);
const tasksLoading = ref(false);
const uploadOptionsLoading = ref(false);
const uploadSubmitting = ref(false);
const assetRows = ref([]);
const taskRows = ref([]);
const lastPayload = ref(null);
const uploadSites = ref([]);
const selectedUploadFile = ref(null);
const fileInputRef = ref(null);
const uploadDialogVisible = ref(false);

const detailVisible = ref(false);
const detailTitle = ref('详情');
const detailPayload = ref(null);

const assetFilters = reactive({
  siteId: appConfig.defaultSiteId,
  sceneId: appConfig.defaultSceneId,
  dataType: '',
  status: '',
  page: '1',
  pageSize: '20',
});

const uploadForm = reactive({
  siteId: '',
  sceneId: '',
  dataName: '',
});

const currentSceneOptions = computed(() => {
  const currentSite = uploadSites.value.find((site) => String(site.id) === uploadForm.siteId);
  return currentSite?.scenes || [];
});

const taskFilters = reactive({
  siteId: appConfig.defaultSiteId,
  sceneId: appConfig.defaultSceneId,
  status: '',
  page: '1',
  pageSize: '20',
});

async function loadAssets() {
  assetsLoading.value = true;
  const response = await fetchDataAssets(assetFilters);
  assetRows.value = extractPayload(response)?.list || [];
  lastPayload.value = response;
  assetsLoading.value = false;
}

async function loadTasks() {
  tasksLoading.value = true;
  const response = await fetchTasks(taskFilters);
  taskRows.value = extractPayload(response)?.list || [];
  lastPayload.value = response;
  tasksLoading.value = false;
}

async function ensureUploadOptions() {
  if (uploadSites.value.length) {
    return true;
  }

  uploadOptionsLoading.value = true;
  const response = await fetchUploadOptions();
  lastPayload.value = response;
  uploadOptionsLoading.value = false;

  if (!response.ok) {
    ElMessage.error(response.data?.message || '加载上传选项失败');
    return false;
  }

  uploadSites.value = extractPayload(response)?.sites || [];
  if (!uploadSites.value.length) {
    ElMessage.warning('暂无可选现场和场景');
  }
  return uploadSites.value.length > 0;
}

function triggerUploadSelect() {
  if (fileInputRef.value) {
    fileInputRef.value.value = '';
    fileInputRef.value.click();
  }
}

function deriveDataName(fileName) {
  return String(fileName || '').replace(/\.[^.]+$/, '');
}

function formatFileSize(size) {
  if (!size && size !== 0) {
    return '-';
  }

  if (size < 1024) {
    return `${size} B`;
  }

  if (size < 1024 * 1024) {
    return `${(size / 1024).toFixed(1)} KB`;
  }

  if (size < 1024 * 1024 * 1024) {
    return `${(size / (1024 * 1024)).toFixed(2)} MB`;
  }

  return `${(size / (1024 * 1024 * 1024)).toFixed(2)} GB`;
}

function syncUploadDefaults() {
  const fallbackSiteId = uploadSites.value.some((site) => String(site.id) === appConfig.defaultSiteId)
    ? appConfig.defaultSiteId
    : String(uploadSites.value[0]?.id ?? '');
  uploadForm.siteId = fallbackSiteId;

  const sceneOptions = uploadSites.value.find((site) => String(site.id) === uploadForm.siteId)?.scenes || [];
  const fallbackSceneId = sceneOptions.some((scene) => String(scene.id) === appConfig.defaultSceneId)
    ? appConfig.defaultSceneId
    : String(sceneOptions[0]?.id ?? '');
  uploadForm.sceneId = fallbackSceneId;
  uploadForm.dataName = deriveDataName(selectedUploadFile.value?.name);
}

async function handleFileSelected(event) {
  const file = event.target.files?.[0];
  if (!file) {
    return;
  }

  selectedUploadFile.value = file;
  const ready = await ensureUploadOptions();
  if (!ready) {
    selectedUploadFile.value = null;
    return;
  }

  syncUploadDefaults();
  uploadDialogVisible.value = true;
}

function handleCloseUploadDialog() {
  uploadDialogVisible.value = false;
  selectedUploadFile.value = null;
}

function openAssetDetail(row) {
  detailTitle.value = `数据资产: ${row.dataName}`;
  detailPayload.value = row;
  detailVisible.value = true;
}

function openTaskDetail(row) {
  detailTitle.value = `任务详情: ${row.taskTitle || row.id}`;
  detailPayload.value = row;
  detailVisible.value = true;
}

async function handleGeneratePointCloud(row) {
  const response = await createPointCloudTask(row.id);
  lastPayload.value = response;

  if (response.ok) {
    ElMessage.success(`已为 ${row.dataName} 创建点云任务`);
    await Promise.all([loadAssets(), loadTasks()]);
    return;
  }

  ElMessage.error(response.data?.message || '创建点云任务失败');
}

async function submitUpload() {
  if (!selectedUploadFile.value) {
    ElMessage.error('请先选择文件');
    return;
  }

  if (!uploadForm.siteId) {
    ElMessage.error('请选择现场');
    return;
  }

  if (!uploadForm.sceneId) {
    ElMessage.error('请选择场景');
    return;
  }

  if (!uploadForm.dataName.trim()) {
    ElMessage.error('请输入数据名称');
    return;
  }

  const formData = new FormData();
  formData.append('siteId', uploadForm.siteId);
  formData.append('sceneId', uploadForm.sceneId);
  formData.append('dataName', uploadForm.dataName.trim());
  formData.append('file', selectedUploadFile.value);

  uploadSubmitting.value = true;
  const response = await uploadRawData(formData);
  lastPayload.value = response;
  uploadSubmitting.value = false;

  if (!response.ok) {
    ElMessage.error(response.data?.message || '上传原始数据失败');
    return;
  }

  const responseData = extractPayload(response) || {};
  const uploadedFileName = selectedUploadFile.value.name;
  const finalAbsolutePath = responseData.absolutePath || responseData.storagePath || '-';

  uploadDialogVisible.value = false;
  selectedUploadFile.value = null;
  activeTab.value = 'assets';
  await Promise.all([loadAssets(), loadTasks()]);

  await ElMessageBox.alert(
    h('div', [
      h('p', { style: 'margin: 0 0 8px;' }, `已上传 ${uploadedFileName}`),
      h('p', { style: 'margin: 0 0 8px; color: #606266; font-size: 13px;' }, '文件落盘绝对路径'),
      h(
        'div',
        {
          style: 'padding: 10px 12px; background: #f5f7fa; border-radius: 8px; font-family: Consolas, Monaco, monospace; word-break: break-all;',
        },
        finalAbsolutePath,
      ),
    ]),
    '上传成功',
    {
      confirmButtonText: '知道了',
      type: 'success',
    },
  );
}

onMounted(async () => {
  await Promise.all([loadAssets(), loadTasks()]);
});

watch(
  () => uploadForm.siteId,
  (siteId) => {
    const sceneExists = currentSceneOptions.value.some((scene) => String(scene.id) === uploadForm.sceneId);
    if (!sceneExists) {
      uploadForm.sceneId = String(currentSceneOptions.value[0]?.id ?? '');
    }
  },
);

watch(
  () => [
    appConfig.dataSourceMode,
    appConfig.baseUrl,
    appConfig.apiPrefix,
    appConfig.defaultSiteId,
    appConfig.defaultSceneId,
  ],
  () => {
    assetFilters.siteId = appConfig.defaultSiteId;
    assetFilters.sceneId = appConfig.defaultSceneId;
    taskFilters.siteId = appConfig.defaultSiteId;
    taskFilters.sceneId = appConfig.defaultSceneId;
    uploadSites.value = [];
    uploadDialogVisible.value = false;
    selectedUploadFile.value = null;
    Promise.all([loadAssets(), loadTasks()]);
  },
);
</script>
