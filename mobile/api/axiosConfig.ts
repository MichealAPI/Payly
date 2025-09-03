import axios from 'axios';

const isProd = process.env.NODE_ENV === 'production';

const apiClient = axios.create({
  baseURL: isProd ? 'https://api.payly.it/api' : 'http://192.168.1.200:5000/api',
  timeout: 10000, // 10 seconds timeout
  withCredentials: true, // Include cookies in requests
});

// Simple dev logging to verify requests actually fire
if (!isProd) {
  apiClient.interceptors.request.use((config) => {
    const fullUrl = (config.baseURL ?? '') + (config.url ?? '');
    // eslint-disable-next-line no-console
    console.log('[api][request]', config.method?.toUpperCase(), fullUrl, config.data ?? '');
    return config;
  });
  apiClient.interceptors.response.use(
    (res) => {
      // eslint-disable-next-line no-console
      console.log('[api][response]', res.status, res.config.url, res.data);
      return res;
    },
    (error) => {
      // eslint-disable-next-line no-console
      console.log('[api][error]', error.response?.status, error.config?.url, error.response?.data ?? error.message);
      return Promise.reject(error);
    }
  );
}

export function setSessionHeader(sessionId?: string | null) {
  if (sessionId) {
    apiClient.defaults.headers.common['x-session-id'] = sessionId;
  } else {
    delete apiClient.defaults.headers.common['x-session-id'];
  }
}

export default apiClient;
