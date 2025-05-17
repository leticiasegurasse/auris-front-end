import api from "../axiosInstance";

export async function getPatientResponsesByPatientExerciseId(patientExerciseId) {
    const response = await api.get(`/patient-responses/exercise/${patientExerciseId}`);
    return response.data;
}

