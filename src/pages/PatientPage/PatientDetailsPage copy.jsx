import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import MainLayout from "../../layouts/MainLayout";
import Button from "../../components/ButtonComponent/ButtonComponent";
import { ArrowBigLeftDash, Trash2 } from "lucide-react";
import { getPatientById, updatePatientById } from "../../api/patients/patient";
import { getPatientExercisesByPatientId, createPatientExercise, deletePatientExercise } from "../../api/patients/patientExercises";
import { getPatientDocuments, createPatientDocument, updatePatientDocument } from "../../api/patients/patientDocuments";
import { updateUserById } from "../../api/users/user";
import { getAllCategories } from "../../api/categories/categories";
import { getExercisesByCategory } from "../../api/exercises/exercise";
import AlertMessage from "../../components/AlertComponent/AlertMessage";
import { useCustomNavigate } from "../../hooks/useCustomNavigate";
import { Plus } from "lucide-react";
import { 
  User, 
  Mail, 
  Calendar, 
  Stethoscope, 
  Activity, 
  ArrowLeft, 
  Edit2, 
  Clock, 
  FileText, 
  Heart, 
  Brain, 
  MessageSquare,
  ChevronRight,
  Star,
  Award,
  Target,
  CheckCircle2,
  XCircle
} from "lucide-react";

function PatientDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { goTo, goBack } = useCustomNavigate();
  const [patient, setPatient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState(null);

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
      } catch (error) {
        console.error("Erro ao buscar paciente:", error);
        setAlert({ type: "error", message: "Erro ao carregar dados do paciente" });
      } finally {
        setLoading(false);
      }
    }

    fetchPatient();
  }, [id]);

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'ativo':
        return 'bg-green-100 text-green-800';
      case 'inativo':
        return 'bg-red-100 text-red-800';
      case 'em tratamento':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Carregando dados do paciente...</p>
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

  return (
    <MainLayout>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex items-center gap-4 mb-8">
            <button
              onClick={goBack}
              className="p-2 bg-white rounded-full shadow-sm hover:shadow-md transition-shadow"
            >
              <ArrowLeft size={20} className="text-gray-600" />
            </button>
            <div className="flex items-center gap-3">
              <div className="p-3 bg-blue-100 rounded-full">
                <User className="text-blue-600" size={24} />
              </div>
              <h1 className="text-3xl font-bold text-gray-800">{patient.userId?.name_user}</h1>
            </div>
          </div>

          {alert && (
            <AlertMessage
              type={alert.type}
              message={alert.message}
              className="mb-6"
              onClose={() => setAlert(null)}
            />
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Perfil do Paciente */}
            <div className="lg:col-span-1 space-y-6">
              <div className="bg-white rounded-2xl shadow-xl p-6">
                <div className="flex items-center gap-4 mb-6">
                  <div className="p-4 bg-blue-100 rounded-full">
                    <User className="text-blue-600" size={32} />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-gray-800">{patient.userId?.name_user}</h2>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(patient.status)}`}>
                      {patient.status}
                    </span>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-3 text-gray-600">
                    <Mail size={18} className="text-gray-400" />
                    <span>{patient.userId?.email}</span>
                  </div>
                  <div className="flex items-center gap-3 text-gray-600">
                    <Calendar size={18} className="text-gray-400" />
                    <span>Nascimento: {new Date(patient.birthDate).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center gap-3 text-gray-600">
                    <Stethoscope size={18} className="text-gray-400" />
                    <span>Diagnóstico: {patient.diagnosis || 'Não informado'}</span>
                  </div>
                </div>

                <div className="flex gap-3 mt-6 pt-6 border-t border-gray-100">
                  <Button
                    onClick={() => goTo("EDIT_PATIENT", { id: patient._id })}
                    className="flex-1 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-all duration-300"
                  >
                    <Edit2 size={18} />
                    Editar
                  </Button>
                  <Button
                    onClick={() => goTo("DELETE_PATIENT", { id: patient._id })}
                    className="flex-1 flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-all duration-300"
                  >
                    <Trash2 size={18} />
                    Excluir
                  </Button>
                </div>
              </div>

              {/* Estatísticas Rápidas */}
              <div className="bg-white rounded-2xl shadow-xl p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Estatísticas</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-blue-50 rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Clock size={16} className="text-blue-600" />
                      <span className="text-sm font-medium text-gray-600">Sessões</span>
                    </div>
                    <p className="text-2xl font-bold text-gray-800">12</p>
                  </div>
                  <div className="bg-green-50 rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <CheckCircle2 size={16} className="text-green-600" />
                      <span className="text-sm font-medium text-gray-600">Concluídas</span>
                    </div>
                    <p className="text-2xl font-bold text-gray-800">8</p>
                  </div>
                  <div className="bg-yellow-50 rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Star size={16} className="text-yellow-600" />
                      <span className="text-sm font-medium text-gray-600">Progresso</span>
                    </div>
                    <p className="text-2xl font-bold text-gray-800">75%</p>
                  </div>
                  <div className="bg-purple-50 rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Target size={16} className="text-purple-600" />
                      <span className="text-sm font-medium text-gray-600">Objetivos</span>
                    </div>
                    <p className="text-2xl font-bold text-gray-800">3/5</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Conteúdo Principal */}
            <div className="lg:col-span-2 space-y-6">
              {/* Próximas Sessões */}
              <div className="bg-white rounded-2xl shadow-xl p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-800">Próximas Sessões</h3>
                  <Button
                    onClick={() => goTo("NEW_SESSION", { patientId: patient._id })}
                    className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-4 py-2 rounded-lg transition-all duration-300"
                  >
                    <Plus size={18} />
                    Nova Sessão
                  </Button>
                </div>
                <div className="space-y-4">
                  {[1, 2, 3].map((session) => (
                    <div key={session} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer">
                      <div className="flex items-center gap-4">
                        <div className="p-3 bg-blue-100 rounded-full">
                          <Clock className="text-blue-600" size={20} />
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-800">Sessão {session}</h4>
                          <p className="text-sm text-gray-600">15/03/2024 - 14:00</p>
                        </div>
                      </div>
                      <ChevronRight size={20} className="text-gray-400" />
                    </div>
                  ))}
                </div>
              </div>

              {/* Objetivos de Tratamento */}
              <div className="bg-white rounded-2xl shadow-xl p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-6">Objetivos de Tratamento</h3>
                <div className="space-y-4">
                  {[
                    { title: "Melhorar articulação de fonemas", status: "completed" },
                    { title: "Reduzir gagueira em situações sociais", status: "in_progress" },
                    { title: "Aumentar vocabulário", status: "pending" },
                    { title: "Melhorar ritmo de fala", status: "completed" },
                    { title: "Reduzir ansiedade ao falar", status: "in_progress" }
                  ].map((goal, index) => (
                    <div key={index} className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                      <div className={`p-2 rounded-full ${
                        goal.status === "completed" ? "bg-green-100" :
                        goal.status === "in_progress" ? "bg-yellow-100" : "bg-gray-100"
                      }`}>
                        {goal.status === "completed" ? <CheckCircle2 className="text-green-600" size={20} /> :
                         goal.status === "in_progress" ? <Clock className="text-yellow-600" size={20} /> :
                         <Target className="text-gray-400" size={20} />}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-800">{goal.title}</h4>
                        <p className="text-sm text-gray-500">
                          {goal.status === "completed" ? "Concluído" :
                           goal.status === "in_progress" ? "Em andamento" : "Pendente"}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Histórico de Progresso */}
              <div className="bg-white rounded-2xl shadow-xl p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-6">Histórico de Progresso</h3>
                <div className="space-y-4">
                  {[
                    { date: "10/03/2024", title: "Avaliação de Progresso", description: "Melhora significativa na articulação" },
                    { date: "05/03/2024", title: "Nova Técnica Introduzida", description: "Exercícios de respiração" },
                    { date: "01/03/2024", title: "Ajuste no Plano", description: "Foco em situações sociais" }
                  ].map((entry, index) => (
                    <div key={index} className="flex gap-4 p-4 bg-gray-50 rounded-xl">
                      <div className="p-2 bg-blue-100 rounded-full">
                        <FileText className="text-blue-600" size={20} />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium text-gray-600">{entry.date}</span>
                          <span className="text-sm font-medium text-blue-600">{entry.title}</span>
                        </div>
                        <p className="text-gray-600">{entry.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}

export default PatientDetailsPage;
