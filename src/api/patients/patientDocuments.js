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
  
  export const getAllPatientDocuments = async (page = 1, limit = 5) => {
    const response = await api.get('/patient-reports', {
      params: {
        page,
        limit
      }
    });
    return response.data;
  };

  export const getDocumentsStats = async () => {
    const response = await api.get('/patient-reports/stats');
    return response.data;
  };

  export const getDocumentsByPatientName = async (name, page = 1, limit = 5) => {
    const response = await api.get('/patient-reports/search', {
      params: {
        name,
        page,
        limit
      }
    });
    return response.data;
  }; 