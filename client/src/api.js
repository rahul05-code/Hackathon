import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5005/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Jobs API
export const getJobs = (params) => api.get('/jobs', { params });
export const getJobById = (id) => api.get(`/jobs/${id}`);
export const createJob = (data) => api.post('/jobs', data);
export const updateJobStage = (id, data) => api.patch(`/jobs/${id}/stage`, data);
export const assignMechanic = (id, mechanicId) => api.put(`/jobs/${id}/assign`, { mechanicId });

// Mechanics API
export const getMechanics = () => api.get('/mechanics');
export const createMechanic = (data) => api.post('/mechanics', data);

// Analytics API
export const getAnalytics = () => api.get('/analytics');

export default api;
