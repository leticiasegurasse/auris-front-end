import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import MainLayout from "../../layouts/MainLayout";
import { getCategoryById } from "../../api/exercise_categories/exercise_categories";
import { getExercisesByCategory } from "../../api/exercises/exercise";
import { useCustomNavigate } from "../../hooks/useCustomNavigate";
import Button from "../../components/ButtonComponent/ButtonComponent";

function ExercisesByCategoryPage() {
  const { categoryId } = useParams();
  const { goTo } = useCustomNavigate();

  const [category, setCategory] = useState(null);
  const [exercises, setExercises] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [categoryData, exercisesData] = await Promise.all([
          getCategoryById(categoryId),
          getExercisesByCategory(categoryId),
        ]);

        setCategory(categoryData);
        setExercises(exercisesData);
      } catch (error) {
        console.error("Erro ao buscar dados:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [categoryId]);

  const handleAddExercise = () => {
    goTo("exercise_create", { categoryId }); // 👈 usando seu goTo passando params
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="text-center mt-10">Carregando...</div>
      </MainLayout>
    );
  }

  if (!category) {
    return (
      <MainLayout>
        <div className="text-center mt-10 text-red-500">Categoria não encontrada.</div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">{category.title}</h1>
          <p className="text-gray-600 mt-2">{category.description}</p>
        </div>
        <Button onClick={handleAddExercise}>Adicionar Novo Exercício</Button>
      </div>

      <div>
        <h2 className="text-2xl font-semibold mb-4">Exercícios da Categoria</h2>
        {exercises.length === 0 ? (
          <p className="text-gray-500">Nenhum exercício cadastrado nesta categoria ainda.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {exercises.map((exercise) => (
              <div
                key={exercise._id}
                className="bg-white shadow-md rounded-lg p-4 hover:shadow-lg transition"
              >
                <h3 className="text-lg font-semibold mb-2">{exercise.title}</h3>
                <p className="text-gray-600">{exercise.description}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </MainLayout>
  );
}

export default ExercisesByCategoryPage;
