import api from "../axiosInstance";

export async function getExercisesByCategory(categoryId) {
  const response = await api.get(`/exercises/category/${categoryId}`);
  return response.data;
}
