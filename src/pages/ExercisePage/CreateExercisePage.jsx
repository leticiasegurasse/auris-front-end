import { useState } from "react";
import { useParams } from "react-router-dom";
import MainLayout from "../../layouts/MainLayout";
import Button from "../../components/ButtonComponent/ButtonComponent";
import { createExercise } from "../../api/exercises/exercise";
import { useCustomNavigate } from "../../hooks/useCustomNavigate";
import PageHeader from "../../components/PageHeader/PageHeader";

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
      goTo("EXERCISES_BY_CATEGORY", { categoryId });
    } catch (error) {
      console.error("Erro ao criar exercício:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <MainLayout>
      <PageHeader 
        title="Criar Novo Exercício"
        description="Preencha os campos abaixo para criar um novo exercício"
      />
      <div className="max-w-2xl mx-auto mt-10 p-6 bg-white rounded-xl shadow-lg">
        
        <form onSubmit={handleSubmit} className="flex flex-col gap-6 mt-8" encType="multipart/form-data">
          <div>
            <label className="block text-gray-700 font-medium mb-2">Título</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
              placeholder="Digite o título do exercício"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-2">Descrição</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows="3"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 resize-none"
              placeholder="Digite uma descrição para o exercício"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-2">Instruções</label>
            <textarea
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
              rows="4"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 resize-none"
              placeholder="Digite as instruções para realizar o exercício"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-2">Áudio de Referência</label>
            <input
              type="file"
              accept="audio/*"
              onChange={(e) => setAudioFile(e.target.files[0])}
              required
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
            />
          </div>

          <div className="flex justify-end gap-4 mt-4">
            <Button 
              type="button"
              onClick={() => goTo("EXERCISES_BY_CATEGORY", { categoryId })}
              className="px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-lg transition-all duration-200"
            >
              Cancelar
            </Button>
            <Button 
              type="submit" 
              disabled={loading}
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-lg transition-all duration-200 shadow-md hover:shadow-lg"
            >
              {loading ? "Salvando..." : "Salvar Exercício"}
            </Button>
          </div>
        </form>
      </div>
    </MainLayout>
  );
}

export default CreateExercisePage;
