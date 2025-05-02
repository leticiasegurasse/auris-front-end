import api from "../axiosInstance";

export const registerPatientRequest = (data) => {
  return api.post("/auth/register", data);
};

export const getAllPatients = async () => {
    try {
        const response = await api.get("/patients");
        console.log('Resposta da API em getAllPatients:', response);
        return response;
    } catch (error) {
        console.error('Erro ao buscar pacientes:', error);
        throw error;
    }
};

export const getPatientById = async (id) => {
  const response = await api.get(`/patients/${id}`);
  return response.data;
};

export const updatePatientById = async (id, updatedData) => {
  const response = await api.put(`/patients/${id}`, updatedData);
  return response.data;
};