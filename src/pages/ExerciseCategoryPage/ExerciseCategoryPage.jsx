import { useEffect, useState } from "react";
import MainLayout from "../../layouts/MainLayout";
import Button from "../../components/ButtonComponent/ButtonComponent";
import { useCustomNavigate } from "../../hooks/useCustomNavigate";
import { getAllCategories, deleteCategory } from "../../api/exercises/category";
import AlertMessage from "../../components/AlertComponent/AlertMessage";
import { Plus, Trash2, Edit2 } from "lucide-react";

function ExerciseCategoryPage() {
  const [categories, setCategories] = useState([]);
  const [alert, setAlert] = useState(null);
  const { goTo } = useCustomNavigate();

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      const response = await getAllCategories();
      setCategories(response.data);
    } catch (error) {
      console.error("Erro ao carregar categorias:", error);
      setAlert({ type: "error", message: "Erro ao carregar categorias: " + error });
    }
  };

  const handleDelete = async (categoryId) => {
    try {
      await deleteCategory(categoryId);
      setAlert({ type: "success", message: "Categoria excluída com sucesso!" });
      loadCategories();
    } catch (error) {
      console.error("Erro ao excluir categoria:", error);
      setAlert({ type: "error", message: "Erro ao excluir categoria: " + error });
    }
  };

  const handleEdit = (categoryId) => {
    goTo("EXERCISES_BY_CATEGORY", { categoryId });
  };

  const handleCreate = () => {
    goTo("NEW_CATEGORY");
  };

  return (
    <MainLayout>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-bold text-4xl">Categorias de Exercícios</h1>
        <Button onClick={handleCreate}>Nova Categoria</Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {categories.map((category) => (
          <div
            key={category._id}
            className="bg-white shadow-md rounded-lg p-4 cursor-pointer hover:shadow-lg transition"
            onClick={() => handleEdit(category._id)}
          >
            <h2 className="text-xl font-semibold mb-2">{category.title}</h2>
            <p className="text-gray-600">{category.description}</p>
          </div>
        ))}
      </div>

      {alert && <AlertMessage type={alert.type} message={alert.message} />}
    </MainLayout>
  );
}

export default ExerciseCategoryPage;
