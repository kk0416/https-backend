<template>
  <el-card class="chart-panel">
    <template #header>
      <div class="chart-panel__header">
        <div>
          <h3>{{ title }}</h3>
          <p>{{ description }}</p>
        </div>
        <el-tag v-if="tagLabel" type="info" effect="plain">{{ tagLabel }}</el-tag>
      </div>
    </template>

    <div class="chart-panel__body">
      <div ref="chartRef" class="chart-panel__canvas"></div>
      <div v-if="!hasOption" class="chart-panel__empty">{{ emptyText }}</div>
    </div>
  </el-card>
</template>

<script setup>
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue';
import { CanvasRenderer } from 'echarts/renderers';
import { GraphChart, TreeChart } from 'echarts/charts';
import { LegendComponent, TooltipComponent } from 'echarts/components';
import { use, init } from 'echarts/core';

use([
  CanvasRenderer,
  GraphChart,
  TreeChart,
  LegendComponent,
  TooltipComponent,
]);

const props = defineProps({
  title: {
    type: String,
    default: '',
  },
  description: {
    type: String,
    default: '',
  },
  tagLabel: {
    type: String,
    default: '',
  },
  option: {
    type: Object,
    default: null,
  },
  emptyText: {
    type: String,
    default: '暂无图形数据',
  },
});

const chartRef = ref(null);
let chartInstance;

const hasOption = computed(() => Boolean(props.option));

function renderChart() {
  if (!chartRef.value) {
    return;
  }

  if (!chartInstance) {
    chartInstance = init(chartRef.value);
  }

  if (!props.option) {
    chartInstance.clear();
    return;
  }

  chartInstance.setOption(props.option, true);
  chartInstance.resize();
}

function resizeChart() {
  chartInstance?.resize();
}

watch(
  () => props.option,
  () => {
    renderChart();
  },
  { deep: true },
);

onMounted(() => {
  renderChart();
  window.addEventListener('resize', resizeChart);
});

onBeforeUnmount(() => {
  window.removeEventListener('resize', resizeChart);
  chartInstance?.dispose();
  chartInstance = undefined;
});
</script>
