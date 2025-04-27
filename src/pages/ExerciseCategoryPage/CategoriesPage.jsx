import { useEffect, useState } from "react";
import MainLayout from "../../layouts/MainLayout";
import Button from "../../components/ButtonComponent/ButtonComponent";
import { getAllCategories } from "../../api/categories/categories";
import { useCustomNavigate } from "../../hooks/useCustomNavigate";

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
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-bold text-4xl">Categorias de Exercícios</h1>
        <Button onClick={handleCreateCategory}>Nova Categoria</Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {categories.map((category) => (
          <div
            key={category._id}
            className="bg-white shadow-md rounded-lg p-4 cursor-pointer hover:shadow-lg transition"
            onClick={() => handleCategoryClick(category._id)}
          >
            <h2 className="text-xl font-semibold mb-2">{category.title}</h2>
            <p className="text-gray-600">{category.description}</p>
          </div>
        ))}
      </div>
    </MainLayout>
  );
}

export default CategoriesPage;
