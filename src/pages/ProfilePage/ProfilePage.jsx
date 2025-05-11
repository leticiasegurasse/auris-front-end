import { useState } from "react";
import { useForm } from "../../hooks/useForm";
import MainLayout from "../../layouts/MainLayout";
import Button from "../../components/ButtonComponent/ButtonComponent";
import { useCustomNavigate } from "../../hooks/useCustomNavigate";
import { useAuth } from "../../hooks/useAuth";
import AlertMessage from "../../components/AlertComponent/AlertMessage";
import { User, Mail, Clipboard, ArrowLeft } from "lucide-react";
import { updateUserById } from "../../api/users/user";
import { updateTherapistById } from "../../api/therapist/therapist";

function ProfilePage() {
  const [alert, setAlert] = useState(null);
  const { goTo } = useCustomNavigate();
  const { user, login } = useAuth();

  const { values, errors, handleChange, validateForm } = useForm(
    {
      name_user: user?.name_user || "",
      email: user?.email || "",
      crfa: user?.crfa || "",
    },
    {
      name_user: (v) => (v.trim() === "" ? "Campo obrigatório" : ""),
      email: (v) => (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) ? "Email inválido" : ""),
      crfa: (v) => (v.trim() === "" ? "Campo obrigatório" : ""),
    }
  );

  async function handleSubmit(e) {
    e.preventDefault();
    if (validateForm()) {
      try {
        // Atualiza os dados do usuário (nome e email)
        const updatedUser = await updateUserById(user.id, {
          name_user: values.name_user,
          email: values.email,
        });

        // Atualiza o CRFa do terapeuta
        await updateTherapistById(user.id, {
          crfa: values.crfa,
        });

        // Atualiza o contexto de autenticação com os novos dados
        login({
          ...user,
          name_user: updatedUser.name_user,
          email: updatedUser.email,
          crfa: values.crfa,
        });

        setAlert({ type: "success", message: "Perfil atualizado com sucesso!" });
      } catch (err) {
        setAlert({ type: "error", message: "Erro ao atualizar perfil" });
        console.error(err);
      }
    } else {
      setAlert({ type: "warning", message: "Preencha todos os campos corretamente." });
    }
  }

  return (
    <MainLayout>
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => goTo("HOME")}
            className="p-2 rounded-lg hover:bg-gray-100 transition"
          >
            <ArrowLeft className="w-6 h-6 text-gray-600" />
          </button>
          <h1 className="text-3xl font-bold text-gray-800">Meu Perfil</h1>
        </div>

        {alert && <AlertMessage type={alert.type} message={alert.message} />}

        <div className="bg-white rounded-xl shadow-lg p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div className="relative group">
                <div className="flex items-center gap-2">
                  <div className="flex-shrink-0 w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center text-gray-600 group-focus-within:text-gray-800 transition-colors">
                    <User className="w-5 h-5" />
                  </div>
                  <input
                    type="text"
                    name="name_user"
                    value={values.name_user}
                    onChange={handleChange}
                    placeholder="Nome completo"
                    className={`w-full py-3 px-4 rounded-xl bg-gray-50 border-2 text-gray-800 text-sm placeholder-gray-400 focus:outline-none focus:border-gray-300 focus:ring-2 focus:ring-gray-200 transition-all duration-200 ${errors.name_user ? "border-red-500" : "border-gray-200"}`}
                  />
                </div>
                {errors.name_user && <p className="text-red-500 text-sm mt-1 ml-12">{errors.name_user}</p>}
              </div>

              <div className="relative group">
                <div className="flex items-center gap-2">
                  <div className="flex-shrink-0 w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center text-gray-600 group-focus-within:text-gray-800 transition-colors">
                    <Mail className="w-5 h-5" />
                  </div>
                  <input
                    type="email"
                    name="email"
                    value={values.email}
                    onChange={handleChange}
                    placeholder="E-mail"
                    className={`w-full py-3 px-4 rounded-xl bg-gray-50 border-2 text-gray-800 text-sm placeholder-gray-400 focus:outline-none focus:border-gray-300 focus:ring-2 focus:ring-gray-200 transition-all duration-200 ${errors.email ? "border-red-500" : "border-gray-200"}`}
                  />
                </div>
                {errors.email && <p className="text-red-500 text-sm mt-1 ml-12">{errors.email}</p>}
              </div>

              <div className="relative group">
                <div className="flex items-center gap-2">
                  <div className="flex-shrink-0 w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center text-gray-600 group-focus-within:text-gray-800 transition-colors">
                    <Clipboard className="w-5 h-5" />
                  </div>
                  <input
                    type="text"
                    name="crfa"
                    value={values.crfa}
                    onChange={handleChange}
                    placeholder="CRFa"
                    className={`w-full py-3 px-4 rounded-xl bg-gray-50 border-2 text-gray-800 text-sm placeholder-gray-400 focus:outline-none focus:border-gray-300 focus:ring-2 focus:ring-gray-200 transition-all duration-200 ${errors.crfa ? "border-red-500" : "border-gray-200"}`}
                  />
                </div>
                {errors.crfa && <p className="text-red-500 text-sm mt-1 ml-12">{errors.crfa}</p>}
              </div>
            </div>

            <div className="flex justify-end">
              <Button type="submit" size="full">
                Salvar Alterações
              </Button>
            </div>
          </form>
        </div>
      </div>
    </MainLayout>
  );
}

export default ProfilePage; 