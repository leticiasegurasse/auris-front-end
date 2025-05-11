import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import MainLayout from "../../layouts/MainLayout";
import { getExerciseById, deleteExerciseById, updateExerciseById } from "../../api/exercises/exercise";
import Button from "../../components/ButtonComponent/ButtonComponent";
import AlertMessage from "../../components/AlertComponent/AlertMessage";
import { Trash2, Pencil, ArrowLeft, Play, BookOpen, FileAudio, ChevronRight } from "lucide-react";
import { useCustomNavigate } from "../../hooks/useCustomNavigate";
import PageHeader from "../../components/PageHeader/PageHeader";

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
        <div className="flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Carregando...</p>
          </div>
        </div>
      </MainLayout>
    );
  }

  if (!exercise) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center">
          <div className="text-center">
            <div className="p-4 bg-red-100 rounded-full w-16 h-16 mx-auto mb-4">
              <BookOpen className="text-red-600 mx-auto" size={32} />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Exercício não encontrado</h3>
            <p className="text-gray-600 mb-4">O exercício que você está procurando não existe ou foi removido.</p>
            <Button 
              onClick={goBack}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-6 py-3 rounded-lg transition-all duration-300 shadow-md hover:shadow-lg"
            >
              Voltar
            </Button>
          </div>
        </div>
      </MainLayout>
    );
  }

  const audioUrl = `${import.meta.env.VITE_API_URL}/exercises/audio/${exercise.audioReference}`;

  return (
    <MainLayout>
      <div>
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center gap-4 mb-8">
            <PageHeader 
                title={exercise.title}
                description={exercise.description}
              />
            <div className="flex gap-2">
              <button 
                onClick={handleEditClick}
                className="flex items-center gap-2 px-4 py-2 text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-all duration-200"
              >
                <Pencil size={18} />
                Editar
              </button>
              <button 
                onClick={() => setIsDeleteModalOpen(true)}
                className="flex items-center gap-2 px-4 py-2 text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-all duration-200"
              >
                <Trash2 size={18} />
                Excluir
              </button>
            </div>
          </div>

          {alert && (
            <AlertMessage 
              type={alert.type} 
              message={alert.message} 
              className="mb-8" 
              onClose={() => setAlert(null)} 
            />
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-white rounded-xl p-8 shadow-lg border border-gray-100">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-blue-100 rounded-full">
                  <BookOpen className="text-blue-600" size={24} />
                </div>
                <h2 className="text-xl font-semibold text-gray-800">Detalhes do Exercício</h2>
              </div>

              <div className="space-y-6">
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-2">Descrição</h3>
                  <p className="text-gray-700">{exercise.description || "Sem descrição"}</p>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-2">Instruções</h3>
                  <p className="text-gray-700">{exercise.instructions || "Sem instruções específicas"}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-8 shadow-lg border border-gray-100">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-blue-100 rounded-full">
                  <FileAudio className="text-blue-600" size={24} />
                </div>
                <h2 className="text-xl font-semibold text-gray-800">Áudio de Referência</h2>
              </div>

              {exercise.audioReference ? (
                <div className="space-y-4">
                  <audio controls className="w-full">
                    <source src={audioUrl} type="audio/mpeg" />
                    Seu navegador não suporta o elemento de áudio.
                  </audio>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Play size={16} />
                    <span>Clique para reproduzir o áudio de referência</span>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="p-4 bg-gray-100 rounded-full w-16 h-16 mx-auto mb-4">
                    <FileAudio className="text-gray-400 mx-auto" size={32} />
                  </div>
                  <p className="text-gray-500">Nenhum áudio cadastrado para este exercício.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Modal de Edição */}
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-8 shadow-2xl w-full max-w-md transform transition-all duration-300">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">Editar Exercício</h2>
            </div>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Título</label>
                <input
                  type="text"
                  name="title"
                  value={editForm.title}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Descrição</label>
                <textarea
                  name="description"
                  value={editForm.description}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 resize-none"
                  rows="3"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Instruções</label>
                <textarea
                  name="instructions"
                  value={editForm.instructions}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 resize-none"
                  rows="3"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Áudio de Referência</label>
                <div className="flex items-center gap-4">
                  <input
                    type="file"
                    accept="audio/*"
                    onChange={handleFileChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-4">
                <Button 
                  onClick={handleCancelEdit}
                  variant="outline"
                >
                  Cancelar
                </Button>
                <Button 
                  onClick={handleSaveEdit}
                >
                  Salvar
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Confirmação de Exclusão */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-8 shadow-2xl w-full max-w-md transform transition-all duration-300">
            <div className="p-4 bg-red-100 rounded-full w-16 h-16 mx-auto mb-4">
              <Trash2 className="text-red-600 mx-auto" size={32} />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 text-center mb-4">Confirmar Exclusão</h2>
            <p className="text-gray-600 text-center mb-6">
              Tem certeza que deseja excluir o exercício "{exercise.title}"? 
              Esta ação não pode ser desfeita.
            </p>
            <div className="flex justify-center gap-4">
              <Button 
                onClick={() => setIsDeleteModalOpen(false)}
                variant="outline"
              >
                Cancelar
              </Button>
              <Button 
                onClick={handleDeleteExercise}
                className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white px-6 py-3 rounded-lg transition-all duration-300 shadow-md hover:shadow-lg"
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
