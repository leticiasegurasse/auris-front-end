import api from "../axiosInstance";

export async function getAllInvoices() {
    const response = await api.get("/invoices");
    return response.data;
}

export async function cancelSubscription(therapistId) {
    const response = await api.post(`/therapists/${therapistId}/cancel-subscription`);
    return response.data;
}