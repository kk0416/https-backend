const DATA_TYPE_LABELS = {
  raw: '原始数据',
  point_cloud: '点云数据',
  gaussian: '高斯地图',
  map_2d: '机器人地图-2D',
  map_3d: '机器人地图-3D',
};

const STATUS_LABELS = {
  uploading: '上传中',
  queued: '排队中',
  processing: '处理中',
  ready: '已完成',
  failed: '失败',
  deleted: '已删除',
  running: '运行中',
  success: '成功',
  canceled: '已取消',
};

const DATA_TYPE_COLORS = {
  raw: '#78a65a',
  point_cloud: '#2b78c5',
  gaussian: '#a66ad1',
  map_2d: '#d97d2f',
  map_3d: '#dd5764',
};

export function formatTypeLabel(value) {
  return DATA_TYPE_LABELS[value] || value || '-';
}

export function formatStatusLabel(value) {
  return STATUS_LABELS[value] || value || '-';
}

export function formatPercent(value) {
  if (value === null || value === undefined || Number.isNaN(Number(value))) {
    return '-';
  }

  return `${value}%`;
}

export function formatDateTime(value) {
  if (!value) {
    return '-';
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleString('zh-CN', {
    hour12: false,
  });
}

export function pickStatusTag(value) {
  if (['ready', 'success'].includes(value)) {
    return 'success';
  }

  if (['processing', 'running', 'uploading'].includes(value)) {
    return 'warning';
  }

  if (['failed', 'deleted', 'canceled'].includes(value)) {
    return 'danger';
  }

  return 'info';
}

export function pickTypeColor(value) {
  return DATA_TYPE_COLORS[value] || '#68829e';
}

export function extractPayload(response) {
  return response?.data?.data ?? null;
}
