import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import MainLayout from "../../layouts/MainLayout";
import { getExerciseById } from "../../api/exercises/exercise";
import BackButton from "../../components/ButtonComponent/BackButton";

function ExerciseDetailsPage() {
  const { exerciseId } = useParams();
  const [exercise, setExercise] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchExercise() {
      try {
        const response = await getExerciseById(exerciseId);
        setExercise(response);
      } catch (error) {
        console.error("Erro ao buscar exercício:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchExercise();
  }, [exerciseId]);

  if (loading) {
    return (
      <MainLayout>
        <div className="text-center mt-10">Carregando...</div>
      </MainLayout>
    );
  }

  if (!exercise) {
    return (
      <MainLayout>
        <div className="text-center mt-10 text-red-500">Exercício não encontrado.</div>
      </MainLayout>
    );
  }

  const audioUrl = `${import.meta.env.VITE_API_URL}/exercises/audio/${exercise.audioReference}`;

  return (
    <MainLayout>
        <BackButton/>
      <div className="max-w-2xl mx-auto mt-10 p-6 bg-white rounded shadow-md">
        <h1 className="text-3xl font-bold mb-6">{exercise.title}</h1>

        <div className="mb-4">
          <h2 className="text-xl font-semibold">Descrição</h2>
          <p className="text-gray-700">{exercise.description || "Sem descrição"}</p>
        </div>

        <div className="mb-4">
          <h2 className="text-xl font-semibold">Instruções</h2>
          <p className="text-gray-700">{exercise.instructions || "Sem instruções específicas"}</p>
        </div>

        <div className="mb-4">
          <h2 className="text-xl font-semibold mb-2">Áudio de Referência</h2>
          {exercise.audioReference ? (
            <audio controls className="w-full">
              <source src={audioUrl} type="audio/mpeg" />
              Seu navegador não suporta o elemento de áudio.
            </audio>
          ) : (
            <p className="text-gray-500">Nenhum áudio cadastrado.</p>
          )}
        </div>
      </div>
    </MainLayout>
  );
}

export default ExerciseDetailsPage;
