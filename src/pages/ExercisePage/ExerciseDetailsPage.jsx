import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import MainLayout from "../../layouts/MainLayout";
import { getExerciseById, deleteExerciseById, updateExerciseById } from "../../api/exercises/exercise";
import BackButton from "../../components/ButtonComponent/BackButton";
import Button from "../../components/ButtonComponent/ButtonComponent";
import AlertMessage from "../../components/AlertComponent/AlertMessage";
import { Trash2, Pencil } from "lucide-react";
import { useCustomNavigate } from "../../hooks/useCustomNavigate";

function ExerciseDetailsPage() {
  const { exerciseId } = useParams();
  const { goBack } = useCustomNavigate();
  const [exercise, setExercise] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [alert, setAlert] = useState(null);
  const [editForm, setEditForm] = useState({
    title: "",
    description: "",
    instructions: "",
    audioFile: null
  });

  useEffect(() => {
    async function fetchExercise() {
      try {
        const response = await getExerciseById(exerciseId);
        setExercise(response);
        setEditForm({
          title: response.title,
          description: response.description,
          instructions: response.instructions
        });
      } catch (error) {
        console.error("Erro ao buscar exercício:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchExercise();
  }, [exerciseId]);

  const handleDeleteExercise = async () => {
    try {
      await deleteExerciseById(exerciseId);
      setAlert({ type: "success", message: "Exercício excluído com sucesso!" });
      setIsDeleteModalOpen(false);
      goBack();
    } catch (error) {
      console.error("Erro ao excluir exercício:", error);
      setAlert({ type: "error", message: "Erro ao excluir exercício: " + error });
    }
  };

  const handleEditClick = () => {
    setIsEditModalOpen(true);
  };

  const handleCancelEdit = () => {
    setIsEditModalOpen(false);
    setEditForm({
      title: exercise.title,
      description: exercise.description,
      instructions: exercise.instructions
    });
  };

  const handleSaveEdit = async () => {
    try {
      const formData = new FormData();
      formData.append("title", editForm.title);
      formData.append("description", editForm.description);
      formData.append("instructions", editForm.instructions);
      if (editForm.audioFile) {
        formData.append("audioFile", editForm.audioFile);
      }

      const updatedExercise = await updateExerciseById(exerciseId, formData);
      setExercise(updatedExercise);
      setIsEditModalOpen(false);
      setAlert({ type: "success", message: "Exercício atualizado com sucesso!" });
    } catch (error) {
      console.error("Erro ao atualizar exercício:", error);
      setAlert({ type: "error", message: "Erro ao atualizar exercício: " + error });
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setEditForm(prev => ({
      ...prev,
      audioFile: file
    }));
  };

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
      {alert && (
        <AlertMessage 
          type={alert.type} 
          message={alert.message} 
          className="mb-4" 
          onClose={() => setAlert(null)} 
        />
      )}

      <div className="flex items-center justify-between mb-6">
        <BackButton/>
        <div className="flex gap-4">
          <Button 
            variant="outline" 
            icon={Pencil} 
            onClick={handleEditClick}
          >
            Editar Exercício
          </Button>
          <Button 
            variant="danger" 
            icon={Trash2} 
            onClick={() => setIsDeleteModalOpen(true)}
          >
            Excluir Exercício
          </Button>
        </div>
      </div>

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

      {/* Modal de Edição */}
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <h2 className="text-2xl font-bold mb-4">Editar Exercício</h2>
            <div className="space-y-4">
              <div>
                <label className="block font-medium mb-1">Título</label>
                <input
                  type="text"
                  name="title"
                  value={editForm.title}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded"
                />
              </div>
              <div>
                <label className="block font-medium mb-1">Descrição</label>
                <textarea
                  name="description"
                  value={editForm.description}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded"
                  rows="3"
                />
              </div>
              <div>
                <label className="block font-medium mb-1">Instruções</label>
                <textarea
                  name="instructions"
                  value={editForm.instructions}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded"
                  rows="3"
                />
              </div>
              <div>
                <label className="block font-medium mb-1">Áudio de Referência</label>
                <input
                  type="file"
                  accept="audio/*"
                  onChange={handleFileChange}
                  className="w-full p-2 border rounded"
                />
              </div>
              <div className="flex justify-end gap-4">
                <Button variant="outline" onClick={handleCancelEdit}>Cancelar</Button>
                <Button onClick={handleSaveEdit}>Salvar</Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Confirmação de Exclusão */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <h2 className="text-2xl font-bold mb-4">Confirmar Exclusão</h2>
            <p className="mb-4">
              Tem certeza que deseja excluir o exercício "{exercise.title}"? 
              Esta ação não pode ser desfeita.
            </p>
            <div className="flex justify-end gap-4">
              <Button 
                variant="outline" 
                onClick={() => setIsDeleteModalOpen(false)}
              >
                Cancelar
              </Button>
              <Button 
                variant="danger" 
                onClick={handleDeleteExercise}
              >
                Confirmar Exclusão
              </Button>
            </div>
          </div>
        </div>
      )}
    </MainLayout>
  );
}

export default ExerciseDetailsPage;
