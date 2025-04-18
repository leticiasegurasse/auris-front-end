// src/pages/PatientDetailsPage.jsx
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import MainLayout from "../../layouts/MainLayout";
import Button from "../../components/ButtonComponent/ButtonComponent";
import { useCustomNavigate } from "../../hooks/useCustomNavigate";
import { ArrowBigLeftDash } from "lucide-react";
import { getPatientById } from "../../api/patients/patient";

function PatientDetailsPage() {
  const { id } = useParams();
  const { goBack } = useCustomNavigate();
  const [patient, setPatient] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPatient = async () => {
      try {
        const data = await getPatientById(id);
        setPatient(data);
      } catch (error) {
        console.error("Erro ao buscar paciente:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPatient();
  }, [id]);

  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    return new Date(dateStr).toLocaleDateString("pt-BR");
  };

  return (
    <MainLayout>
      <div className="w-full mb-6">
        <Button 
          variant="transparent" 
          icon={ArrowBigLeftDash}
          onClick={goBack}
        >
          Voltar
        </Button>
      </div>

      {loading ? (
        <p className="text-gray-500">Carregando dados do paciente...</p>
      ) : patient ? (
        <div className="space-y-4 bg-white shadow-md p-6 rounded-xl">
          <h2 className="text-2xl font-bold text-gray-700 mb-4">Detalhes do Paciente</h2>
          <p><strong>Nome:</strong> {patient.userId.name_user}</p>
          <p><strong>Email:</strong> {patient.userId.email}</p>
          <p><strong>Data de Nascimento:</strong> {formatDate(patient.birthDate)}</p>
          <p><strong>Diagnóstico:</strong> {patient.diagnosis}</p>
          <p><strong>Status:</strong> {patient.status}</p>
        </div>
      ) : (
        <p className="text-red-500">Paciente não encontrado.</p>
      )}
    </MainLayout>
  );
}

export default PatientDetailsPage;
