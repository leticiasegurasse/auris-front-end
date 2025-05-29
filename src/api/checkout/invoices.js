import api from "../axiosInstance";

export async function getAllInvoices() {
    const response = await api.get("/invoices");
    return response.data;
}