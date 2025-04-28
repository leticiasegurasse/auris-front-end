import api from "../axiosInstance";

export const registerPatientRequest = (data) => {
  return api.post("/auth/register", data);
};

export const getAllPatients = () => {
    return api.get("/patients");
};

export const getPatientById = async (id) => {
  const response = await api.get(`/patients/${id}`);
  return response.data;
};

export const updatePatientById = async (id, updatedData) => {
  const response = await api.put(`/patients/${id}`, updatedData);
  return response.data;
};

// PATIENT EXERCISE
export async function getPatientExercisesByPatientId(patientId) {
  const response = await api.get(`/patient-exercises/patient/${patientId}`);
  return response.data;
}

export async function createPatientExercise(data) {
  const response = await api.post('/patient-exercises', data);
  return response.data;
}