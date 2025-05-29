import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FileText, Plus, Search, Filter, X, User, Calendar, Clock, ChevronRight, ChevronLeft } from 'lucide-react';
import { ROUTES } from '../../config/routes';
import MainLayout from '../../layouts/MainLayout';
import { getAllPatientDocuments } from '../../api/patients/patientDocuments';
import { getAllPatients } from '../../api/patients/patient';
import AlertMessage from '../../components/AlertComponent/AlertMessage';
import { createPatientDocument } from '../../api/patients/patientDocuments';
import Button from '../../components/ButtonComponent/ButtonComponent';

function EvolutionPage() {
  const [documents, setDocuments] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState(null);
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAddDocumentModalOpen, setIsAddDocumentModalOpen] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [documentType, setDocumentType] = useState('');
  const [report, setReport] = useState('');
  const [observation, setObservation] = useState('');
  const [patients, setPatients] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [limit] = useState(5);

  useEffect(() => {
    async function fetchData() {
      try {
        const [documentsResponse, patientsResponse] = await Promise.all([
          getAllPatientDocuments(currentPage, limit),
          getAllPatients()
        ]);
        
        // Verifica se documentsResponse existe e tem a estrutura esperada
        if (documentsResponse && documentsResponse.reports) {
          setDocuments(documentsResponse.reports);
          if (documentsResponse.pagination) {
            setTotalPages(documentsResponse.pagination.totalPages);
          }
        } else {
          setDocuments([]);
          setTotalPages(1);
        }
        
        if (patientsResponse && patientsResponse.data) {
          setPatients(patientsResponse.data);
        } else {
          setPatients([]);
        }
      } catch (error) {
        console.error('Erro ao buscar dados:', error);
        setAlert({ type: 'error', message: 'Erro ao carregar dados' });
        setDocuments([]);
        setTotalPages(1);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [currentPage, limit]);

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const filteredDocuments = documents?.filter(doc => {
    if (!doc) return false;
    const matchesSearch = doc.report?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doc.patientId?.userId?.name_user?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filter === 'all' || doc.type === filter;
    return matchesSearch && matchesFilter;
  }) || [];

  const handleDocumentClick = (doc) => {
    setSelectedDocument(doc);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedDocument(null);
  };

  const handleAddDocument = () => {
    setIsAddDocumentModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (!selectedPatient) {
        setAlert({ type: 'error', message: 'Selecione um paciente' });
        return;
      }

      const documentData = {
        patientId: selectedPatient._id,
        type: documentType,
        report: report,
        observation: observation
      };

      await createPatientDocument(documentData);
      
      // Atualizar a lista de documentos
      const updatedDocuments = await getAllPatientDocuments();
      setDocuments(updatedDocuments);
      
      // Limpar formulário e fechar modal
      setSelectedPatient(null);
      setDocumentType('');
      setReport('');
      setObservation('');
      setIsAddDocumentModalOpen(false);
      
      setAlert({ type: 'success', message: 'Documento salvo com sucesso!' });
    } catch (error) {
      console.error('Erro ao salvar documento:', error);
      setAlert({ type: 'error', message: 'Erro ao salvar documento' });
    }
  };

  return (
    <MainLayout>
      <div>
        {alert && (
          <AlertMessage type={alert.type} message={alert.message} className="mb-4" onClose={() => setAlert(null)} />
        )}

        <div className="max-w-7xl mx-auto space-y-6">
          {/* Header Section */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">Documentos</h1>
              <p className="text-gray-600 mt-1">Gerencie e acompanhe os documentos dos pacientes</p>
            </div>
            <Button
              onClick={handleAddDocument}
            >
              <Plus size={20} />
              Adicionar Documento
            </Button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20 hover:shadow-xl transition-all duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">Total de Documentos</p>
                  <p className="text-3xl font-bold text-indigo-600 mt-1">{documents.length}</p>
                </div>
                <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center">
                  <FileText className="text-indigo-600" size={24} />
                </div>
              </div>
            </div>
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20 hover:shadow-xl transition-all duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">Total de Evoluções</p>
                  <p className="text-3xl font-bold text-purple-600 mt-1">
                    {documents.filter(doc => doc.type === 'evolucao').length}
                  </p>
                </div>
                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                  <Calendar className="text-purple-600" size={24} />
                </div>
              </div>
            </div>
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20 hover:shadow-xl transition-all duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">Total de Anamneses</p>
                  <p className="text-3xl font-bold text-pink-600 mt-1">
                    {documents.filter(doc => doc.type === 'anamnese').length}
                  </p>
                </div>
                <div className="w-12 h-12 bg-pink-100 rounded-xl flex items-center justify-center">
                  <Clock className="text-pink-600" size={24} />
                </div>
              </div>
            </div>
          </div>

          {/* Search and Filter Section */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6 border border-white/20">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Buscar documentos..."
                  className="w-full pl-12 pr-4 py-3 bg-white/50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="flex items-center gap-2 bg-white/50 p-3 rounded-xl border border-gray-200">
                <Filter size={20} className="text-gray-600" />
                <select
                  className="bg-transparent border-none focus:outline-none focus:ring-0 text-gray-600"
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                >
                  <option value="all">Todos</option>
                  <option value="evolução">Evoluções</option>
                  <option value="avaliação">Avaliações</option>
                </select>
              </div>
            </div>
          </div>

          {/* Documents List */}
          <div className="space-y-4">
            {loading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500 mx-auto"></div>
                <p className="mt-4 text-gray-600">Carregando documentos...</p>
              </div>
            ) : filteredDocuments.length === 0 ? (
              <div className="text-center py-12 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6 border border-white/20">
                <FileText className="mx-auto text-gray-400" size={48} />
                <p className="mt-4 text-gray-600">Nenhum documento encontrado</p>
              </div>
            ) : (
              <>
                <div className="grid gap-4">
                  {filteredDocuments.map((doc) => (
                    <div
                      key={doc._id}
                      className="group bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6 border border-white/20 hover:shadow-xl transition-all duration-300 cursor-pointer"
                      onClick={() => handleDocumentClick(doc)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center group-hover:bg-indigo-200 transition-colors">
                            <FileText className="text-indigo-600" size={24} />
                          </div>
                          <div>
                            <h3 className="font-medium text-gray-800 group-hover:text-indigo-600 transition-colors">
                              {doc.type === 'anamnese' ? 'Anamnese' : doc.type === 'evolucao' ? 'Evolução' : doc.type}
                            </h3>
                            <p className="text-sm text-gray-600 flex items-center gap-2">
                              <User size={16} />
                              {doc.patientId?.userId?.name_user || 'Paciente não encontrado'}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="text-sm text-gray-500 flex items-center gap-2">
                            <Calendar size={16} />
                            {new Date(doc.createdAt).toLocaleDateString('pt-BR')}
                          </div>
                          <ChevronRight className="text-gray-400 group-hover:text-indigo-600 transition-colors" />
                        </div>
                      </div>
                    </div>
                  ))}
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
                            ? 'bg-indigo-600 text-white'
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

        {/* Modal de Adicionar Documento */}
        {isAddDocumentModalOpen && (
          <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Adicionar Novo Documento</h2>
                <button
                  onClick={() => setIsAddDocumentModalOpen(false)}
                  className="text-gray-500 hover:text-gray-700 transition-colors"
                >
                  <X size={24} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Paciente
                    </label>
                    <select
                      value={selectedPatient?._id || ''}
                      onChange={(e) => {
                        const patient = patients.find(p => p._id === e.target.value);
                        setSelectedPatient(patient);
                      }}
                      className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                      required
                    >
                      <option value="">Selecione o paciente</option>
                      {patients.map((patient) => (
                        <option key={patient._id} value={patient._id}>
                          {patient.userId?.name_user}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tipo de Documento
                    </label>
                    <select
                      value={documentType}
                      onChange={(e) => setDocumentType(e.target.value)}
                      className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                      required
                    >
                      <option value="">Selecione o tipo</option>
                      <option value="anamnese">Anamnese</option>
                      <option value="evolucao">Evolução</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Relatório
                  </label>
                  <textarea
                    value={report}
                    onChange={(e) => setReport(e.target.value)}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 h-32"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Observação
                  </label>
                  <textarea
                    value={observation}
                    onChange={(e) => setObservation(e.target.value)}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 h-20"
                  />
                </div>

                <div className="flex justify-end gap-4">
                  <Button
                    onClick={() => setIsAddDocumentModalOpen(false)}
                    variant="outline"
                  >
                    Cancelar
                  </Button>
                  <Button
                    type="submit"
                  >
                    Salvar
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Modal de Visualização */}
        {isModalOpen && selectedDocument && (
          <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">
                  {selectedDocument.type === 'anamnese' ? 'Anamnese' : selectedDocument.type === 'evolucao' ? 'Evolução' : selectedDocument.type}
                </h2>
                <button
                  onClick={closeModal}
                  className="text-gray-500 hover:text-gray-700 transition-colors"
                >
                  <X size={24} />
                </button>
              </div>
              
              <div className="space-y-6">
                <div className='flex justify-between items-center bg-gray-50 p-4 rounded-xl'>
                  <div className="flex items-center gap-2">
                    <User size={20} className="text-gray-600" />
                    <p className="text-gray-800">{selectedDocument.patientId?.userId?.name_user || 'Paciente não encontrado'}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar size={20} className="text-gray-600" />
                    <p className="text-gray-600">
                      {new Date(selectedDocument.createdAt).toLocaleDateString('pt-BR')}
                    </p>
                  </div>
                </div>

                <div className="bg-white border border-gray-200 rounded-xl p-6">
                  <h3 className="font-medium text-lg text-gray-800 mb-4">Relatório:</h3>
                  <p className="text-gray-600 whitespace-pre-wrap leading-relaxed">{selectedDocument.report}</p>
                </div>

                {selectedDocument.observation && (
                  <div className="bg-gray-50 border border-gray-200 rounded-xl p-6">
                    <h3 className="font-medium text-lg text-gray-800 mb-4">Observação:</h3>
                    <p className="text-gray-600 whitespace-pre-wrap leading-relaxed">{selectedDocument.observation}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
}

export default EvolutionPage; 