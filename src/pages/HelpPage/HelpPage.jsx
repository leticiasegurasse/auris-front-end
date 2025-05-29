import { useState } from "react";
import MainLayout from "../../layouts/MainLayout";
import { useCustomNavigate } from "../../hooks/useCustomNavigate";
import { BookOpen, MessageCircle, Video, FileText, ChevronDown, ChevronUp, Mail, Phone, MapPin } from "lucide-react";
import Button from "../../components/ButtonComponent/ButtonComponent";

function HelpPage() {
  const { goTo } = useCustomNavigate();
  const [expandedSection, setExpandedSection] = useState(null);

  const faqItems = [
    {
      question: "Como criar uma nova categoria?",
      answer: "Para criar uma nova categoria, vá até a página de Categorias e clique no botão 'Nova Categoria'. Preencha o título e a descrição da categoria e clique em 'Salvar'."
    },
    {
      question: "Como adicionar exercícios a uma categoria?",
      answer: "Na página da categoria desejada, clique no botão 'Novo Exercício'. Preencha as informações do exercício, incluindo título, descrição e outros detalhes relevantes."
    },
    {
      question: "Posso editar ou excluir uma categoria?",
      answer: "Sim! Você pode editar ou excluir uma categoria através dos botões disponíveis na página da categoria. Lembre-se que ao excluir uma categoria, todos os exercícios associados também serão removidos."
    }
  ];

  const videoTutorials = [
    {
      title: "Primeiros Passos",
      description: "Aprenda a navegar pelo sistema e suas funcionalidades básicas",
      duration: "5:30"
    },
    {
      title: "Gerenciando Categorias",
      description: "Tutorial completo sobre como criar e gerenciar categorias",
      duration: "8:15"
    },
    {
      title: "Criando Exercícios",
      description: "Aprenda a criar e personalizar exercícios",
      duration: "10:45"
    }
  ];

  const toggleSection = (section) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Central de Ajuda</h1>
          <p className="text-lg text-gray-600">Encontre respostas para suas dúvidas e aprenda a usar o sistema</p>
        </div>

        {/* Seção de Pesquisa Rápida */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Pesquisa Rápida</h2>
            <div className="relative">
              <input
                type="text"
                placeholder="Digite sua dúvida..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <button className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Seção de FAQ */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">Perguntas Frequentes</h2>
          <div className="space-y-4">
            {faqItems.map((item, index) => (
              <div key={index} className="border border-gray-200 rounded-lg">
                <button
                  className="w-full px-6 py-4 text-left flex justify-between items-center"
                  onClick={() => toggleSection(index)}
                >
                  <span className="font-medium text-gray-800">{item.question}</span>
                  {expandedSection === index ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                </button>
                {expandedSection === index && (
                  <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
                    <p className="text-gray-600">{item.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Seção de Tutoriais em Vídeo */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">Tutoriais em Vídeo</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {videoTutorials.map((video, index) => (
              <div key={index} className="bg-gray-50 rounded-lg p-6 hover:shadow-md transition-shadow">
                <div className="flex items-center gap-4 mb-4">
                  <div className="p-3 bg-blue-100 rounded-full">
                    <Video className="text-blue-600" size={24} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800">{video.title}</h3>
                    <p className="text-sm text-gray-500">{video.duration}</p>
                  </div>
                </div>
                <p className="text-gray-600 mb-4">{video.description}</p>
                <Button className="w-full">Assistir Tutorial</Button>
              </div>
            ))}
          </div>
        </div>

        {/* Seção de Contato */}
        <div className="bg-white rounded-xl shadow-lg p-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">Entre em Contato</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
              <Mail className="text-blue-600" size={24} />
              <div>
                <h3 className="font-medium text-gray-800">Email</h3>
                <p className="text-gray-600">suporte@sistema.com</p>
              </div>
            </div>
            <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
              <Phone className="text-blue-600" size={24} />
              <div>
                <h3 className="font-medium text-gray-800">Telefone</h3>
                <p className="text-gray-600">(11) 9999-9999</p>
              </div>
            </div>
            <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
              <MapPin className="text-blue-600" size={24} />
              <div>
                <h3 className="font-medium text-gray-800">Endereço</h3>
                <p className="text-gray-600">São Paulo, SP</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}

export default HelpPage; 