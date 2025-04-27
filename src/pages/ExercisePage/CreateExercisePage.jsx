import { useState } from "react";
import { useParams } from "react-router-dom";
import MainLayout from "../../layouts/MainLayout";
import Button from "../../components/ButtonComponent/ButtonComponent";
import { createExercise } from "../../api/exercises/exercise";
import { useCustomNavigate } from "../../hooks/useCustomNavigate";

function CreateExercisePage() {
  const { categoryId } = useParams();
  const { goTo } = useCustomNavigate();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [instructions, setInstructions] = useState("");
  const [audioFile, setAudioFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!audioFile) {
      alert("Por favor, selecione um arquivo de áudio!");
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("instructions", instructions);
    formData.append("categoryId", categoryId);
    formData.append("file", audioFile);

    try {
      setLoading(true);
      await createExercise(formData);
      goTo("exercises_by_category", { categoryId });
    } catch (error) {
      console.error("Erro ao criar exercício:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <MainLayout>
      <div className="max-w-2xl mx-auto mt-10 p-6 bg-white rounded shadow-md">
        <h1 className="text-3xl font-bold mb-6">Criar Novo Exercício</h1>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4" encType="multipart/form-data">
          <div>
            <label className="block text-gray-700 mb-2">Título</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="w-full p-2 border rounded"
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-2">Descrição</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows="3"
              className="w-full p-2 border rounded"
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-2">Instruções</label>
            <textarea
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
              rows="4"
              className="w-full p-2 border rounded"
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-2">Áudio de Referência</label>
            <input
              type="file"
              accept="audio/*"
              onChange={(e) => setAudioFile(e.target.files[0])}
              required
              className="w-full"
            />
          </div>

          <Button type="submit" disabled={loading}>
            {loading ? "Salvando..." : "Salvar Exercício"}
          </Button>
        </form>
      </div>
    </MainLayout>
  );
}

export default CreateExercisePage;
