import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import MainLayout from "../../layouts/MainLayout";
import Button from "../../components/ButtonComponent/ButtonComponent";
import { useCustomNavigate } from "../../hooks/useCustomNavigate";
import { ArrowBigLeftDash } from "lucide-react";
import { getPatientById, updatePatientById } from "../../api/patients/patient";
import { updateUserById } from "../../api/users/user";
import { getPatientExercisesByPatientId } from "../../api/patients/patient"; // vamos criar esse serviço já já
import AlertMessage from "../../components/AlertComponent/AlertMessage";

function PatientDetailsPage() {
  const { id } = useParams();
  const { goBack } = useCustomNavigate();

  const [alert, setAlert] = useState(null);
  const [patient, setPatient] = useState(null);
  const [exercises, setExercises] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("details"); // 👈 controla o menu (details ou exercises)

  const [formData, setFormData] = useState({
    name_user: "",
    email: "",
    birthDate: "",
    diagnosis: "",
    status: "",
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
        });

        const exercisesData = await getPatientExercisesByPatientId(id);
        setExercises(exercisesData);
      } catch (error) {
        console.error("Erro ao buscar paciente ou exercícios:", error);
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
      };

      await updatePatientById(id, updatedPatientData);

      setAlert({ type: "success", message: "Dados alterados com sucesso!" });
    } catch (error) {
      setAlert({ type: "error", message: "Erro ao atualizar paciente." });
    }
  };

  return (
    <MainLayout>
      {alert && (
        <AlertMessage type={alert.type} message={alert.message} className="mb-4" onClose={() => setAlert(null)} />
      )}

      <div className="w-full mb-6">
        <Button variant="transparent" icon={ArrowBigLeftDash} onClick={goBack}>
          Voltar
        </Button>
      </div>

      {/* Menu de navegação */}
      <div className="flex gap-4 mb-6">
        <Button variant={activeTab === "details" ? "primary" : "outline"} onClick={() => setActiveTab("details")}>
          Dados do Paciente
        </Button>
        <Button variant={activeTab === "exercises" ? "primary" : "outline"} onClick={() => setActiveTab("exercises")}>
          Exercícios
        </Button>
      </div>

      {/* Conteúdo Condicional */}
      {loading ? (
        <p className="text-gray-500">Carregando...</p>
      ) : activeTab === "details" ? (
        <div className="space-y-4 bg-white shadow-md p-6 rounded-xl">
          <h2 className="text-2xl font-bold text-gray-700 mb-4">Editar Paciente</h2>

          <div className="space-y-4">
            <InputField label="Nome" name="name_user" value={formData.name_user} onChange={handleChange} />
            <InputField label="Email" name="email" type="email" value={formData.email} onChange={handleChange} />
            <InputField label="Data de Nascimento" name="birthDate" type="date" value={formData.birthDate} onChange={handleChange} />
            <InputField label="Diagnóstico" name="diagnosis" value={formData.diagnosis} onChange={handleChange} />
            <div>
              <label className="block font-medium text-gray-700 mb-1">Status</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg p-2"
              >
                <option value="Ativo">Ativo</option>
                <option value="Inativo">Inativo</option>
              </select>
            </div>
          </div>

          <Button onClick={handleSave} className="mt-4">
            Salvar Alterações
          </Button>
        </div>
      ) : (
        <div className="space-y-4 bg-white shadow-md p-6 rounded-xl">
          <h2 className="text-2xl font-bold text-gray-700 mb-4">Exercícios do Paciente</h2>
          {exercises.length === 0 ? (
            <p className="text-gray-500">Nenhum exercício encontrado para este paciente.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {exercises.map((exercise) => (
                <div key={exercise._id} className="bg-gray-100 rounded-lg p-4 shadow hover:shadow-md transition">
                  <h3 className="font-bold text-lg mb-2">{exercise.exerciseId?.title || "Exercício sem título"}</h3>
                  <p className="text-gray-600">Status: {exercise.status}</p>
                  {exercise.startDate && (
                    <p className="text-gray-500 text-sm">Início: {new Date(exercise.startDate).toLocaleDateString()}</p>
                  )}
                  {exercise.endDate && (
                    <p className="text-gray-500 text-sm">Fim: {new Date(exercise.endDate).toLocaleDateString()}</p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </MainLayout>
  );
}

function InputField({ label, name, value, onChange, type = "text" }) {
  return (
    <div>
      <label className="block font-medium text-gray-700 mb-1">{label}</label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        className="w-full border border-gray-300 rounded-lg p-2"
      />
    </div>
  );
}

export default PatientDetailsPage;
