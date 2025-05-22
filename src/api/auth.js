import api from './axiosInstance';

export const loginRequest = (email, password) => {
  return api.post('/auth/login', { email, password });
};

export const registerRequest = (data) => {
    return api.post('/auth/register', data);
};

export const verifyToken = async () => {
  try {
    const response = await api.get('/auth/verify-token');
    return response.data;
  } catch (error) {
    throw error;
  }
};
