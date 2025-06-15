import api from '../axiosInstance'; // ou onde estiver o seu axios configurado

export async function updateTherapistById(therapistId, updatedData) {
  const response = await api.put(`/therapists/${therapistId}`, updatedData);
  return response.data;
}

export async function getTherapistById(therapistId) {
  const response = await api.get(`/therapists/${therapistId}`);
  return response.data;
}
