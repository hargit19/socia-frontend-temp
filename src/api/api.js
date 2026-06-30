import axios from 'axios';

const BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const api = axios.create({ baseURL: BASE });

// ── Influencer ──────────────────────────────────────────────
export const registerInfluencer = (data) => api.post('/api/influencers', data);
export const getInfluencer = (id) => api.get(`/api/influencers/${id}`);
export const getInfluencerStats = (id) => api.get(`/api/users/${id}/stats`);
export const getInfluencerProjects = (id) => api.get(`/api/users/${id}/projects/active`);
export const getProjectSearch = () => api.get('/api/projects/approved');
export const enrollProject = (projectId, influencerId) =>
  api.post(`/api/projects/${projectId}/enroll`, { influencer_id: influencerId });
export const getInfluencerActiveProjects = (id) => api.get(`/api/influencers/${id}/projects`);
export const getProjectInfluencers = (id) => api.get(`/api/projects/${id}/influencers`);
export const submitPostUrl = (data) => api.post('/api/submissions', data);
export const getSubmissions = (id) => api.get(`/api/users/${id}/submissions`);
export const getEarnings = (id) => api.get(`/api/earnings/${id}`);

// ── NPO ─────────────────────────────────────────────────────
export const registerNPO = (data) => api.post('/api/npos', data);
export const getNPO = (id) => api.get(`/api/npos/${id}`);
export const getNPOProjects = (npoId) => api.get(`/api/npos/${npoId}/projects`);
export const createProject = (data) => api.post('/api/projects', data);
export const updateProject = (id, data) => api.put(`/api/projects/${id}`, data);
export const submitProject = (id) => api.post(`/api/projects/${id}/submit`);

// ── Admin ────────────────────────────────────────────────────
export const getAdminStats = () => api.get('/api/admin/stats');
export const listNPOs = (status) => api.get('/api/admin/npos', { params: { status } });
export const approveNPO = (id) => api.post(`/api/admin/npos/${id}/approve`);
export const rejectNPO = (id, reason) => api.post(`/api/admin/npos/${id}/reject`, { reason });
export const listProjects = (status) => api.get('/api/admin/projects', { params: { status } });
export const approveProject = (id) => api.post(`/api/admin/projects/${id}/approve`);
export const rejectProject = (id, reason) => api.post(`/api/admin/projects/${id}/reject`, { reason });
export const listInfluencers = (status) => api.get('/api/admin/influencers', { params: { status } });
export const approveInfluencer = (id) => api.post(`/api/admin/influencers/${id}/approve`);
export const rejectInfluencer = (id, reason) => api.post(`/api/admin/influencers/${id}/reject`, { reason });
export const getPendingReviews = () => api.get('/api/admin/pending');
export const getLiveActivity = () => api.get('/api/admin/activity');

export default api;
