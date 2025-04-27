import api from "../axiosInstance";

export async function getExercisesByCategory(categoryId) {
  const response = await api.get(`/exercises/category/${categoryId}`);
  return response.data;
}

export async function createExercise(formData) {
  const response = await api.post("/exercises", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
}