import api from './axiosInstance';

export const loginRequest = (email, password) => {
  return api.post('/auth/login', { email, password });
};

export const registerRequest = (data) => {
    return api.post('/auth/register', data);
  };