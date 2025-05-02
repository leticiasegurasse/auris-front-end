import api from "../axiosInstance";

export async function createAppointment(appointmentData) {
  console.log(appointmentData);
  const response = await api.post("/agenda", appointmentData);
  return response.data;
}

export async function getAppointments() {
  const response = await api.get("/agenda");
  return response.data;
}

export async function getAppointmentById(id) {
  const response = await api.get(`/agenda/${id}`);
  return response.data;
}

export async function updateAppointment(id, appointmentData) {
  const response = await api.put(`/agenda/${id}`, appointmentData);
  return response.data;
}

export async function deleteAppointment(id) {
  const response = await api.delete(`/agenda/${id}`);
  return response.data;
}

export async function getAppointmentsByTherapist(therapistId) {
  const response = await api.get(`/agenda/therapist/${therapistId}`);
  return response.data;
}

export async function getAppointmentsByPatient(patientId) {
  const response = await api.get(`/agenda/patient/${patientId}`);
  return response.data;
} 