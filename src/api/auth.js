import api from './axiosInstance';

export const loginRequest = (email, password) => {
  return api.post('/auth/login', { email, password });
};
