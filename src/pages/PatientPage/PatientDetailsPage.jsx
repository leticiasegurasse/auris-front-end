import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import MainLayout from "../../layouts/MainLayout";
import Button from "../../components/ButtonComponent/ButtonComponent";
import { ArrowBigLeftDash, Trash2 } from "lucide-react";
import { getPatientById, updatePatientById } from "../../api/patients/patient";
import { getPatientExercisesByPatientId, createPatientExercise, deletePatientExercise } from "../../api/patients/patientExercises";
import { getPatientDocuments, createPatientDocument, updatePatientDocument } from "../../api/patients/patientDocuments";
import { getPatientResponsesByPatientExerciseId } from "../../api/patients/patientResponses";
import { createTherapistEvaluation, getTherapistEvaluationByPatientResponseId } from "../../api/therapist/therapistEvaluation";
import { updateUserById } from "../../api/users/user";
import { getAllCategories } from "../../api/categories/categories";
import { getExercisesByCategory } from "../../api/exercises/exercise";
import AlertMessage from "../../components/AlertComponent/AlertMessage";
import ChatComponent from "../../components/ChatComponent/ChatComponent";
import PageHeader from "../../components/PageHeader/PageHeader";

function PatientDetailsPage() {
  const { id } = useParams();

  const [alert, setAlert] = useState(null);
  const [patient, setPatient] = useState(null);
  const [exercises, setExercises] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("details"); // 👈 controla o menu (details, exercises ou documents)
  const [exerciseTab, setExerciseTab] = useState("pending"); // 👈 controla a aba dos exercícios

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isResponseModalOpen, setIsResponseModalOpen] = useState(false);
  const [isCompletedModalOpen, setIsCompletedModalOpen] = useState(false);
  const [exerciseToDelete, setExerciseToDelete] = useState(null);
  const [selectedExercise, setSelectedExercise] = useState(null);
  const [exerciseResponse, setExerciseResponse] = useState(null);
  const [categories, setCategories] = useState([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState('');
  const [availableExercises, setAvailableExercises] = useState([]);
  const [selectedExerciseId, setSelectedExerciseId] = useState('');
  const [newStartDate, setNewStartDate] = useState('');
  const [newEndDate, setNewEndDate] = useState('');
  const [isDocumentModalOpen, setIsDocumentModalOpen] = useState(false);
  const [documents, setDocuments] = useState([]);
  const [documentTab, setDocumentTab] = useState("anamnese"); // 👈 controla a aba dos documentos
  const [newDocument, setNewDocument] = useState({
    report: '',
    observation: '',
    type: 'anamnese' // tipo padrão do documento
  });

  const [formData, setFormData] = useState({
    name_user: "",
    email: "",
    birthDate: "",
    diagnosis: "",
    status: "",
    city: "",
    notes: "",
  });

  const [therapistEvaluation, setTherapistEvaluation] = useState({
    therapistComment: '',
    therapistFeedback: '',
    score: 0
  });

  const [completedExerciseData, setCompletedExerciseData] = useState({
    exercise: null,
    response: null,
    evaluation: null
  });

  useEffect(() => {
    async function fetchData() {
      try {
        const patientData = await getPatientById(id);
        setPatient(patientData);
        setFormData({
          name_user: patientData.userId.name_user || "",
          email: patientData.userId.email || "",
          birthDate: patientData.birthDate ? patientData.birthDate.slice(0, 10) : "",
          diagnosis: patientData.diagnosis || "",
          status: patientData.status || "ativo",
          city: patientData.city || "",
          notes: patientData.notes || "",
        });

        const exercisesData = await getPatientExercisesByPatientId(id);
        setExercises(exercisesData);
        
        const documentsData = await getPatientDocuments(id);
        setDocuments(documentsData);
      } catch (error) {
        console.error("Erro ao buscar dados:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    try {
      if (!patient || !patient.userId || !patient.userId._id) {
        throw new Error('ID do usuário não encontrado.');
      }

      const userId = patient.userId._id;

      await updateUserById(userId, {
        name_user: formData.name_user,
        email: formData.email,
      });

      const updatedPatientData = {
        diagnosis: formData.diagnosis,
        birthDate: formData.birthDate,
        status: formData.status,
        city: formData.city,
        notes: formData.notes,
      };

      await updatePatientById(id, updatedPatientData);

      setAlert({ type: "success", message: "Dados alterados com sucesso!" });
    } catch (error) {
      setAlert({ type: "error", message: `Erro ao atualizar paciente: ${error}` });
    }
  };

  async function handleOpenModal() {
    try {
      const response = await getAllCategories();
      setCategories(response);
      setIsModalOpen(true);
    } catch (error) {
      console.error("Erro ao buscar categorias:", error);
    }
  }
  

  async function handleCategoryChange(categoryId) {
    try {
      setSelectedCategoryId(categoryId);
      if (!categoryId) {
        setAvailableExercises([]);
        return;
      }
      const response = await getExercisesByCategory(categoryId);
      if (response && response.exercises && Array.isArray(response.exercises)) {
        setAvailableExercises(response.exercises);
      } else {
        console.error("Dados de exercícios inválidos:", response);
        setAvailableExercises([]);
      }
    } catch (error) {
      console.error("Erro ao buscar exercícios da categoria:", error);
      setAvailableExercises([]);
    }
  }
  
  async function handleSaveNewExercise() {
    try {
      if (!selectedExerciseId || !newStartDate || !newEndDate) {
        setAlert({ type: "warning", message: "Preencha todos os campos!" });
        return;
      }
  
      await createPatientExercise({
        patientId: id,
        exerciseId: selectedExerciseId,
        startDate: newStartDate,
        endDate: newEndDate,
        status: "pending"
      });
  
      setIsModalOpen(false);
      setSelectedCategoryId('');
      setSelectedExerciseId('');
      setNewStartDate('');
      setNewEndDate('');
  
      // Atualizar a lista de exercícios do paciente
      const updatedExercises = await getPatientExercisesByPatientId(id);
      setExercises(updatedExercises);
  
      setAlert({ type: "success", message: "Exercício atribuído com sucesso!" });
    } catch (error) {
      console.error("Erro ao atribuir exercício:", error);
      setAlert({ type: "error", message: "Erro ao atribuir exercício." });
    }
  }
 
  
  const handleDeleteExercise = async (exerciseId) => {
    try {
      await deletePatientExercise(exerciseId);
      const updatedExercises = await getPatientExercisesByPatientId(id);
      setExercises(updatedExercises);
      setAlert({ type: "success", message: "Exercício removido com sucesso!" });
      setIsDeleteModalOpen(false);
      setExerciseToDelete(null);
    } catch (error) {
      console.error("Erro ao remover exercício:", error);
      setAlert({ type: "error", message: "Erro ao remover exercício: " + error });
    }
  };

  const handleDeleteClick = (exercise) => {
    setExerciseToDelete(exercise);
    setIsDeleteModalOpen(true);
  };

  const handleViewResponse = async (exercise) => {
    console.log('exercicio', exercise);
    try {
      setSelectedExercise(exercise);
      const response = await getPatientResponsesByPatientExerciseId(exercise._id);
      console.log('resposta', response);
      setExerciseResponse(response[0]); // Pegando a primeira resposta
      setIsResponseModalOpen(true);
    } catch (error) {
      console.error("Erro ao buscar resposta do exercício:", error);
      setAlert({ type: "error", message: "Erro ao buscar resposta do exercício." });
    }
  };

  const handleViewCompletedExercise = async (exercise) => {
    try {
      const response = await getPatientResponsesByPatientExerciseId(exercise._id);
      const patientResponse = response[0];
      
      if (patientResponse) {
        const evaluation = await getTherapistEvaluationByPatientResponseId(patientResponse._id);
        setCompletedExerciseData({
          exercise,
          response: patientResponse,
          evaluation: evaluation
        });
        setIsCompletedModalOpen(true);
        console.log('completedExerciseData', completedExerciseData);
      }
    } catch (error) {
      console.error("Erro ao buscar dados do exercício:", error);
      setAlert({ type: "error", message: "Erro ao buscar dados do exercício." });
    }
  };

  const handleEvaluationChange = (e) => {
    const { name, value } = e.target;
    setTherapistEvaluation(prev => ({
      ...prev,
      [name]: name === 'score' ? parseInt(value) : value
    }));
  };

  const handleSaveEvaluation = async () => {
    try {
      if (!exerciseResponse) {
        setAlert({ type: "warning", message: "Nenhuma resposta encontrada para avaliar." });
        return;
      }

      const evaluationData = {
        patientResponseId: exerciseResponse._id,
        therapistComment: therapistEvaluation.therapistComment,
        therapistFeedback: therapistEvaluation.therapistFeedback,
        score: therapistEvaluation.score,
        createdAt: new Date().toISOString()
      };

      await createTherapistEvaluation(evaluationData);
      
      // Atualizar a lista de exercícios
      const updatedExercises = await getPatientExercisesByPatientId(id);
      setExercises(updatedExercises);

      setAlert({ type: "success", message: "Avaliação salva com sucesso!" });
      setIsResponseModalOpen(false);
      setTherapistEvaluation({
        therapistComment: '',
        therapistFeedback: '',
        score: 0
      });
    } catch (error) {
      console.error("Erro ao salvar avaliação:", error);
      setAlert({ type: "error", message: "Erro ao salvar avaliação." });
    }
  };

  const handleSaveNewDocument = async () => {
    try {
      if (!newDocument.report || !newDocument.observation) {
        setAlert({ type: "warning", message: "Preencha todos os campos!" });
        return;
      }

      console.log('Dados a serem enviados:', {
        patientId: id,
        type: newDocument.type,
        report: newDocument.report,
        observation: newDocument.observation
      });

      await createPatientDocument({
        patientId: id,
        type: newDocument.type,
        report: newDocument.report,
        observation: newDocument.observation
      });

      // Atualizar lista de documentos
      const updatedDocuments = await getPatientDocuments(id);
      setDocuments(updatedDocuments);

      setIsDocumentModalOpen(false);
      setNewDocument({
        report: '',
        observation: '',
        type: 'anamnese'
      });

      setAlert({ type: "success", message: "Documento adicionado com sucesso!" });
    } catch (error) {
      console.error("Erro ao adicionar documento:", error);
      setAlert({ type: "error", message: `Erro ao adicionar documento: ${error.response?.data?.message || error.message}` });
    }
  };

  return (
    <MainLayout>
      {alert && (
        <AlertMessage type={alert.type} message={alert.message} className="mb-4" onClose={() => setAlert(null)} />
      )}

      <PageHeader 
        title="Detalhes do Paciente"
        description={patient?.userId?.name_user}
      />

      {/* Menu de navegação */}
      <div className="mb-8">
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="flex">
            <button
              onClick={() => setActiveTab("details")}
              className={`flex-1 py-4 px-6 text-center transition-all duration-200 relative ${
                activeTab === "details"
                  ? "text-blue-600 font-medium"
                  : "text-gray-600 hover:text-blue-500"
              }`}
            >
              <div className="flex items-center justify-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                </svg>
                <span>Dados do Paciente</span>
              </div>
              {activeTab === "details" && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600"></div>
              )}
            </button>

            <button
              onClick={() => setActiveTab("exercises")}
              className={`flex-1 py-4 px-6 text-center transition-all duration-200 relative ${
                activeTab === "exercises"
                  ? "text-blue-600 font-medium"
                  : "text-gray-600 hover:text-blue-500"
              }`}
            >
              <div className="flex items-center justify-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                </svg>
                <span>Exercícios</span>
              </div>
              {activeTab === "exercises" && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600"></div>
              )}
            </button>

            <button
              onClick={() => setActiveTab("documents")}
              className={`flex-1 py-4 px-6 text-center transition-all duration-200 relative ${
                activeTab === "documents"
                  ? "text-blue-600 font-medium"
                  : "text-gray-600 hover:text-blue-500"
              }`}
            >
              <div className="flex items-center justify-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                </svg>
                <span>Documentos</span>
              </div>
              {activeTab === "documents" && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600"></div>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Conteúdo Condicional */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      ) : activeTab === "details" ? (
        <div className="space-y-6 bg-white shadow-md p-8 rounded-xl">
          <h2 className="text-2xl font-bold text-gray-700 mb-6">Editar Paciente</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <InputField 
              label="Nome" 
              name="name_user" 
              value={formData.name_user} 
              onChange={handleChange}
              className="bg-gray-50" 
            />
            <InputField 
              label="Email" 
              name="email" 
              type="email" 
              value={formData.email} 
              onChange={handleChange}
              className="bg-gray-50" 
            />
            <InputField 
              label="Data de Nascimento" 
              name="birthDate" 
              type="date" 
              value={formData.birthDate} 
              onChange={handleChange}
              className="bg-gray-50" 
            />
            <InputField 
              label="Cidade" 
              name="city" 
              value={formData.city} 
              onChange={handleChange}
              className="bg-gray-50" 
            />
            <div className="md:col-span-2">
              <InputField 
                label="Diagnóstico" 
                name="diagnosis" 
                value={formData.diagnosis} 
                onChange={handleChange}
                className="bg-gray-50" 
              />
            </div>
            <div className="md:col-span-2">
              <label className="block font-medium text-gray-700 mb-1">Anotações que deseja compartilhar com a IA</label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg p-3 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows="4"
                placeholder="Digite as anotações sobre o paciente..."
              />
            </div>
            <div className="md:col-span-2">
              <label className="block font-medium text-gray-700 mb-1">Status</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg p-3 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="Ativo">Ativo</option>
                <option value="Inativo">Inativo</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end mt-8">
            <Button onClick={handleSave} className="px-8">
              Salvar Alterações
            </Button>
          </div>
        </div>
      ) : activeTab === "exercises" ? (
        <div className="space-y-6 bg-white shadow-md p-8 rounded-xl">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-700">Exercícios do Paciente</h2>
            <Button onClick={handleOpenModal} variant="primary">
              + Atribuir Novo Exercício
            </Button>
          </div>
          
          {/* Abas dos exercícios */}
          <div className="mb-6">
            <div className="bg-gray-50 rounded-xl p-1.5 inline-flex">
              <button
                onClick={() => setExerciseTab("pending")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  exerciseTab === "pending"
                    ? "bg-white text-blue-600 shadow-sm"
                    : "text-gray-600 hover:text-blue-500"
                }`}
              >
                <div className="flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                  </svg>
                  Pendentes
                </div>
              </button>
              <button
                onClick={() => setExerciseTab("completed")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  exerciseTab === "completed"
                    ? "bg-white text-green-600 shadow-sm"
                    : "text-gray-600 hover:text-green-500"
                }`}
              >
                <div className="flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Concluídos
                </div>
              </button>
              <button
                onClick={() => setExerciseTab("waiting")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  exerciseTab === "waiting"
                    ? "bg-white text-yellow-600 shadow-sm"
                    : "text-gray-600 hover:text-yellow-500"
                }`}
              >
                <div className="flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                  </svg>
                  Aguardando Avaliação
                </div>
              </button>
            </div>
          </div>

          {exercises.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 rounded-lg">
              <p className="text-gray-500">Nenhum exercício encontrado para este paciente.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {exercises
                .filter(exercise => {
                  switch(exerciseTab) {
                    case "pending":
                      return exercise.status === "pending";
                    case "completed":
                      return exercise.status === "completed";
                    case "waiting":
                      return exercise.status === "waiting";
                    default:
                      return true;
                  }
                })
                .map((exercise) => (
                <div key={exercise._id} className="bg-white rounded-lg border border-gray-200 hover:border-blue-200 transition-all duration-200">
                  <div className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3">
                          <h3 className="font-medium text-gray-900">{exercise.exerciseId?.title || "Exercício sem título"}</h3>
                          <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            exercise.status === "pending" ? "bg-yellow-100 text-yellow-800" :
                            exercise.status === "completed" ? "bg-green-100 text-green-800" :
                            "bg-blue-100 text-blue-800"
                          }`}>
                            {exercise.status}
                          </span>
                        </div>
                        <div className="mt-2 flex items-center gap-4 text-sm text-gray-500">
                          {exercise.startDate && (
                            <div className="flex items-center gap-1">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                              </svg>
                              Início: {new Date(exercise.startDate).toLocaleDateString()}
                            </div>
                          )}
                          {exercise.endDate && (
                            <div className="flex items-center gap-1">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                              </svg>
                              Fim: {new Date(exercise.endDate).toLocaleDateString()}
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        {exercise.status === "pending" && (
                          <Button 
                            variant="danger" 
                            icon={Trash2} 
                            onClick={() => handleDeleteClick(exercise)}
                            className="ml-4"
                          />
                        )}
                        {exercise.status === "waiting" && (
                          <Button 
                            variant="primary" 
                            onClick={() => handleViewResponse(exercise)}
                          >
                            Ver Resposta
                          </Button>
                        )}
                        {exercise.status === "completed" && (
                          <Button 
                            variant="primary" 
                            onClick={() => handleViewCompletedExercise(exercise)}
                          >
                            Ver Detalhes
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-6 bg-white shadow-md p-8 rounded-xl">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-700">Documentos do Paciente</h2>
            <Button onClick={() => setIsDocumentModalOpen(true)} variant="primary">
              + Adicionar Novo Documento
            </Button>
          </div>

          {/* Abas dos documentos */}
          <div className="mb-6">
            <div className="bg-gray-50 rounded-xl p-1.5 inline-flex">
              <button
                onClick={() => setDocumentTab("anamnese")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  documentTab === "anamnese"
                    ? "bg-white text-blue-600 shadow-sm"
                    : "text-gray-600 hover:text-blue-500"
                }`}
              >
                <div className="flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                  </svg>
                  Anamnese
                </div>
              </button>
              <button
                onClick={() => setDocumentTab("evolucao")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  documentTab === "evolucao"
                    ? "bg-white text-blue-600 shadow-sm"
                    : "text-gray-600 hover:text-blue-500"
                }`}
              >
                <div className="flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z" clipRule="evenodd" />
                  </svg>
                  Evolução
                </div>
              </button>
            </div>
          </div>
          
          {documents.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 rounded-lg">
              <p className="text-gray-500">Nenhum documento encontrado para este paciente.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {documents
                .filter(document => document.type === documentTab)
                .map((document) => (
                <div key={document._id} className="bg-white rounded-lg border border-gray-200 hover:border-blue-200 transition-all duration-200">
                  <div className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-3">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                          </svg>
                          <h3 className="font-medium text-gray-900">
                            {document.type === "anamnese"
                              ? "Anamnese"
                              : document.type === "evolucao"
                              ? "Evolução"
                              : "Relatório"}
                          </h3>

                          <span className="text-xs text-gray-500">
                            {new Date(document.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        <div className="pl-7 space-y-3">
                          <p className="text-gray-600 whitespace-pre-wrap">{document.report}</p>
                          <div className="border-t pt-3">
                            <p className="text-sm font-medium text-gray-700 mb-1">Observação:</p>
                            <p className="text-gray-600">{document.observation}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg relative">
            <h2 className="text-2xl font-bold mb-4">Atribuir Novo Exercício</h2>

            {/* Selecionar Categoria */}
            <div className="mb-4">
              <label className="block font-medium mb-1">Categoria</label>
              <select
                value={selectedCategoryId}
                onChange={(e) => handleCategoryChange(e.target.value)}
                className="w-full border border-gray-300 rounded-lg p-2"
              >
                <option value="">Selecione uma categoria</option>
                {categories.map((category) => (
                  <option key={category._id} value={category._id}>
                    {category.title}
                  </option>
                ))}
              </select>
            </div>

            {/* Selecionar Exercício */}
            <div className="mb-4">
              <label className="block font-medium mb-1">Exercício</label>
              <select
                value={selectedExerciseId}
                onChange={(e) => setSelectedExerciseId(e.target.value)}
                className="w-full border border-gray-300 rounded-lg p-2"
                disabled={!selectedCategoryId}
              >
                <option value="">Selecione um exercício</option>
                {availableExercises.map((exercise) => (
                  <option key={exercise._id} value={exercise._id}>
                    {exercise.title}
                  </option>
                ))}
              </select>
            </div>

            {/* Datas */}
            <div className="mb-4">
              <label className="block font-medium mb-1">Data de Início</label>
              <input
                type="date"
                value={newStartDate}
                onChange={(e) => setNewStartDate(e.target.value)}
                className="w-full border border-gray-300 rounded-lg p-2"
              />
            </div>

            <div className="mb-4">
              <label className="block font-medium mb-1">Data de Término</label>
              <input
                type="date"
                value={newEndDate}
                onChange={(e) => setNewEndDate(e.target.value)}
                className="w-full border border-gray-300 rounded-lg p-2"
              />
            </div>

            {/* Botões */}
            <div className="flex justify-end gap-4">
              <Button variant="outline" onClick={() => setIsModalOpen(false)}>Cancelar</Button>
              <Button onClick={handleSaveNewExercise}>Salvar</Button>
            </div>
          </div>
        </div>
      )}

      {isDeleteModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <h2 className="text-2xl font-bold mb-4">Confirmar Exclusão</h2>
            <p className="mb-4">
              Tem certeza que deseja excluir o exercício "{exerciseToDelete?.exerciseId?.title}"?
            </p>
            <div className="flex justify-end gap-4">
              <Button 
                variant="outline" 
                onClick={() => {
                  setIsDeleteModalOpen(false);
                  setExerciseToDelete(null);
                }}
              >
                Cancelar
              </Button>
              <Button 
                variant="danger" 
                onClick={() => handleDeleteExercise(exerciseToDelete._id)}
              >
                Confirmar Exclusão
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Adicionar Documento */}
      {isDocumentModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg relative">
            <h2 className="text-2xl font-bold mb-4">Adicionar Novo Documento</h2>

            <div className="mb-4">
              <label className="block font-medium mb-1">Tipo de Documento</label>
              <select
                value={newDocument.type}
                onChange={(e) => setNewDocument(prev => ({ ...prev, type: e.target.value }))}
                className="w-full border border-gray-300 rounded-lg p-2"
              >
                <option value="anamnese">Anamnese</option>
                <option value="evolucao">Evolução</option>
              </select>
            </div>

            <div className="mb-4">
              <label className="block font-medium mb-1">Relatório</label>
              <textarea
                value={newDocument.report}
                onChange={(e) => setNewDocument(prev => ({ ...prev, report: e.target.value }))}
                className="w-full border border-gray-300 rounded-lg p-2 h-32"
                placeholder="Digite o relatório..."
              />
            </div>

            <div className="mb-4">
              <label className="block font-medium mb-1">Observação</label>
              <textarea
                value={newDocument.observation}
                onChange={(e) => setNewDocument(prev => ({ ...prev, observation: e.target.value }))}
                className="w-full border border-gray-300 rounded-lg p-2 h-32"
                placeholder="Digite a observação..."
              />
            </div>

            <div className="flex justify-end gap-4">
              <Button variant="outline" onClick={() => setIsDocumentModalOpen(false)}>Cancelar</Button>
              <Button onClick={handleSaveNewDocument}>Salvar</Button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Resposta do Exercício */}
      {isResponseModalOpen && exerciseResponse && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-6xl relative">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">Avaliação de Exercício</h2>
              <button
                onClick={() => setIsResponseModalOpen(false)}
                className="text-gray-500 hover:text-gray-700 transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Resposta do Paciente */}
              <div className="bg-gray-50 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Resposta do Paciente</h3>
                
                <div className="space-y-6">
                  <div>
                    <h4 className="text-sm font-medium text-gray-600 mb-1">Exercício</h4>
                    <p className="text-gray-800 font-medium">{selectedExercise?.exerciseId?.title}</p>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium text-gray-600 mb-1">Comentário</h4>
                    <p className="text-gray-800 bg-white rounded-lg p-3 border border-gray-200">
                      {exerciseResponse.patientComment}
                    </p>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium text-gray-600 mb-1">Data da Resposta</h4>
                    <p className="text-gray-800">
                      {new Date(exerciseResponse.responseDate).toLocaleDateString()}
                    </p>
                  </div>

                  {exerciseResponse.audioUrl && (
                    <div>
                      <h4 className="text-sm font-medium text-gray-600 mb-2">Áudio da Resposta</h4>
                      <div className="bg-white rounded-lg p-3 border border-gray-200">
                        <audio controls className="w-full">
                          <source src={exerciseResponse.audioUrl} type="audio/mpeg" />
                          Seu navegador não suporta o elemento de áudio.
                        </audio>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Avaliação do Terapeuta */}
              <div className="bg-white rounded-xl p-6 border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Avaliação do Terapeuta</h3>
                
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Comentário
                    </label>
                    <textarea
                      name="therapistComment"
                      value={therapistEvaluation.therapistComment}
                      onChange={handleEvaluationChange}
                      className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      rows="4"
                      placeholder="Digite seu comentário sobre a resposta do paciente..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Feedback para o Paciente
                    </label>
                    <textarea
                      name="therapistFeedback"
                      value={therapistEvaluation.therapistFeedback}
                      onChange={handleEvaluationChange}
                      className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      rows="4"
                      placeholder="Digite o feedback para o paciente..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nota (0-10)
                    </label>
                    <div className="flex items-center gap-4">
                      <input
                        type="range"
                        name="score"
                        value={therapistEvaluation.score}
                        onChange={handleEvaluationChange}
                        min="0"
                        max="10"
                        step="1"
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                      />
                      <span className="text-lg font-medium text-gray-800 min-w-[2rem] text-center">
                        {therapistEvaluation.score}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end gap-4 mt-8">
                  <Button 
                    variant="outline" 
                    onClick={() => setIsResponseModalOpen(false)}
                    className="px-6"
                  >
                    Cancelar
                  </Button>
                  <Button 
                    onClick={handleSaveEvaluation}
                    className="px-6"
                  >
                    Salvar Avaliação
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Exercício Completo */}
      {isCompletedModalOpen && completedExerciseData.exercise && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-6xl relative">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">Detalhes do Exercício</h2>
              <button
                onClick={() => setIsCompletedModalOpen(false)}
                className="text-gray-500 hover:text-gray-700 transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Resposta do Paciente */}
              <div className="bg-gray-50 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Resposta do Paciente</h3>
                
                <div className="space-y-6">
                  <div>
                    <h4 className="text-sm font-medium text-gray-600 mb-1">Exercício</h4>
                    <p className="text-gray-800 font-medium">{completedExerciseData.exercise?.exerciseId?.title}</p>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium text-gray-600 mb-1">Comentário</h4>
                    <p className="text-gray-800 bg-white rounded-lg p-3 border border-gray-200">
                      {completedExerciseData.response?.patientComment}
                    </p>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium text-gray-600 mb-1">Data da Resposta</h4>
                    <p className="text-gray-800">
                      {new Date(completedExerciseData.response?.responseDate).toLocaleDateString()}
                    </p>
                  </div>

                  {completedExerciseData.response?.audioUrl && (
                    <div>
                      <h4 className="text-sm font-medium text-gray-600 mb-2">Áudio da Resposta</h4>
                      <div className="bg-white rounded-lg p-3 border border-gray-200">
                        <audio controls className="w-full">
                          <source src={completedExerciseData.response.audioUrl} type="audio/mpeg" />
                          Seu navegador não suporta o elemento de áudio.
                        </audio>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Avaliação do Terapeuta */}
              <div className="bg-white rounded-xl p-6 border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Avaliação do Terapeuta</h3>
                
                <div className="space-y-6">
                  <div>
                    <h4 className="text-sm font-medium text-gray-600 mb-1">Comentário</h4>
                    <p className="text-gray-800 bg-gray-50 rounded-lg p-3 border border-gray-200">
                      {completedExerciseData.evaluation?.therapistComment}
                    </p>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium text-gray-600 mb-1">Feedback</h4>
                    <p className="text-gray-800 bg-gray-50 rounded-lg p-3 border border-gray-200">
                      {completedExerciseData.evaluation?.therapistFeedback}
                    </p>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium text-gray-600 mb-1">Nota</h4>
                    <div className="flex items-center gap-2">
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div 
                          className="bg-blue-600 h-2.5 rounded-full" 
                          style={{ width: `${(completedExerciseData.evaluation?.score / 10) * 100}%` }}
                        ></div>
                      </div>
                      <span className="text-lg font-medium text-gray-800 min-w-[2rem] text-center">
                        {completedExerciseData.evaluation?.score}
                      </span>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium text-gray-600 mb-1">Data da Avaliação</h4>
                    <p className="text-gray-800">
                      {new Date(completedExerciseData.evaluation?.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Chat Component */}
      {!loading && patient && (
        <ChatComponent 
          patientId={id} 
          patientNotes={patient.notes || ''} 
        />
      )}
    </MainLayout>
  );
}

function InputField({ label, name, value, onChange, type = "text", className = "" }) {
  return (
    <div>
      <label className="block font-medium text-gray-700 mb-1">{label}</label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        className={`w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${className}`}
      />
    </div>
  );
}

export default PatientDetailsPage;
