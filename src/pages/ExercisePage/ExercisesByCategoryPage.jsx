import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import MainLayout from "../../layouts/MainLayout";
import { getCategoryById, updateCategoryById, deleteCategoryById } from "../../api/categories/categories";
import { getExercisesByCategory } from "../../api/exercises/exercise";
import { useCustomNavigate } from "../../hooks/useCustomNavigate";
import Button from "../../components/ButtonComponent/ButtonComponent";
import AlertMessage from "../../components/AlertComponent/AlertMessage";
import { Pencil, Trash2, Edit2 } from "lucide-react";

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

  useEffect(() => {
    async function fetchData() {
      try {
        const [categoryData, exercisesData] = await Promise.all([
          getCategoryById(categoryId),
          getExercisesByCategory(categoryId),
        ]);

        setCategory(categoryData);
        setEditForm({
          title: categoryData.title,
          description: categoryData.description
        });
        setExercises(exercisesData);
      } catch (error) {
        console.error("Erro ao buscar dados:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [categoryId]);

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
      setIsDeleteModalOpen(false);
      setIsEditModalOpen(false);
      // Redireciona para a página de categorias após 1 segundo
      setTimeout(() => {
        goTo("CATEGORIES");
      }, 1000);
    } catch (error) {
      console.error("Erro ao excluir categoria:", error);
      setAlert({ type: "error", message: "Erro ao excluir categoria: " + error });
    }
  };

  const handleEdit = (exerciseId) => {
    goTo("EXERCISE_DETAILS", { exerciseId });
  };

  const handleCreate = () => {
    goTo("NEW_EXERCISE", { categoryId });
  };

  const handleBack = () => {
    goTo("CATEGORIES");
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
      {alert && (
        <AlertMessage 
          type={alert.type} 
          message={alert.message} 
          className="mb-4" 
          onClose={() => setAlert(null)} 
        />
      )}

      <div className="flex items-center justify-between mb-8">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-3xl font-bold">{category.title}</h1>
            <Button 
              variant="outline" 
              icon={Pencil} 
              onClick={handleEditClick}
              className="p-2"
            />
          </div>
          <p className="text-gray-600 mt-2">{category.description}</p>
        </div>
        <Button onClick={handleAddExercise}>Adicionar Novo Exercício</Button>
      </div>

      {/* Modal de Edição */}
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold">Editar Categoria</h2>
              <Button 
                variant="danger" 
                icon={Trash2} 
                onClick={() => setIsDeleteModalOpen(true)}
                className="p-2"
              />
            </div>
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
              Tem certeza que deseja excluir a categoria "{category?.title}"? 
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
                onClick={handleDeleteCategory}
              >
                Confirmar Exclusão
              </Button>
            </div>
          </div>
        </div>
      )}

      <div>
        <h2 className="text-2xl font-semibold mb-4">Exercícios da Categoria</h2>
        {exercises.length === 0 ? (
          <p className="text-gray-500">Nenhum exercício cadastrado nesta categoria ainda.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {exercises.map((exercise) => (
              <div
                key={exercise._id}
                className="bg-white shadow-md rounded-lg p-4 hover:shadow-lg transition cursor-pointer"
                onClick={() => handleViewExerciseDetails(exercise._id)}
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
