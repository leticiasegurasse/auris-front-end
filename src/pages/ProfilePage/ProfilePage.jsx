import { useState, useEffect } from "react";
import { useForm } from "../../hooks/useForm";
import MainLayout from "../../layouts/MainLayout";
import Button from "../../components/ButtonComponent/ButtonComponent";
import { useCustomNavigate } from "../../hooks/useCustomNavigate";
import { useAuth } from "../../hooks/useAuth";
import AlertMessage from "../../components/AlertComponent/AlertMessage";
import { User, Mail, Clipboard, ArrowLeft, Lock } from "lucide-react";
import { updateUserById, getUserById } from "../../api/users/user";
import { updateTherapistById, getTherapistById } from "../../api/therapist/therapist";

function ProfilePage() {
  const [alert, setAlert] = useState(null);
  const [loading, setLoading] = useState(true);
  const { goTo } = useCustomNavigate();
  const { user, login } = useAuth();

  const { values, errors, handleChange, validateForm, setValues } = useForm(
    {
      name_user: "",
      email: "",
      crfa: "",
      password: "",
    },
    {
      name_user: (v) => (v.trim() === "" ? "Campo obrigatório" : ""),
      email: (v) => (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) ? "Email inválido" : ""),
      crfa: (v) => (v.trim() === "" ? "Campo obrigatório" : ""),
      password: (v) => (v && v.length < 6 ? "A senha deve ter pelo menos 6 caracteres" : ""),
    }
  );

  useEffect(() => {
    async function loadUserData() {
      try {
        setLoading(true);
        // Busca dados do usuário
        const userData = await getUserById(user.id);
        // Busca dados do terapeuta
        const therapistData = await getTherapistById(user.specificId);

        // Atualiza o formulário com os dados
        setValues({
          name_user: userData.name_user,
          email: userData.email,
          crfa: therapistData.crfa,
          password: "", // Não carregamos a senha por questões de segurança
        });
      } catch (err) {
        setAlert({ type: "error", message: "Erro ao carregar dados do perfil" });
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    if (user?.id) {
      loadUserData();
    }
  }, [user?.id, setValues]);

  async function handleSubmit(e) {
    e.preventDefault();
    if (validateForm()) {
      try {
        // Prepara os dados do usuário
        const userData = {
          name_user: values.name_user,
        };

        // Adiciona a senha apenas se ela foi alterada
        if (values.password && values.password.trim() !== "") {
          userData.password = values.password;
        }

        // Atualiza os dados do usuário
        const updatedUser = await updateUserById(user.id, userData);

        // Atualiza o contexto de autenticação com os novos dados
        login({
          ...user,
          name_user: updatedUser.name_user,
        });

        setAlert({ type: "success", message: "Perfil atualizado com sucesso!" });
        
        // Limpa o campo de senha após a atualização
        setValues(prev => ({ ...prev, password: "" }));
      } catch (err) {
        setAlert({ type: "error", message: "Erro ao atualizar perfil" });
        console.error(err);
      }
    } else {
      setAlert({ type: "warning", message: "Preencha todos os campos corretamente." });
    }
  }

  if (loading) {
    return (
      <MainLayout>
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center justify-center h-64">
            <p className="text-gray-600">Carregando dados do perfil...</p>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto">
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
                    disabled
                    className="w-full py-3 px-4 rounded-xl bg-gray-100 border-2 text-gray-600 text-sm placeholder-gray-400 cursor-not-allowed border-gray-200"
                  />
                </div>
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
                    disabled
                    className="w-full py-3 px-4 rounded-xl bg-gray-100 border-2 text-gray-600 text-sm placeholder-gray-400 cursor-not-allowed border-gray-200"
                  />
                </div>
              </div>

              <div className="relative group">
                <div className="flex items-center gap-2">
                  <div className="flex-shrink-0 w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center text-gray-600 group-focus-within:text-gray-800 transition-colors">
                    <Lock className="w-5 h-5" />
                  </div>
                  <input
                    type="password"
                    name="password"
                    value={values.password}
                    onChange={handleChange}
                    placeholder="Nova senha (deixe em branco para manter a atual)"
                    className={`w-full py-3 px-4 rounded-xl bg-gray-50 border-2 text-gray-800 text-sm placeholder-gray-400 focus:outline-none focus:border-gray-300 focus:ring-2 focus:ring-gray-200 transition-all duration-200 ${errors.password ? "border-red-500" : "border-gray-200"}`}
                  />
                </div>
                {errors.password && <p className="text-red-500 text-sm mt-1 ml-12">{errors.password}</p>}
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