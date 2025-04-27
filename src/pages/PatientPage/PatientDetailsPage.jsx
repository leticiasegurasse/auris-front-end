// src/pages/PatientDetailsPage.jsx
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import MainLayout from "../../layouts/MainLayout";
import Button from "../../components/ButtonComponent/ButtonComponent";
import { useCustomNavigate } from "../../hooks/useCustomNavigate";
import { ArrowBigLeftDash } from "lucide-react";
import { getPatientById, updatePatientById } from "../../api/patients/patient";
import { updateUserById } from '../../api/users/user';
import AlertMessage from "../../components/AlertComponent/AlertMessage";

function PatientDetailsPage() {
  const { id } = useParams();
  const { goBack } = useCustomNavigate();

  const [alert, setAlert] = useState(null);
  const [patient, setPatient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    name_user: "",
    email: "",
    birthDate: "",
    diagnosis: "",
    status: "",
  });

  useEffect(() => {
    const fetchPatient = async () => {
      try {
        const data = await getPatientById(id);
        setPatient(data);
        setFormData({
          name_user: data.userId.name_user || "",
          email: data.userId.email || "",
          birthDate: data.birthDate ? data.birthDate.slice(0, 10) : "",
          diagnosis: data.diagnosis || "",
          status: data.status || "ativo",
        });
      } catch (error) {
        console.error("Erro ao buscar paciente:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPatient();
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
  
      const userId = patient.userId._id; // pega o id do usuário
  
      // Primeiro: Atualiza o usuário (nome e email)
      await updateUserById(userId, {
        name_user: formData.name_user,
        email: formData.email,
      });
  
      // Segundo: Atualiza o paciente (diagnóstico, nascimento, etc)
      const updatedPatientData = {
        diagnosis: formData.diagnosis,
        birthDate: formData.birthDate,
        status: formData.status, // lembre de validar se seu model aceita "status", senão tira essa linha
      };
  
      await updatePatientById(id, updatedPatientData);
      console.log(updatedPatientData)
  
      setAlert({ type: "success", message: "Dados alterados com sucesso!" });
    } catch (error) {
      setAlert({ type: "error", message: "Erro ao atualizar paciente:", error });
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

      {loading ? (
        <p className="text-gray-500">Carregando dados do paciente...</p>
      ) : (
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
