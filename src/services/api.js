const API_KEY = "f86445f1-30d8-4f51-9310-86c2e39e0839";
const BASE_URL = "https://api.tif.uin-suska.ac.id/setoran-dev/v1";

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  params: {
    apikey: API_KEY
  }
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

window.api = api;