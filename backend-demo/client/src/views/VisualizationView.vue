<template>
  <section class="page-grid">
    <div class="page-grid__wide">
      <el-card>
        <template #header>
          <div class="section-header">
            <div>
              <h3>运行可视化</h3>
              <p>普通表格不适合做节点关系表达，这里单独用图形渲染呈现树和图。</p>
            </div>
            <div class="section-header__actions">
              <el-button :loading="loading" type="primary" @click="refreshVisuals">
                刷新图视图
              </el-button>
            </div>
          </div>
        </template>

        <div class="toolbar-grid toolbar-grid--compact">
          <el-input v-model="filters.siteId" placeholder="siteId" />
          <el-input v-model="filters.sceneId" placeholder="sceneId" />
          <el-radio-group v-model="activeView">
            <el-radio-button label="tree">树状视图</el-radio-button>
            <el-radio-button label="graph">关系图</el-radio-button>
          </el-radio-group>
        </div>

        <div class="legend-row">
          <div
            v-for="legend in legendItems"
            :key="legend.key"
            class="legend-row__item"
          >
            <span
              class="legend-row__dot"
              :style="{ backgroundColor: legend.color }"
            ></span>
            {{ legend.label }}
          </div>
        </div>
      </el-card>

      <EChartPanel
        v-if="activeView === 'tree'"
        title="数据树视图"
        description="对应接口 /api/v1/data-assets/tree，适合看数据血缘层级。"
        :tag-label="`siteId=${filters.siteId || '-'} sceneId=${filters.sceneId || '-'}`"
        :option="treeOption"
      />

      <EChartPanel
        v-else
        title="节点关系图"
        description="对应接口 /api/v1/data-assets/graph，适合看点与边的横向关系。"
        :tag-label="graphMetrics"
        :option="graphOption"
      />
    </div>

    <JsonPanel
      title="图形接口原始响应"
      description="保留 tree 和 graph 的原始 JSON，方便对照渲染结果。"
      :payload="rawPayload"
    />
  </section>
</template>

<script setup>
import { computed, onMounted, reactive, ref, watch } from 'vue';

import EChartPanel from '../components/EChartPanel.vue';
import JsonPanel from '../components/JsonPanel.vue';
import { fetchDataGraph, fetchDataTree } from '../api/backend';
import { appConfig } from '../composables/useAppConfig';
import { extractPayload, formatTypeLabel, pickTypeColor } from '../utils/presenter';

const loading = ref(false);
const activeView = ref('graph');
const treeResponse = ref(null);
const graphResponse = ref(null);

const filters = reactive({
  siteId: appConfig.defaultSiteId,
  sceneId: appConfig.defaultSceneId,
});

const legendItems = ['raw', 'point_cloud', 'gaussian', 'map_2d', 'map_3d'].map((key) => ({
  key,
  label: formatTypeLabel(key),
  color: pickTypeColor(key),
}));

function mapTreeNode(node) {
  return {
    name: `${node.dataName}\n${formatTypeLabel(node.dataType)}`,
    value: node.id,
    itemStyle: {
      color: pickTypeColor(node.dataType),
    },
    lineStyle: {
      color: '#93a9c4',
      width: 1.5,
    },
    children: (node.children || []).map(mapTreeNode),
  };
}

const treeOption = computed(() => {
  const nodes = extractPayload(treeResponse.value);
  if (!nodes?.length) {
    return null;
  }

  return {
    backgroundColor: 'transparent',
    tooltip: {
      trigger: 'item',
      triggerOn: 'mousemove',
    },
    series: [
      {
        type: 'tree',
        data: [
          {
            name: '数据资产树',
            children: nodes.map(mapTreeNode),
          },
        ],
        top: '4%',
        left: '8%',
        bottom: '4%',
        right: '24%',
        symbolSize: 12,
        orient: 'LR',
        expandAndCollapse: true,
        initialTreeDepth: 4,
        label: {
          position: 'left',
          verticalAlign: 'middle',
          align: 'right',
          fontSize: 12,
          color: '#24364a',
        },
        leaves: {
          label: {
            position: 'right',
            align: 'left',
          },
        },
        animationDuration: 500,
      },
    ],
  };
});

const graphOption = computed(() => {
  const graph = extractPayload(graphResponse.value);
  if (!graph?.nodes?.length) {
    return null;
  }

  const categories = legendItems.map((item) => ({
    name: item.label,
  }));

  return {
    backgroundColor: 'transparent',
    tooltip: {
      trigger: 'item',
    },
    legend: [
      {
        data: categories.map((item) => item.name),
        bottom: 0,
      },
    ],
    series: [
      {
        type: 'graph',
        layout: 'force',
        roam: true,
        draggable: true,
        force: {
          repulsion: 280,
          edgeLength: [120, 220],
          gravity: 0.06,
        },
        edgeSymbol: ['none', 'arrow'],
        edgeSymbolSize: [4, 10],
        label: {
          show: true,
          position: 'right',
          formatter: ({ data }) => data.label,
          color: '#1f2d3d',
          fontSize: 12,
        },
        lineStyle: {
          color: '#8ca3bf',
          width: 1.5,
          curveness: 0.08,
          opacity: 0.92,
        },
        categories,
        data: graph.nodes.map((node) => ({
          ...node,
          value: node.id,
          symbolSize: 28 + Math.max(node.progress || 0, 12) * 0.48,
          category: categories.findIndex(
            (item) => item.name === formatTypeLabel(node.dataType),
          ),
          itemStyle: {
            color: pickTypeColor(node.dataType),
            shadowBlur: 18,
            shadowColor: 'rgba(33, 52, 73, 0.2)',
          },
        })),
        links: graph.edges.map((edge) => ({
          source: edge.source,
          target: edge.target,
        })),
      },
    ],
  };
});

const graphMetrics = computed(() => {
  const graph = extractPayload(graphResponse.value);
  if (!graph) {
    return 'nodes=0 edges=0';
  }

  return `nodes=${graph.nodes.length} edges=${graph.edges.length}`;
});

const rawPayload = computed(() => ({
  tree: treeResponse.value,
  graph: graphResponse.value,
}));

async function refreshVisuals() {
  loading.value = true;
  const query = {
    siteId: filters.siteId,
    sceneId: filters.sceneId,
  };

  const [tree, graph] = await Promise.all([
    fetchDataTree(query),
    fetchDataGraph(query),
  ]);

  treeResponse.value = tree;
  graphResponse.value = graph;
  loading.value = false;
}

onMounted(refreshVisuals);

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
    refreshVisuals();
  },
);
</script>
