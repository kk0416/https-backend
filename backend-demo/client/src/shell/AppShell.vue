<template>
  <el-container class="shell">
    <el-aside class="shell__aside" width="236px">
      <div class="shell__brand">
        <div class="shell__brand-mark">G</div>
        <div>
          <strong>Gaussian Client</strong>
          <span>Backend Demo Tester</span>
        </div>
      </div>

      <el-menu
        :default-active="$route.path"
        class="shell__menu"
        router
      >
        <el-menu-item
          v-for="route in routes"
          :key="route.path"
          :index="route.path"
        >
          <el-icon>
            <component :is="route.meta.icon" />
          </el-icon>
          <span>{{ route.meta.title }}</span>
        </el-menu-item>
      </el-menu>

      <div class="shell__aside-foot">
        <span class="shell__aside-label">当前后端</span>
        <strong>{{ backendLabel }}</strong>
      </div>
    </el-aside>

    <el-container class="shell__main">
      <el-header class="shell__header">
        <div>
          <p class="shell__crumb">{{ currentRoute?.meta?.title || '控制台' }}</p>
          <h1>{{ currentRoute?.meta?.description || '独立接口测试客户端' }}</h1>
        </div>

        <div class="shell__header-actions">
          <el-tag :type="backendModeTagType" effect="dark">{{ backendMode }}</el-tag>
          <el-button type="primary" @click="settingsVisible = true">
            连接设置
          </el-button>
        </div>
      </el-header>

      <el-main class="shell__content">
        <RouterView />
      </el-main>
    </el-container>
  </el-container>

  <el-drawer
    v-model="settingsVisible"
    direction="rtl"
    size="420px"
    title="后端连接设置"
  >
    <el-form label-position="top" class="settings-form">
      <el-form-item label="数据源模式">
        <el-radio-group v-model="draft.dataSourceMode">
          <el-radio-button label="proxy">本地代理</el-radio-button>
          <el-radio-button label="direct">直连后端</el-radio-button>
          <el-radio-button label="mock">模拟数据</el-radio-button>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="Base URL">
        <el-input
          v-model="draft.baseUrl"
          placeholder="留空时使用 Vite 代理，例如 https://127.0.0.1:34430"
          :disabled="draft.dataSourceMode !== 'direct'"
        />
      </el-form-item>
      <el-form-item label="API Prefix">
        <el-input v-model="draft.apiPrefix" placeholder="/api/v1" />
      </el-form-item>
      <el-form-item label="默认 siteId">
        <el-input v-model="draft.defaultSiteId" placeholder="留空表示不过滤现场" />
      </el-form-item>
      <el-form-item label="默认 sceneId">
        <el-input v-model="draft.defaultSceneId" placeholder="留空表示不过滤场景" />
      </el-form-item>
      <el-form-item label="默认 RAW 资产 ID">
        <el-input v-model="draft.defaultRawAssetId" placeholder="按需填写，留空即可" />
      </el-form-item>
    </el-form>

    <el-alert
      v-if="draft.dataSourceMode === 'mock'"
      type="info"
      :closable="false"
      show-icon
      title="当前为模拟数据模式"
      description="所有页面将使用内置 mock 数据，不请求真实后端。生成点云会在前端内存里新增任务和资产。"
    />

    <template #footer>
      <div class="settings-form__footer">
        <el-button v-if="draft.dataSourceMode === 'mock'" type="warning" plain @click="handleResetMock">
          重置模拟数据
        </el-button>
        <el-button @click="handleReset">恢复默认</el-button>
        <el-button type="primary" @click="handleSave">保存设置</el-button>
      </div>
    </template>
  </el-drawer>
</template>

<script setup>
import { computed, reactive, ref, watch } from 'vue';
import { useRoute, useRouter, RouterView } from 'vue-router';
import { ElMessage } from 'element-plus';

import {
  appConfig,
  cloneAppConfig,
  resetAppConfig,
  resolvedBackendLabel,
  saveAppConfig,
} from '../composables/useAppConfig';
import { resetMockState } from '../mocks/backend';

const router = useRouter();
const route = useRoute();

const routes = computed(() =>
  router.options.routes[0].children.map((item) => ({
    path: `/${item.path}`,
    meta: item.meta,
  })),
);

const currentRoute = computed(() =>
  routes.value.find((item) => item.path === route.path),
);

const backendLabel = computed(() => resolvedBackendLabel.value);
const backendMode = computed(() => {
  if (appConfig.dataSourceMode === 'mock') {
    return '模拟数据';
  }

  if (appConfig.dataSourceMode === 'direct') {
    return '直连后端';
  }

  return '本地代理';
});
const backendModeTagType = computed(() => {
  if (appConfig.dataSourceMode === 'mock') {
    return 'warning';
  }

  if (appConfig.dataSourceMode === 'direct') {
    return 'success';
  }

  return 'primary';
});

const settingsVisible = ref(false);
const draft = reactive(cloneAppConfig());

watch(
  () => settingsVisible.value,
  (visible) => {
    if (visible) {
      Object.assign(draft, cloneAppConfig());
    }
  },
);

function handleSave() {
  saveAppConfig(draft);
  settingsVisible.value = false;
  ElMessage.success('后端设置已保存');
}

function handleReset() {
  resetAppConfig();
  Object.assign(draft, cloneAppConfig());
  ElMessage.success('已恢复默认设置');
}

function handleResetMock() {
  resetMockState();
  ElMessage.success('模拟数据已重置');
}
</script>
