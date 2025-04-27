import { useState } from "react";
import MainLayout from "../../layouts/MainLayout";
import { createCategory } from "../../api/categories/categories";
import { useCustomNavigate } from "../../hooks/useCustomNavigate";
import AlertMessage from "../../components/AlertComponent/AlertMessage";
import BackButton from "../../components/ButtonComponent/BackButton";
import Button from "../../components/ButtonComponent/ButtonComponent";

function CreateCategoryPage() {
    const { goToWithDelay } = useCustomNavigate();
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [alert, setAlert] = useState(null);


    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await createCategory({ title, description });
            setAlert({ type: "success", message: "Ctegoria cadastrada com sucesso!" });
            goToWithDelay("CATEGORIES", 1500)
        } catch (error) {
            setAlert({ type: "error", message: "Erro ao cadastrar categoria:", error });
        }
    };

    return (
        <MainLayout>
            {alert && (
                <AlertMessage type={alert.type} message={alert.message} className="mb-4" onClose={() => setAlert(null)} />
            )}

            <BackButton/>
            <div className="max-w-2xl mx-auto mt-10 p-6 bg-white rounded shadow-md">
                <h1 className="text-3xl font-bold mb-6">Criar Nova Categoria</h1>
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <div>
                    <label className="block text-gray-700 mb-2">Título</label>
                    <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                    className="w-full p-2 border rounded"
                    />
                </div>

                <div>
                    <label className="block text-gray-700 mb-2">Descrição</label>
                    <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows="4"
                    className="w-full p-2 border rounded"
                    />
                </div>

                <Button type="submit">Salvar Categoria</Button>
                </form>
            </div>
        </MainLayout>
    );
}

export default CreateCategoryPage;
