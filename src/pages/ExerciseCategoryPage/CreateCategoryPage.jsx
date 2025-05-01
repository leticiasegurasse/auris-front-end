import { useState } from "react";
import MainLayout from "../../layouts/MainLayout";
import { createCategory } from "../../api/categories/categories";
import { useCustomNavigate } from "../../hooks/useCustomNavigate";
import AlertMessage from "../../components/AlertComponent/AlertMessage";
import Button from "../../components/ButtonComponent/ButtonComponent";
import { ArrowLeft, PlusCircle, BookOpen, Sparkles } from "lucide-react";

function CreateCategoryPage() {
    const { goToWithDelay, goTo } = useCustomNavigate();
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [alert, setAlert] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await createCategory({ title, description });
            setAlert({ type: "success", message: "Categoria cadastrada com sucesso!" });
            goToWithDelay("CATEGORIES", 1500)
        } catch (error) {
            setAlert({ type: "error", message: "Erro ao cadastrar categoria:", error });
        }
    };

    return (
        <MainLayout>
            <div>
                <div className="max-w-7xl mx-auto">
                    <div className="flex items-center gap-4 mb-8">
                        <button 
                            onClick={() => goTo("CATEGORIES")}
                            className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors bg-white p-3 rounded-full shadow-sm hover:shadow-md"
                        >
                            <ArrowLeft size={20} />
                        </button>
                        <h1 className="text-3xl font-bold text-gray-800">Criar Nova Categoria</h1>
                    </div>

                    {alert && (
                        <AlertMessage 
                            type={alert.type} 
                            message={alert.message} 
                            className="mb-8" 
                            onClose={() => setAlert(null)} 
                        />
                    )}

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100 transform hover:scale-[1.01] transition-all duration-300">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="p-3 bg-blue-100 rounded-full">
                                    <PlusCircle className="text-blue-600" size={24} />
                                </div>
                                <h2 className="text-xl font-semibold text-gray-800">Detalhes da Categoria</h2>
                            </div>
                            
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-gray-700">Título</label>
                                    <div className="relative">
                                        <input
                                            type="text"
                                            value={title}
                                            onChange={(e) => setTitle(e.target.value)}
                                            required
                                            className="w-full px-4 py-3 pl-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-gray-50"
                                            placeholder="Digite o título da categoria"
                                        />
                                        <BookOpen className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-gray-700">Descrição</label>
                                    <div className="relative">
                                        <textarea
                                            value={description}
                                            onChange={(e) => setDescription(e.target.value)}
                                            rows="4"
                                            className="w-full px-4 py-3 pl-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-gray-50 resize-none"
                                            placeholder="Digite uma descrição para a categoria"
                                        />
                                        <Sparkles className="absolute left-3 top-4 text-gray-400" size={20} />
                                    </div>
                                </div>

                                <div className="flex justify-end">
                                    <Button 
                                        type="submit"
                                        className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-8 py-3 rounded-lg transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-105"
                                    >
                                        Criar Categoria
                                    </Button>
                                </div>
                            </form>
                        </div>

                        <div className="hidden lg:block">
                            <div className="bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl p-8 h-full flex flex-col justify-center text-white">
                                <div className="space-y-6">
                                    <h2 className="text-2xl font-bold">Dicas para uma boa categoria</h2>
                                    <ul className="space-y-4">
                                        <li className="flex items-start gap-3">
                                            <div className="p-2 bg-white/20 rounded-full">
                                                <Sparkles size={20} />
                                            </div>
                                            <span>Use um título claro e objetivo</span>
                                        </li>
                                        <li className="flex items-start gap-3">
                                            <div className="p-2 bg-white/20 rounded-full">
                                                <Sparkles size={20} />
                                            </div>
                                            <span>Descreva bem o propósito da categoria</span>
                                        </li>
                                        <li className="flex items-start gap-3">
                                            <div className="p-2 bg-white/20 rounded-full">
                                                <Sparkles size={20} />
                                            </div>
                                            <span>Seja específico na descrição</span>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </MainLayout>
    );
}

export default CreateCategoryPage;
