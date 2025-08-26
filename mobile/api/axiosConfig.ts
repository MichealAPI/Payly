import axios from 'axios';

const isProd = process.env.NODE_ENV === 'production';

const apiClient = axios.create({
  baseURL: isProd ? 'https://api.payly.it/api' : 'http://192.168.1.200:5000/api',
  timeout: 10000, // 10 seconds timeout
  withCredentials: true, // Include cookies in requests
});

export function setSessionHeader(sessionId?: string | null) {
  if (sessionId) {
    apiClient.defaults.headers.common['x-session-id'] = sessionId;
  } else {
    delete apiClient.defaults.headers.common['x-session-id'];
  }
}

export default apiClient;
