import { appConfig } from '../composables/useAppConfig';
import { mockRequest } from '../mocks/backend';

function buildQuery(query = {}) {
  const search = new URLSearchParams();

  Object.entries(query).forEach(([key, value]) => {
    if (value === undefined || value === null) {
      return;
    }

    const normalized = String(value).trim();
    if (!normalized) {
      return;
    }

    search.set(key, normalized);
  });

  const result = search.toString();
  return result ? `?${result}` : '';
}

function buildUrl(path, { query, useApiPrefix = true } = {}) {
  const baseUrl = appConfig.dataSourceMode === 'direct' ? appConfig.baseUrl : '';
  const prefix = useApiPrefix ? appConfig.apiPrefix : '';
  const search = buildQuery(query);

  return `${baseUrl}${prefix}${path}${search}`;
}

async function parseResponse(response) {
  const rawText = await response.text();

  if (!rawText) {
    return {
      parsed: null,
      rawText: '',
    };
  }

  try {
    return {
      parsed: JSON.parse(rawText),
      rawText,
    };
  } catch {
    return {
      parsed: null,
      rawText,
    };
  }
}

export async function request(path, options = {}) {
  const {
    method = 'GET',
    query,
    body,
    headers,
    useApiPrefix = true,
  } = options;

  const url = buildUrl(path, {
    query,
    useApiPrefix,
  });
  const isFormData = typeof FormData !== 'undefined' && body instanceof FormData;

  if (appConfig.dataSourceMode === 'mock') {
    return mockRequest({
      method,
      path,
      query,
      body,
      url: `mock:${url || path}`,
    });
  }

  const startedAt = performance.now();

  try {
    const response = await fetch(url, {
      method,
      headers: {
        Accept: 'application/json',
        ...(!isFormData && body ? { 'Content-Type': 'application/json' } : {}),
        ...headers,
      },
      body: body ? (isFormData ? body : JSON.stringify(body)) : undefined,
    });

    const { parsed, rawText } = await parseResponse(response);

    return {
      ok: response.ok,
      status: response.status,
      statusText: response.statusText,
      url,
      durationMs: Math.round(performance.now() - startedAt),
      data: parsed,
      rawText,
    };
  } catch (error) {
    return {
      ok: false,
      status: 0,
      statusText: error instanceof Error ? error.message : 'Request failed',
      url,
      durationMs: Math.round(performance.now() - startedAt),
      data: {
        code: -1,
        message: error instanceof Error ? error.message : 'Request failed',
        data: null,
      },
      rawText: '',
    };
  }
}
