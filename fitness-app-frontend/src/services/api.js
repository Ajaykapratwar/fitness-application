import axios from 'axios';

const base = import.meta.env.VITE_API_URL || 'http://localhost:8080';
const API_URL = `${base}/api`;

const api = axios.create({
  baseURL: API_URL,
});

api.interceptors.request.use((config) => {
  const userId = localStorage.getItem('userId');
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  if (userId) {
    config.headers['X-User-Id'] = userId;
  }
  return config;
});

export const getActivities = () => api.get('/activities');
export const addActivity = (activity) => api.post('/activities', activity);
export const getActivity = (id) => api.get(`/activities/${id}`);
export const getActivityStats = (days = 30) => api.get(`/activities/stats?days=${days}`);
export const getActivitieDetail = (id) => api.get(`/recommendations/activity/${id}`);
export const getAllRecommendations = (userId) => api.get(`/recommendations/user/${userId}`);
export const getLatestRecommendations = (userId, since) =>
  api.get(
    `/recommendations/user/${userId}/latest${since ? `?since=${encodeURIComponent(since)}` : ''}`,
  );

export default api;
