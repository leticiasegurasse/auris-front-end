import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import MainLayout from "../../layouts/MainLayout";
import Button from "../../components/ButtonComponent/ButtonComponent";
import { ArrowBigLeftDash, Trash2 } from "lucide-react";
import { getPatientById } from "../../api/patients/patient";
import { getPatientExercisesByPatientId, createPatientExercise, deletePatientExercise } from "../../api/patients/patientExercises";
import { getPatientDocuments, createPatientDocument, updatePatientDocument } from "../../api/patients/patientDocuments";
import { updateUserById } from "../../api/users/user";
import { getAllCategories } from "../../api/categories/categories";
import { getExercisesByCategory } from "../../api/exercises/exercise";
import AlertMessage from "../../components/AlertComponent/AlertMessage";
import { User, Mail, Calendar, Stethoscope, Activity, Pencil, ArrowLeft, ChevronRight, Phone, MapPin, Clock, Heart, Brain, MessageSquare } from "lucide-react";
import { useCustomNavigate } from "../../hooks/useCustomNavigate";

function PatientDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { goBack } = useCustomNavigate();
  const [patient, setPatient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [alert, setAlert] = useState(null);
  const [editForm, setEditForm] = useState({
    name_user: "",
    email: "",
    birthDate: "",
    diagnosis: "",
  });

  useEffect(() => {
    async function fetchPatient() {
      if (!id) {
        setAlert({ type: "error", message: "ID do paciente não encontrado" });
        setLoading(false);
        return;
      }

      try {
        const response = await getPatientById(id);
        setPatient(response);
        setEditForm({
          name_user: response.userId?.name_user || "",
          email: response.userId?.email || "",
          birthDate: response.birthDate || "",
          diagnosis: response.diagnosis || "",
        });
      } catch (error) {
        console.error("Erro ao buscar paciente:", error);
        setAlert({ type: "error", message: "Erro ao carregar dados do paciente" });
      } finally {
        setLoading(false);
      }
    }

    fetchPatient();
  }, [id]);

  const handleDeletePatient = async () => {
    if (!id) return;

    try {
      await deletePatientById(id);
      setAlert({ type: "success", message: "Paciente excluído com sucesso!" });
      setIsDeleteModalOpen(false);
      navigate("/patients");
    } catch (error) {
      console.error("Erro ao excluir paciente:", error);
      setAlert({ type: "error", message: "Erro ao excluir paciente: " + error });
    }
  };

  const handleEditClick = () => {
    setIsEditModalOpen(true);
  };

  const handleCancelEdit = () => {
    setIsEditModalOpen(false);
    setEditForm({
      name_user: patient.userId?.name_user || "",
      email: patient.userId?.email || "",
      birthDate: patient.birthDate || "",
      diagnosis: patient.diagnosis || "",
    });
  };

  const handleSaveEdit = async () => {
    if (!id) return;

    try {
      const updatedPatient = await updatePatientById(id, editForm);
      setPatient(updatedPatient);
      setIsEditModalOpen(false);
      setAlert({ type: "success", message: "Paciente atualizado com sucesso!" });
    } catch (error) {
      console.error("Erro ao atualizar paciente:", error);
      setAlert({ type: "error", message: "Erro ao atualizar paciente: " + error });
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Carregando...</p>
          </div>
        </div>
      </MainLayout>
    );
  }

  if (!patient) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="p-4 bg-red-100 rounded-full w-16 h-16 mx-auto mb-4">
              <User className="text-red-600 mx-auto" size={32} />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Paciente não encontrado</h3>
            <p className="text-gray-600 mb-4">O paciente que você está procurando não existe ou foi removido.</p>
            <Button 
              onClick={() => navigate("/patients")}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-6 py-3 rounded-lg transition-all duration-300 shadow-md hover:shadow-lg"
            >
              Voltar
            </Button>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex items-center gap-4 mb-8">
            <button 
              onClick={() => navigate("/patients")}
              className="p-2 bg-white rounded-full shadow-sm hover:shadow-md transition-shadow"
            >
              <ArrowLeft size={20} className="text-gray-600" />
            </button>
            <div className="flex items-center gap-3">
              <div className="p-3 bg-blue-100 rounded-full">
                <User className="text-blue-600" size={24} />
              </div>
              <h1 className="text-3xl font-bold text-gray-800">Detalhes do Paciente</h1>
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

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Perfil do Paciente */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl shadow-xl p-6">
                <div className="text-center mb-6">
                  <div className="w-24 h-24 bg-blue-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <User className="text-blue-600" size={48} />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-800">{patient.userId?.name_user}</h2>
                  <p className="text-gray-600">{patient.userId?.email}</p>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <div className="p-2 bg-blue-100 rounded-full">
                      <Calendar className="text-blue-600" size={20} />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Data de Nascimento</p>
                      <p className="font-medium text-gray-800">{new Date(patient.birthDate).toLocaleDateString()}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <div className="p-2 bg-blue-100 rounded-full">
                      <Activity className="text-blue-600" size={20} />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Status</p>
                      <p className="font-medium text-gray-800 capitalize">{patient.status}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <div className="p-2 bg-blue-100 rounded-full">
                      <Stethoscope className="text-blue-600" size={20} />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Diagnóstico</p>
                      <p className="font-medium text-gray-800">{patient.diagnosis || "Não informado"}</p>
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-6 border-t border-gray-100">
                  <div className="flex gap-3">
                    <Button 
                      onClick={handleEditClick}
                      className="flex-1 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-all duration-300"
                    >
                      <Pencil size={18} />
                      Editar
                    </Button>
                    <Button 
                      onClick={() => setIsDeleteModalOpen(true)}
                      className="flex-1 flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-all duration-300"
                    >
                      <Trash2 size={18} />
                      Excluir
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* Informações Detalhadas */}
            <div className="lg:col-span-2">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Sessões */}
                <div className="bg-white rounded-2xl shadow-xl p-6">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-indigo-100 rounded-full">
                      <Clock className="text-indigo-600" size={20} />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-800">Sessões</h3>
                  </div>
                  <div className="space-y-4">
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-500">Próxima Sessão</p>
                      <p className="font-medium text-gray-800">Não agendada</p>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-500">Última Sessão</p>
                      <p className="font-medium text-gray-800">Não realizada</p>
                    </div>
                  </div>
                </div>

                {/* Progresso */}
                <div className="bg-white rounded-2xl shadow-xl p-6">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-green-100 rounded-full">
                      <Activity className="text-green-600" size={20} />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-800">Progresso</h3>
                  </div>
                  <div className="space-y-4">
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-500">Exercícios Concluídos</p>
                      <p className="font-medium text-gray-800">0</p>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-500">Taxa de Sucesso</p>
                      <p className="font-medium text-gray-800">0%</p>
                    </div>
                  </div>
                </div>

                {/* Anotações */}
                <div className="md:col-span-2 bg-white rounded-2xl shadow-xl p-6">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-yellow-100 rounded-full">
                      <MessageSquare className="text-yellow-600" size={20} />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-800">Anotações</h3>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="text-gray-600">Nenhuma anotação registrada.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal de Edição */}
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 shadow-2xl w-full max-w-md transform transition-all duration-300">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-blue-100 rounded-full">
                <Pencil className="text-blue-600" size={20} />
              </div>
              <h2 className="text-2xl font-bold text-gray-800">Editar Paciente</h2>
            </div>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Nome</label>
                <input
                  type="text"
                  name="name_user"
                  value={editForm.name_user}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <input
                  type="email"
                  name="email"
                  value={editForm.email}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Data de Nascimento</label>
                <input
                  type="date"
                  name="birthDate"
                  value={editForm.birthDate}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Diagnóstico</label>
                <input
                  type="text"
                  name="diagnosis"
                  value={editForm.diagnosis}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                />
              </div>
              <div className="flex justify-end gap-4">
                <Button 
                  onClick={handleCancelEdit}
                  className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-6 py-3 rounded-lg transition-all duration-300"
                >
                  Cancelar
                </Button>
                <Button 
                  onClick={handleSaveEdit}
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-6 py-3 rounded-lg transition-all duration-300 shadow-md hover:shadow-lg"
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
          <div className="bg-white rounded-2xl p-8 shadow-2xl w-full max-w-md transform transition-all duration-300">
            <div className="text-center">
              <div className="p-4 bg-red-100 rounded-full w-16 h-16 mx-auto mb-4">
                <Trash2 className="text-red-600 mx-auto" size={32} />
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Confirmar Exclusão</h2>
              <p className="text-gray-600 mb-6">
                Tem certeza que deseja excluir o paciente "{patient.userId?.name_user}"? 
                Esta ação não pode ser desfeita.
              </p>
              <div className="flex justify-end gap-4">
                <Button 
                  onClick={() => setIsDeleteModalOpen(false)}
                  className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-6 py-3 rounded-lg transition-all duration-300"
                >
                  Cancelar
                </Button>
                <Button 
                  onClick={handleDeletePatient}
                  className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white px-6 py-3 rounded-lg transition-all duration-300 shadow-md hover:shadow-lg"
                >
                  Confirmar Exclusão
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </MainLayout>
  );
}

export default PatientDetailsPage;
