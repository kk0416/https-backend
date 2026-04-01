import { computed, reactive } from 'vue';

const STORAGE_KEY = 'gaussian-backend-client-config';
const VALID_DATA_SOURCE_MODES = new Set(['proxy', 'direct', 'mock']);

const defaults = {
  dataSourceMode: import.meta.env.VITE_DATA_SOURCE_MODE || 'proxy',
  baseUrl: import.meta.env.VITE_API_BASE || '',
  apiPrefix: import.meta.env.VITE_API_PREFIX || '/api/v1',
  defaultSiteId: import.meta.env.VITE_DEFAULT_SITE_ID || '',
  defaultSceneId: import.meta.env.VITE_DEFAULT_SCENE_ID || '',
  defaultRawAssetId: import.meta.env.VITE_DEFAULT_RAW_ASSET_ID || '',
};

function normalizePrefix(value) {
  const trimmed = String(value || '/api/v1').trim();
  if (!trimmed) {
    return '/api/v1';
  }

  const normalized = trimmed.startsWith('/') ? trimmed : `/${trimmed}`;
  return normalized.replace(/\/+$/, '') || '/api/v1';
}

function normalizeBaseUrl(value) {
  return String(value || '')
    .trim()
    .replace(/\/+$/, '');
}

function normalizeDataSourceMode(value) {
  const normalized = String(value || 'proxy').trim().toLowerCase();
  return VALID_DATA_SOURCE_MODES.has(normalized) ? normalized : 'proxy';
}

function readStorage() {
  if (typeof window === 'undefined') {
    return null;
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function persistStorage(payload) {
  if (typeof window === 'undefined') {
    return;
  }

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
}

function normalizeConfig(payload = {}) {
  return {
    dataSourceMode: normalizeDataSourceMode(payload.dataSourceMode ?? defaults.dataSourceMode),
    baseUrl: normalizeBaseUrl(payload.baseUrl ?? defaults.baseUrl),
    apiPrefix: normalizePrefix(payload.apiPrefix ?? defaults.apiPrefix),
    defaultSiteId: String(payload.defaultSiteId ?? defaults.defaultSiteId).trim(),
    defaultSceneId: String(payload.defaultSceneId ?? defaults.defaultSceneId).trim(),
    defaultRawAssetId: String(payload.defaultRawAssetId ?? defaults.defaultRawAssetId).trim(),
  };
}

export const appConfig = reactive(normalizeConfig(readStorage() || defaults));

export const resolvedBackendLabel = computed(() => {
  if (appConfig.dataSourceMode === 'mock') {
    return `Mock Dataset -> ${appConfig.apiPrefix}`;
  }

  if (appConfig.dataSourceMode === 'direct') {
    return appConfig.baseUrl
      ? `${appConfig.baseUrl}${appConfig.apiPrefix}`
      : `Direct Mode -> ${appConfig.apiPrefix}`;
  }

  return `Vite Proxy -> ${appConfig.apiPrefix}`;
});

export function saveAppConfig(payload) {
  Object.assign(appConfig, normalizeConfig(payload));
  persistStorage(appConfig);
}

export function resetAppConfig() {
  Object.assign(appConfig, normalizeConfig(defaults));
  persistStorage(appConfig);
}

export function cloneAppConfig() {
  return {
    ...appConfig,
  };
}
