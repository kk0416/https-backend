<template>
  <el-card class="json-panel">
    <template #header>
      <div class="json-panel__header">
        <div>
          <h3>{{ title }}</h3>
          <p>{{ description }}</p>
        </div>
        <el-button size="small" type="primary" plain @click="copyPayload">
          复制 JSON
        </el-button>
      </div>
    </template>

    <pre class="json-panel__body">{{ serialized }}</pre>
  </el-card>
</template>

<script setup>
import { computed } from 'vue';
import { ElMessage } from 'element-plus';

const props = defineProps({
  title: {
    type: String,
    default: '原始响应',
  },
  description: {
    type: String,
    default: '',
  },
  payload: {
    type: [Object, Array, String, Number, Boolean, null],
    default: null,
  },
});

const serialized = computed(() => {
  if (typeof props.payload === 'string') {
    return props.payload;
  }

  return JSON.stringify(props.payload ?? { empty: true }, null, 2);
});

async function copyPayload() {
  try {
    await navigator.clipboard.writeText(serialized.value);
    ElMessage.success('JSON 已复制');
  } catch {
    ElMessage.error('复制失败');
  }
}
</script>
