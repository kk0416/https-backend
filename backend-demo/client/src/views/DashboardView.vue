<template>
  <section class="page-grid">
    <div class="page-grid__wide">
      <el-card class="hero-card">
        <div class="hero-card__content">
          <div>
            <span class="hero-card__eyebrow">Independent API Workbench</span>
            <h2>独立客户端总览</h2>
            <p>
              这个页面直接面向当前后端接口，先看健康状态，再核对数据统计和别名接口是否一致。
            </p>
          </div>
          <div class="hero-card__actions">
            <el-button :loading="loading" type="primary" @click="refreshAll">
              刷新概览
            </el-button>
            <el-tag type="warning" effect="plain">
              当前筛选 siteId={{ filters.siteId || '-' }} sceneId={{ filters.sceneId || '-' }}
            </el-tag>
          </div>
        </div>

        <div class="hero-card__filters">
          <el-input v-model="filters.siteId" placeholder="siteId" />
          <el-input v-model="filters.sceneId" placeholder="sceneId" />
        </div>
      </el-card>

      <div class="stats-grid">
        <StatCard
          eyebrow="裸探针"
          :value="formatResponseStatus(probeResponse)"
          description="/health"
        />
        <StatCard
          eyebrow="业务健康检查"
          :value="formatResponseStatus(apiHealthResponse)"
          description="/api/v1/health"
        />
        <StatCard
          eyebrow="概览接口"
          :value="formatResponseStatus(summaryResponse)"
          description="/dashboard/data-summary"
        />
        <StatCard
          eyebrow="原始数据"
          :value="summaryData?.rawCount ?? '-'"
          description="RAW 资产总数"
        />
        <StatCard
          eyebrow="点云 / 高斯"
          :value="`${summaryData?.pointCloudCount ?? 0} / ${summaryData?.gaussianCount ?? 0}`"
          description="POINT_CLOUD / GAUSSIAN"
        />
        <StatCard
          eyebrow="任务运行态"
          :value="`${summaryData?.runningTaskCount ?? 0} / ${summaryData?.totalTaskCount ?? 0}`"
          description="RUNNING / TOTAL"
        />
      </div>

      <el-card class="status-card">
        <template #header>
          <div class="section-header">
            <div>
              <h3>接口比对</h3>
              <p>校验标准路由和别名路由的返回摘要是否一致。</p>
            </div>
            <el-tag :type="summaryMatched ? 'success' : 'warning'" effect="plain">
              {{ summaryMatched ? '统计一致' : '需要检查' }}
            </el-tag>
          </div>
        </template>

        <div class="status-card__matrix">
          <div>
            <span>标准统计接口</span>
            <strong>{{ formatResponseStatus(summaryResponse) }}</strong>
            <p>{{ summaryResponse?.url || '-' }}</p>
          </div>
          <div>
            <span>别名统计接口</span>
            <strong>{{ formatResponseStatus(aliasResponse) }}</strong>
            <p>{{ aliasResponse?.url || '-' }}</p>
          </div>
          <div>
            <span>最近耗时</span>
            <strong>{{ summaryResponse?.durationMs ?? '-' }} ms</strong>
            <p>用于快速判断接口是否异常变慢</p>
          </div>
        </div>
      </el-card>
    </div>

    <JsonPanel
      title="概览原始响应"
      description="这里保留最近一次概览请求的完整结果，方便直接核对后端 JSON。"
      :payload="rawPayload"
    />
  </section>
</template>

<script setup>
import { computed, onMounted, reactive, ref, watch } from 'vue';

import StatCard from '../components/StatCard.vue';
import JsonPanel from '../components/JsonPanel.vue';
import {
  fetchApiHealth,
  fetchDashboardSummary,
  fetchDashboardSummaryAlias,
  fetchHealthProbe,
} from '../api/backend';
import { appConfig } from '../composables/useAppConfig';
import { extractPayload } from '../utils/presenter';

const filters = reactive({
  siteId: appConfig.defaultSiteId,
  sceneId: appConfig.defaultSceneId,
});

const loading = ref(false);
const probeResponse = ref(null);
const apiHealthResponse = ref(null);
const summaryResponse = ref(null);
const aliasResponse = ref(null);

const summaryData = computed(() => extractPayload(summaryResponse.value));
const aliasData = computed(() => extractPayload(aliasResponse.value));
const summaryMatched = computed(
  () => JSON.stringify(summaryData.value) === JSON.stringify(aliasData.value),
);

const rawPayload = computed(() => ({
  probe: probeResponse.value,
  apiHealth: apiHealthResponse.value,
  summary: summaryResponse.value,
  alias: aliasResponse.value,
}));

function formatResponseStatus(response) {
  if (!response) {
    return '-';
  }

  if (response.status === 0) {
    return '请求失败';
  }

  return `${response.status} ${response.statusText}`;
}

async function refreshAll() {
  loading.value = true;

  const query = {
    siteId: filters.siteId,
    sceneId: filters.sceneId,
  };

  const [probe, apiHealth, summary, alias] = await Promise.all([
    fetchHealthProbe(),
    fetchApiHealth(),
    fetchDashboardSummary(query),
    fetchDashboardSummaryAlias(query),
  ]);

  probeResponse.value = probe;
  apiHealthResponse.value = apiHealth;
  summaryResponse.value = summary;
  aliasResponse.value = alias;
  loading.value = false;
}

onMounted(refreshAll);

watch(
  () => [
    appConfig.dataSourceMode,
    appConfig.baseUrl,
    appConfig.apiPrefix,
    appConfig.defaultSiteId,
    appConfig.defaultSceneId,
  ],
  () => {
    filters.siteId = appConfig.defaultSiteId;
    filters.sceneId = appConfig.defaultSceneId;
    refreshAll();
  },
);
</script>
