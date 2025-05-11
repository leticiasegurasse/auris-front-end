import api from '../axiosInstance'; // ou onde estiver o seu axios configurado

export async function updateTherapistById(therapistId, updatedData) {
  const response = await api.put(`/therapists/${therapistId}`, updatedData);
  return response.data;
}
