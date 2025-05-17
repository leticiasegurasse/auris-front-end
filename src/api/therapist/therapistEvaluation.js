import api from '../axiosInstance'; // ou onde estiver o seu axios configurado

export async function createTherapistEvaluation(data) {
  const response = await api.post('/therapist-evaluations', data);
  return response.data;
}

export async function getTherapistEvaluationByPatientResponseId(patientResponseId) {
  const response = await api.get(`/therapist-evaluations/patient-response/${patientResponseId}`);
  return response.data;
}

