import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FileText, Plus, Search, Filter, X, User } from 'lucide-react';
import { ROUTES } from '../../config/routes';
import MainLayout from '../../layouts/MainLayout';
import { getAllPatientDocuments } from '../../api/patients/patientDocuments';
import { getAllPatients } from '../../api/patients/patient';
import AlertMessage from '../../components/AlertComponent/AlertMessage';
import { createPatientDocument } from '../../api/patients/patientDocuments';

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

  useEffect(() => {
    async function fetchData() {
      try {
        const [documentsResponse, patientsResponse] = await Promise.all([
          getAllPatientDocuments(),
          getAllPatients()
        ]);
        setDocuments(documentsResponse);
        setPatients(patientsResponse.data);
      } catch (error) {
        console.error('Erro ao buscar dados:', error);
        setAlert({ type: 'error', message: 'Erro ao carregar dados' });
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  useEffect(() => {
    console.log(patients);
  }, [patients]);

  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = doc.report.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doc.patientId?.name_user?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filter === 'all' || doc.type === filter;
    return matchesSearch && matchesFilter;
  });

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

        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold text-gray-800">Evoluções</h1>
          <button
            onClick={handleAddDocument}
            className="flex items-center gap-2 bg-[var(--primary-color)] text-white px-4 py-2 rounded-lg hover:bg-[var(--dark-blue)] transition"
          >
            <Plus size={20} />
            Adicionar Documento
          </button>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-white p-4 rounded-lg shadow-md">
            <h3 className="text-gray-600 text-sm">Total de Documentos</h3>
            <p className="text-2xl font-bold text-[var(--primary-color)]">{documents.length}</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-md">
            <h3 className="text-gray-600 text-sm">Total de Evoluções</h3>
            <p className="text-2xl font-bold text-[var(--primary-color)]">
              {documents.filter(doc => doc.type === 'evolucao').length}
            </p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-md">
            <h3 className="text-gray-600 text-sm">Total de Anamneses</h3>
            <p className="text-2xl font-bold text-[var(--primary-color)]">
              {documents.filter(doc => doc.type === 'anamnese').length}
            </p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Buscar evoluções..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)]"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter size={20} className="text-gray-600" />
              <select
                className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)]"
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
              >
                <option value="all">Todos</option>
                <option value="evolução">Evoluções</option>
                <option value="avaliação">Avaliações</option>
              </select>
            </div>
          </div>

          {loading ? (
            <div className="text-center py-8">Carregando...</div>
          ) : filteredDocuments.length === 0 ? (
            <div className="text-center py-8 text-gray-500">Nenhum documento encontrado</div>
          ) : (
            <div className="grid gap-4">
              {filteredDocuments.map((doc) => (
                <div
                  key={doc._id}
                  className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition cursor-pointer"
                  onClick={() => handleDocumentClick(doc)}
                >
                  <div className="flex items-center gap-4">
                    <div className="bg-[var(--light-blue)] p-3 rounded-lg">
                      <FileText className="text-[var(--primary-color)]" size={24} />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-800">
                        {doc.type === 'anamnese' ? 'Anamnese' : doc.type === 'evolucao' ? 'Evolução' : doc.type}
                      </h3>
                      <p className="text-sm text-gray-600">{doc.patientId?.userId?.name_user || 'Paciente não encontrado'}</p>

                    </div>
                  </div>
                  <div className="text-sm text-gray-500">
                    {new Date(doc.createdAt).toLocaleDateString('pt-BR')}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Modal de Adicionar Documento */}
        {isAddDocumentModalOpen && (
          <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-800">Adicionar Novo Documento</h2>
                <button
                  onClick={() => setIsAddDocumentModalOpen(false)}
                  className="text-gray-500 hover:text-gray-700 cursor-pointer"
                >
                  <X size={24} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Paciente
                  </label>
                  <select
                    value={selectedPatient?._id || ''}
                    onChange={(e) => {
                      const patient = patients.find(p => p._id === e.target.value);
                      setSelectedPatient(patient);
                    }}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)]"
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
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tipo de Documento
                  </label>
                  <select
                    value={documentType}
                    onChange={(e) => setDocumentType(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)]"
                    required
                  >
                    <option value="">Selecione o tipo</option>
                    <option value="anamnese">Anamnese</option>
                    <option value="evolucao">Evolução</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Relatório
                  </label>
                  <textarea
                    value={report}
                    onChange={(e) => setReport(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)] h-32"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Observação
                  </label>
                  <textarea
                    value={observation}
                    onChange={(e) => setObservation(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)] h-20"
                  />
                </div>

                <div className="flex justify-end gap-4">
                  <button
                    type="button"
                    onClick={() => setIsAddDocumentModalOpen(false)}
                    className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-[var(--primary-color)] text-white rounded-lg hover:bg-[var(--dark-blue)]"
                  >
                    Salvar
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Modal */}
        {isModalOpen && selectedDocument && (
          <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-800">
                  {selectedDocument.type === 'anamnese' ? 'Anamnese' : selectedDocument.type === 'evolucao' ? 'Evolução' : selectedDocument.type}
                </h2>
                <button
                  onClick={closeModal}
                  className="text-gray-500 hover:text-gray-700 cursor-pointer"
                >
                  <X size={24} />
                </button>
              </div>
              
              <div className="space-y-4">
                <div className='flex justify-between'>
                  <div>
                    <p className="text-gray-600">{selectedDocument.patientId?.userId?.name_user || 'Paciente não encontrado'}</p>
                  </div>
                  
                  <div>
                    <p className="text-gray-600">
                      {new Date(selectedDocument.createdAt).toLocaleDateString('pt-BR')}
                    </p>
                  </div>
                </div>

                <div>
                  <h3 className="font-medium text-xl">Relatório:</h3>
                  <p className="text-gray-600 whitespace-pre-wrap">{selectedDocument.report}</p>
                </div>

                <div>
                  <p className="font-medium text-sm">
                    Observação: 
                    <span className="text-gray-600 whitespace-pre-wrap"> {selectedDocument.observation}</span>  
                  </p>
                  
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
}

export default EvolutionPage; 