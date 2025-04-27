import { useEffect, useState } from "react";
import MainLayout from "../../layouts/MainLayout";
import Button from "../../components/ButtonComponent/ButtonComponent";
import { useNavigate } from "react-router-dom";
import { getAllCategories } from "../../api/exerciseCategories/exercise categories";

function ExerciseCategoryPage() {
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();

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
    navigate(`/exercises/category/${categoryId}`);
  };

  return (
    <MainLayout>
      <h1 className="font-bold text-4xl mb-6">Categorias de Exercícios</h1>

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

export default ExerciseCategoryPage;
