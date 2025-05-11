import { useEffect, useState } from "react";
import MainLayout from "../../layouts/MainLayout";
import Button from "../../components/ButtonComponent/ButtonComponent";
import { getAllCategories } from "../../api/categories/categories";
import { useCustomNavigate } from "../../hooks/useCustomNavigate";
import { PlusCircle } from "lucide-react";

function CategoriesPage() {
  const [categories, setCategories] = useState([]);

  const { goTo } = useCustomNavigate();

  useEffect(() => {
    async function fetchCategories() {
      try {
        const response = await getAllCategories();
        setCategories(response);
      } catch (error) {
        console.error("Erro ao buscar categorias:", error);
      }
    }

    fetchCategories();
  }, []);

  const handleCategoryClick = (categoryId) => {
    goTo("EXERCISES_BY_CATEGORY", {categoryId});
  };

  const handleCreateCategory = () => {
    goTo("NEW_CATEGORY");
  };

  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-4 sm:mb-0">Categorias de Exercícios</h1>
          <Button 
            onClick={handleCreateCategory}
          >
            <PlusCircle size={20} />
            Nova Categoria
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category) => (
            <div
              key={category._id}
              className="bg-white rounded-xl p-6 cursor-pointer hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100"
              onClick={() => handleCategoryClick(category._id)}
            >
              <div className="flex flex-col h-full">
                <h2 className="text-2xl font-semibold text-gray-800 mb-3">{category.title}</h2>
                <p className="text-gray-600 flex-grow">{category.description}</p>
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <span className="text-blue-600 font-medium hover:text-blue-700 transition-colors">
                    Ver exercícios →
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </MainLayout>
  );
}

export default CategoriesPage;
