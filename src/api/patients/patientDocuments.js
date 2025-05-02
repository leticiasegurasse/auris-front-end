import api from "../axiosInstance";

export const createPatientDocument = async (data) => {
    const response = await api.post('/patient-reports', {
      patientId: data.patientId,
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
  
  export const getAllPatientDocuments = async () => {
    const response = await api.get('/patient-reports');
    return response.data;
  }; 