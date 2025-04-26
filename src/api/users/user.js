import api from '../axiosInstance'; // ou onde estiver o seu axios configurado

export async function updateUserById(userId, updatedData) {
  const response = await api.put(`/users/${userId}`, updatedData);
  return response.data;
}
