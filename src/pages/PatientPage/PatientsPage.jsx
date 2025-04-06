// src/pages/PatientsPage.jsx
import { useEffect, useState } from "react";
import MainLayout from "../../layouts/MainLayout";
import { useCustomNavigate } from "../../hooks/useCustomNavigate";
import { getAllPatients } from "../../api/patients/patient";

function PatientsPage() {
  const [patients, setPatients] = useState([]);
  const { goTo } = useCustomNavigate();

  useEffect(() => {
    async function fetchPatients() {
      try {
        const res = await getAllPatients();
        setPatients(res.data);
      } catch (err) {
        console.error("Erro ao buscar pacientes", err);
      }
    }
    fetchPatients();
  }, []);

  return (
    <MainLayout>
        <div className="w-full">
            <div className="flex items-center justify-between mb-4">
                <h1 className="text-2xl font-semibold text-gray-800">Lista de Pacientes</h1>
                <button
                    className="bg-[var(--primary-color)] text-white px-4 py-2 rounded-lg shadow hover:bg-opacity-90"
                    onClick={() => goTo("newpatient")}
                >
                    Novo Paciente
                </button>
            </div>

            <div className="bg-white shadow-md rounded-lg overflow-hidden">
                <table className="w-full table-auto text-left">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="px-4 py-2">Nome</th>
                            <th className="px-4 py-2">Email</th>
                            <th className="px-4 py-2">Nascimento</th>
                            <th className="px-4 py-2">Diagnóstico</th>
                            <th className="px-4 py-2">Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {patients.map((patient, index) => (
                            <tr key={index}>
                                <td className="px-4 py-2">{patient.userId?.name_user || 'Sem nome'}</td>
                                <td className="px-4 py-2">{patient.userId?.email || 'Sem email'}</td>
                                <td className="px-4 py-2">{new Date(patient.birthDate).toLocaleDateString()}</td>
                                <td className="px-4 py-2">{patient.diagnosis}</td>
                                <td className="px-4 py-2 capitalize">{patient.status}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    </MainLayout>
  );
}

export default PatientsPage;
