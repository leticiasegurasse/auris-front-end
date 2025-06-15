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

export async function updateCategoryById(id, updatedData) {
  const response = await api.put(`/categories/${id}`, updatedData);
  return response.data;
}

export async function deleteCategoryById(id) {
  const response = await api.delete(`/categories/${id}`);
  return response.data;
}

export async function getCategoriesExerciseStats() {
  const response = await api.get("/categories/stats/exercises");
  const categories = response.data;
  
  const totalExercises = categories.reduce((sum, category) => sum + category.exerciseCount, 0);
  
  return {
    categories,
    totalExercises
  };
}
