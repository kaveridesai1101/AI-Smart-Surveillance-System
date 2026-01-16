import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:8001',
});

// Context Helper
export const setUserContext = (userId) => {
    api.defaults.headers.common['X-User-ID'] = userId;
};

export const getIncidents = () => api.get('/incidents');
export const getCameras = () => api.get('/cameras');
export const addCamera = (camData) => api.post('/cameras/', null, { params: camData });
export const deleteCamera = (id) => api.delete(`/cameras/${id}`);
export const getHealth = () => api.get('/health');
export const setAIContext = (context) => api.post('/api/ai/context', context);

export default api;
