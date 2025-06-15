import api from '../axiosInstance'; // ou onde estiver o seu axios configurado

export async function updateUserById(userId, updatedData) {
  const response = await api.put(`/users/${userId}`, updatedData);
  return response.data;
}

export async function getUserById(userId) {
  const response = await api.get(`/users/${userId}`);
  return response.data;
}
