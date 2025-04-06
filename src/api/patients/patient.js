import api from "../axiosInstance";

export const registerPatientRequest = (data) => {
  return api.post("/auth/register", data);
};

export const getAllPatients = () => {
    return api.get("/patients");
};