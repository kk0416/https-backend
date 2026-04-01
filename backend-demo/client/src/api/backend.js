import { request } from './http';

export function fetchHealthProbe() {
  return request('/health', {
    useApiPrefix: false,
  });
}

export function fetchApiHealth() {
  return request('/health');
}

export function fetchDashboardSummary(query) {
  return request('/dashboard/data-summary', {
    query,
  });
}

export function fetchDashboardSummaryAlias(query) {
  return request('/data-summary', {
    query,
  });
}

export function fetchDataAssets(query) {
  return request('/data-assets', {
    query,
  });
}

export function fetchUploadOptions() {
  return request('/data-assets/upload-options');
}

export function fetchDataTree(query) {
  return request('/data-assets/tree', {
    query,
  });
}

export function fetchDataGraph(query) {
  return request('/data-assets/graph', {
    query,
  });
}

export function createPointCloudTask(id) {
  return request(`/data-assets/${encodeURIComponent(id)}/generate-point-cloud`, {
    method: 'POST',
  });
}

export function uploadRawData(formData) {
  return request('/data-assets/upload-raw', {
    method: 'POST',
    body: formData,
  });
}

export function fetchTasks(query) {
  return request('/tasks', {
    query,
  });
}
