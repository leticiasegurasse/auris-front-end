// src/pages/PatientsPage.jsx
import { useEffect, useState } from "react";
import MainLayout from "../../layouts/MainLayout";
import { useCustomNavigate } from "../../hooks/useCustomNavigate";
import { getAllPatients } from "../../api/patients/patient";
import Button from "../../components/ButtonComponent/ButtonComponent";
import { Plus, User, Mail, Calendar, Stethoscope, Activity, ChevronRight, ChevronLeft } from "lucide-react";

function PatientsPage() {
  const [patients, setPatients] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [limit] = useState(5);
  const [loading, setLoading] = useState(true);
  const { goTo } = useCustomNavigate();

  useEffect(() => {
    async function fetchPatients() {
      try {
        setLoading(true);
        const response = await getAllPatients(currentPage, limit);
        setPatients(response.patients || []);
        if (response.pagination) {
          setTotalPages(response.pagination.totalPages);
        }
      } catch (err) {
        console.error("Erro ao buscar pacientes", err);
      } finally {
        setLoading(false);
      }
    }
    fetchPatients();
  }, [currentPage, limit]);

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
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

  return (
    <MainLayout>
      <div>
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row items-center justify-between mb-8">
            <div className="flex items-center gap-4 mb-6 sm:mb-0">
              <div className="p-3 bg-blue-100 rounded-full">
                <User className="text-blue-600" size={24} />
              </div>
              <h1 className="text-3xl font-bold text-gray-800">Pacientes</h1>
            </div>
            <Button
              onClick={() => goTo("NEW_PATIENT")}
            >
              <Plus size={20} />
              Novo Paciente
            </Button>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
              <p className="mt-4 text-gray-600">Carregando pacientes...</p>
            </div>
          ) : patients.length === 0 ? (
            <div className="text-center py-12">
              <div className="bg-white rounded-xl p-8 max-w-md mx-auto shadow-lg flex flex-col items-center justify-center">
                <div className="p-4 bg-blue-100 rounded-full w-16 h-16 mx-auto mb-4">
                  <User className="text-blue-600 mx-auto" size={32} />
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">Nenhum paciente encontrado</h3>
                <p className="text-gray-600 mb-4">Comece cadastrando seu primeiro paciente</p>
                <Button
                  onClick={() => goTo("NEW_PATIENT")}
                >
                  Cadastrar Primeiro Paciente
                </Button>
              </div>
            </div>
          ) : (
            <>
              <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                <div className="grid grid-cols-12 gap-4 p-4 bg-gray-50 border-b border-gray-200">
                  <div className="col-span-3 font-medium text-gray-700">Nome</div>
                  <div className="col-span-3 font-medium text-gray-700">Email</div>
                  <div className="col-span-2 font-medium text-gray-700">Nascimento</div>
                  <div className="col-span-2 font-medium text-gray-700">Diagnóstico</div>
                  <div className="col-span-1 font-medium text-gray-700">Status</div>
                  <div className="col-span-1"></div>
                </div>
                <div className="divide-y divide-gray-100">
                  {patients.map((patient) => (
                    <div
                      key={patient._id}
                      onClick={() => goTo("PATIENT", { id: patient._id })}
                      className="grid grid-cols-12 gap-4 p-4 hover:bg-gray-50 transition-colors cursor-pointer"
                    >
                      <div className="col-span-3 flex items-center gap-3">
                        <div className="p-2 bg-blue-100 rounded-full">
                          <User className="text-blue-600" size={18} />
                        </div>
                        <span className="font-medium text-gray-800">
                          {patient.userId?.name_user || 'Sem nome'}
                        </span>
                      </div>
                      <div className="col-span-3 flex items-center gap-3 text-gray-600">
                        <Mail size={16} className="text-gray-400" />
                        <span className="truncate">{patient.userId?.email || 'Sem email'}</span>
                      </div>
                      <div className="col-span-2 flex items-center gap-3 text-gray-600">
                        <Calendar size={16} className="text-gray-400" />
                        <span>{new Date(patient.birthDate).toLocaleDateString()}</span>
                      </div>
                      <div className="col-span-2 flex items-center gap-3 text-gray-600">
                        <Stethoscope size={16} className="text-gray-400" />
                        <span className="truncate">{patient.diagnosis || 'Sem diagnóstico'}</span>
                      </div>
                      <div className="col-span-1">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(patient.status)}`}>
                          {patient.status}
                        </span>
                      </div>
                      <div className="col-span-1 flex items-center justify-end">
                        <ChevronRight size={16} className="text-gray-400" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Paginação */}
              <div className="flex justify-center items-center gap-2 mt-6">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className={`p-2 rounded-lg ${
                    currentPage === 1
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : 'bg-white text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <ChevronLeft size={20} />
                </button>

                <div className="flex items-center gap-2">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      className={`w-8 h-8 rounded-lg ${
                        currentPage === page
                          ? 'bg-blue-600 text-white'
                          : 'bg-white text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                </div>

                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className={`p-2 rounded-lg ${
                    currentPage === totalPages
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : 'bg-white text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <ChevronRight size={20} />
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </MainLayout>
  );
}

export default PatientsPage;
