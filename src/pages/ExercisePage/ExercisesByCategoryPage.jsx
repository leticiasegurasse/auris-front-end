import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import MainLayout from "../../layouts/MainLayout";
import { getCategoryById, updateCategoryById, deleteCategoryById } from "../../api/categories/categories";
import { getExercisesByCategory } from "../../api/exercises/exercise";
import { useCustomNavigate } from "../../hooks/useCustomNavigate";
import Button from "../../components/ButtonComponent/ButtonComponent";
import AlertMessage from "../../components/AlertComponent/AlertMessage";
import { Pencil, Trash2, Edit2, ArrowLeft, Plus, Play, BookOpen, ChevronRight, ChevronLeft } from "lucide-react";
import PageHeader from "../../components/PageHeader/PageHeader";

function ExercisesByCategoryPage() {
  const { categoryId } = useParams();
  const { goTo } = useCustomNavigate();

  const [category, setCategory] = useState(null);
  const [exercises, setExercises] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [alert, setAlert] = useState(null);
  const [editForm, setEditForm] = useState({
    title: "",
    description: ""
  });
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [limit] = useState(5);

  useEffect(() => {
    async function fetchData() {
      try {
        const [categoryData, exercisesData] = await Promise.all([
          getCategoryById(categoryId),
          getExercisesByCategory(categoryId, page, limit),
        ]);

        setCategory(categoryData);
        setEditForm({
          title: categoryData.title,
          description: categoryData.description
        });
        
        if (Array.isArray(exercisesData)) {
          setExercises(exercisesData);
          // Como não temos paginação do backend, vamos calcular o total de páginas
          // baseado no número total de exercícios
          setTotalPages(Math.ceil(exercisesData.length / limit));
        } else {
          setExercises([]);
          setTotalPages(1);
        }
      } catch (error) {
        console.error("Erro ao buscar dados:", error);
        setAlert({ type: "error", message: "Erro ao carregar dados" });
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [categoryId, page, limit]);

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  const handleEditClick = () => {
    setEditForm({
      title: category.title,
      description: category.description
    });
    setIsEditModalOpen(true);
  };

  const handleCancelEdit = () => {
    setIsEditModalOpen(false);
  };

  const handleSaveEdit = async () => {
    try {
      const updatedCategory = await updateCategoryById(categoryId, editForm);
      setCategory(updatedCategory);
      setIsEditModalOpen(false);
      setAlert({ type: "success", message: "Categoria atualizada com sucesso!" });
    } catch (error) {
      console.error("Erro ao atualizar categoria:", error);
      setAlert({ type: "error", message: "Erro ao atualizar categoria: " + error });
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddExercise = () => {
    goTo("NEW_EXERCISE", { categoryId });
  };

  const handleViewExerciseDetails = (exerciseId) => {
    goTo("EXERCISE_DETAILS", { exerciseId });
  };

  const handleDeleteCategory = async () => {
    try {
      await deleteCategoryById(categoryId);
      setAlert({ type: "success", message: "Categoria excluída com sucesso!" });
      setIsEditModalOpen(false);
      setTimeout(() => {
        goTo("CATEGORIES");
      }, 1000);
    } catch (error) {
      console.error("Erro ao excluir categoria:", error);
      setAlert({ 
        type: "error", 
        message: error.response?.data?.message || "Erro ao excluir categoria" 
      });
    } finally {
      setIsDeleteModalOpen(false);
    }
  };

  const handleBack = () => {
    goTo("CATEGORIES");
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

  if (!category) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center">
          <div className="text-center">
            <div className="p-4 bg-red-100 rounded-full w-16 h-16 mx-auto mb-4">
              <BookOpen className="text-red-600 mx-auto" size={32} />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Categoria não encontrada</h3>
            <p className="text-gray-600 mb-4">A categoria que você está procurando não existe ou foi removida.</p>
            <Button 
              onClick={handleBack}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-6 py-3 rounded-lg transition-all duration-300 shadow-md hover:shadow-lg"
            >
              Voltar para Categorias
            </Button>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div>
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-4 mb-8">
            <div className="flex-1">
              <PageHeader 
                title={category.title}
                description={category.description}
              />
              <div className="flex items-center gap-4 mt-4">
                <div className="flex gap-3">
                  <button
                    onClick={handleEditClick}
                    className="flex items-center gap-2 px-4 py-2 text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-all duration-200"
                  >
                    <Edit2 size={18} />
                    <span className="text-sm font-medium">Editar Categoria</span>
                  </button>
                  <button
                    onClick={() => setIsDeleteModalOpen(true)}
                    className="flex items-center gap-2 px-4 py-2 text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-all duration-200"
                  >
                    <Trash2 size={18} />
                    <span className="text-sm font-medium">Excluir Categoria</span>
                  </button>
                </div>
              </div>
            </div>
            <Button 
              onClick={handleAddExercise}
              className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-6 py-3 rounded-lg transition-all duration-300 shadow-md hover:shadow-lg"
            >
              <Plus size={20} />
              Novo Exercício
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

          <div className="bg-white rounded-xl shadow-lg border border-gray-100">
            {exercises.slice((page - 1) * limit, page * limit).map((exercise) => (
              <div
                key={exercise._id}
                className="p-6 border-b border-gray-100 last:border-b-0 hover:bg-gray-50 transition-all duration-200 cursor-pointer"
                onClick={() => handleViewExerciseDetails(exercise._id)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="p-2 bg-blue-100 rounded-full">
                      <Play className="text-blue-600" size={20} />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800">{exercise.title}</h3>
                      <p className="text-gray-600 mt-1">{exercise.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-blue-600">
                    <span className="text-sm">Ver detalhes</span>
                    <ChevronRight size={16} />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {exercises.length === 0 && (
            <div className="text-center py-12">
              <div className="bg-white rounded-xl p-8 max-w-md mx-auto shadow-lg flex flex-col items-center justify-center">
                <div className="p-4 bg-blue-100 rounded-full w-16 h-16 mx-auto mb-4">
                  <Play className="text-blue-600 mx-auto" size={32} />
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">Nenhum exercício encontrado</h3>
                <p className="text-gray-600 mb-4">Comece criando seu primeiro exercício nesta categoria</p>
                <Button 
                  onClick={handleAddExercise}
                >
                  Criar Primeiro Exercício
                </Button>
              </div>
            </div>
          )}

          {/* Paginação */}
          {exercises.length > 0 && (
            <div className="flex justify-center items-center gap-2 mt-6">
              <button
                onClick={() => handlePageChange(page - 1)}
                disabled={page === 1}
                className={`p-2 rounded-lg ${
                  page === 1
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-white text-gray-600 hover:bg-gray-50'
                }`}
              >
                <ChevronLeft size={20} />
              </button>

              <div className="flex items-center gap-2">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                  <button
                    key={pageNum}
                    onClick={() => handlePageChange(pageNum)}
                    className={`w-8 h-8 rounded-lg ${
                      page === pageNum
                        ? 'bg-indigo-600 text-white'
                        : 'bg-white text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    {pageNum}
                  </button>
                ))}
              </div>

              <button
                onClick={() => handlePageChange(page + 1)}
                disabled={page === totalPages}
                className={`p-2 rounded-lg ${
                  page === totalPages
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-white text-gray-600 hover:bg-gray-50'
                }`}
              >
                <ChevronRight size={20} />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Modal de Edição */}
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-8 shadow-2xl w-full max-w-md transform transition-all duration-300">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">Editar Categoria</h2>
              <button
                onClick={() => setIsDeleteModalOpen(true)}
                className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
              >
                <Trash2 size={20} />
              </button>
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
              Tem certeza que deseja excluir a categoria "{category?.title}"? 
              Esta ação não pode ser desfeita.
            </p>
            <div className="flex justify-center gap-4">
              <Button 
                onClick={() => setIsDeleteModalOpen(false)}
                className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-6 py-3 rounded-lg transition-all duration-300"
              >
                Cancelar
              </Button>
              <Button 
                onClick={handleDeleteCategory}
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

export default ExercisesByCategoryPage;