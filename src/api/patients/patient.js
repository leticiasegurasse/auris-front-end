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

export async function deletePatientExercise(exerciseId) {
  const response = await api.delete(`/patient-exercises/${exerciseId}`);
  return response.data;
}

export const createPatientDocument = async (data) => {
  const response = await api.post('/patient-reports', {
    patientId: data.patientId, // <- este campo é obrigatório
    type: data.type,
    report: data.report,
    observation: data.observation
  });
  return response.data;
};


export const getPatientDocuments = async (patientId) => {
  const response = await api.get(`/patient-reports/patient/${patientId}`);
  return response.data;
};

export const getDocumentById = async (id) => {
  const response = await api.get(`/patient-reports/${id}`);
  return response.data;
};

export const updatePatientDocument = async (id, data) => {
  const response = await api.put(`/patient-reports/${id}`, data);
  return response.data;
};

export const deletePatientDocument = async (id) => {
  const response = await api.delete(`/patient-reports/${id}`);
  return response.data;
};