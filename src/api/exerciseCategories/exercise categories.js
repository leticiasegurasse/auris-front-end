import api from "../axiosInstance";

export async function getAllCategories() {
    const response = await api.get("/categories");
    return response.data;
}