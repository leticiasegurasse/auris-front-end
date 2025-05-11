import api from "../axiosInstance";

export async function getRecentLogs() {
    const response = await api.get("/logs");
    return response.data;
} 