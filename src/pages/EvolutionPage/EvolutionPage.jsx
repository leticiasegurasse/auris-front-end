import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FileText, Plus, Search, Filter, X } from 'lucide-react';
import { ROUTES } from '../../config/routes';
import MainLayout from '../../layouts/MainLayout';
import { getAllPatientDocuments } from '../../api/patients/patientDocuments';
import AlertMessage from '../../components/AlertComponent/AlertMessage';

function EvolutionPage() {
  const [documents, setDocuments] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState(null);
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    async function fetchDocuments() {
      try {
        const response = await getAllPatientDocuments();
        setDocuments(response);
        console.log(response);
      } catch (error) {
        console.error('Erro ao buscar documentos:', error);
        setAlert({ type: 'error', message: 'Erro ao carregar documentos' });
      } finally {
        setLoading(false);
      }
    }

    fetchDocuments();
  }, []);

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

  return (
    <MainLayout>
      <div>
        {alert && (
          <AlertMessage type={alert.type} message={alert.message} className="mb-4" onClose={() => setAlert(null)} />
        )}

        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Evoluções</h1>
          <Link
            to={ROUTES.EVOLUTION}
            className="flex items-center gap-2 bg-[var(--primary-color)] text-white px-4 py-2 rounded-lg hover:bg-[var(--dark-blue)] transition"
          >
            <Plus size={20} />
            Nova Evolução
          </Link>
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