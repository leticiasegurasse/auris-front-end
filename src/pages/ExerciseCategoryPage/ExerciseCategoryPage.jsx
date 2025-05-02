import { useEffect, useState } from "react";
import MainLayout from "../../layouts/MainLayout";
import Button from "../../components/ButtonComponent/ButtonComponent";
import { useCustomNavigate } from "../../hooks/useCustomNavigate";
import { getAllCategories, deleteCategory } from "../../api/exercises/category";
import AlertMessage from "../../components/AlertComponent/AlertMessage";
import { Plus, Trash2, Edit2, BookOpen, ChevronRight, Star } from "lucide-react";

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
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col sm:flex-row items-center justify-between mb-12">
            <div className="flex items-center gap-4 mb-6 sm:mb-0">
              <div className="p-3 bg-blue-100 rounded-full">
                <BookOpen className="text-blue-600" size={24} />
              </div>
              <h1 className="text-4xl font-bold text-gray-800">Categorias de Exercícios</h1>
            </div>
            <Button 
              onClick={handleCreate}
              className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-6 py-3 rounded-lg transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-105"
            >
              <Plus size={20} />
              Nova Categoria
            </Button>
          </div>

          {alert && (
            <AlertMessage 
              type={alert.type} 
              message={alert.message} 
              className="mb-8" 
              onClose={() => setAlert(null)} 
            />
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((category) => (
              <div
                key={category._id}
                className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100"
              >
                <div className="flex flex-col h-full">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-blue-100 rounded-full">
                        <Star className="text-blue-600" size={20} />
                      </div>
                      <h2 className="text-xl font-semibold text-gray-800">{category.title}</h2>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(category._id)}
                        className="p-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors"
                      >
                        <Edit2 size={18} />
                      </button>
                      <button
                        onClick={() => handleDelete(category._id)}
                        className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>

                  <p className="text-gray-600 mb-6 flex-grow">{category.description}</p>

                  <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-100">
                    <span className="text-sm text-gray-500">Exercícios disponíveis</span>
                    <button
                      onClick={() => handleEdit(category._id)}
                      className="flex items-center gap-1 text-blue-600 hover:text-blue-700 transition-colors"
                    >
                      Ver exercícios
                      <ChevronRight size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {categories.length === 0 && (
            <div className="text-center py-12">
              <div className="bg-white rounded-xl p-8 max-w-md mx-auto shadow-lg">
                <div className="p-4 bg-blue-100 rounded-full w-16 h-16 mx-auto mb-4">
                  <BookOpen className="text-blue-600 mx-auto" size={32} />
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">Nenhuma categoria encontrada</h3>
                <p className="text-gray-600 mb-4">Comece criando sua primeira categoria de exercícios</p>
                <Button 
                  onClick={handleCreate}
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-6 py-3 rounded-lg transition-all duration-300 shadow-md hover:shadow-lg"
                >
                  Criar Primeira Categoria
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
}

export default ExerciseCategoryPage;
