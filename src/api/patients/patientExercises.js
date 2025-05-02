import api from "../axiosInstance";

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