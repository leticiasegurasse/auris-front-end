import api from "../axiosInstance";

export const registerPatientRequest = (data) => {
  return api.post("/auth/register", data);
};

export const getAllPatients = async (page = 1, limit = 5) => {
    try {
        const response = await api.get("/patients", {
            params: {
                page,
                limit
            }
        });
        return response.data;
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