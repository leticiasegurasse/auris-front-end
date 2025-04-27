import api from "../axiosInstance";

export async function getAllCategories() {
    const response = await api.get("/categories");
    return response.data;
}

export async function createCategory(data) {
    const response = await api.post("/categories", data);
    return response.data;
}
  
export async function getCategoryById(id) {
  const response = await api.get(`/categories/${id}`);
  return response.data;
}
