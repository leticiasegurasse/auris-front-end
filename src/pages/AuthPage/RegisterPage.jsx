import { useForm } from "../../hooks/useForm";
import { Mail, Lock, User, Clipboard } from "lucide-react";
import Button from "../../components/ButtonComponent/ButtonComponent";
import AuthTabs from "../../components/ButtonComponent/AuthTabs";
import { registerRequest, loginRequest } from "../../api/auth";
import { useAuth } from "../../hooks/useAuth";
import { useCustomNavigate } from "../../hooks/useCustomNavigate";
import SubLayout from "../../layouts/SubLayout";

function RegisterPage() {
  const { values, errors, handleChange, validateForm } = useForm(
    {
      name_user: "",
      email: "",
      password: "",
      confirmPassword: "",
      crfa: "",
    },
    {
      name_user: (value) =>
        !value ? "Nome é obrigatório" : "",
      email: (value) =>
        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) ? "Email inválido" : "",
      password: (value) =>
        value.length < 6 ? "Senha deve ter pelo menos 6 caracteres" : "",
      confirmPassword: (value) =>
        value.length < 6 ? "Confirmação de senha inválida" : "",
      crfa: (value) =>
        !value ? "CRFa é obrigatório" : "",
    }
  );
  

  const { login } = useAuth();
  const { goTo } = useCustomNavigate();

  async function handleSubmit(e) {
    console.log("entrou aqui")
    e.preventDefault();
    
    if (validateForm()) {
      console.log("form valido")
      
      if (values.password !== values.confirmPassword) {
        alert("As senhas não coincidem.");
        return;
      }

      const payload = {
        name_user: values.name_user,
        email: values.email,
        password: values.password,
        crfa: values.crfa,
        role: "therapist",
      };
      try {
        await registerRequest(payload);

        // login automático após cadastro
        const response = await loginRequest(values.email, values.password);
        login(response.data);
        goTo("HOME");
      } catch (error) {
        console.error("Erro no cadastro ou login:", error.response?.data || error.message);
        alert("Erro ao cadastrar ou logar usuário: " + (error.response?.data?.message || "verifique os dados."));
      }
    } else {
      alert("formulario invalido")
    }
  }

  return (
    <SubLayout>
      <div className="w-full max-w-xl bg-white/10 backdrop-blur-lg rounded-3xl shadow-2xl p-8 space-y-8 transform transition-all duration-500 hover:scale-[1.02] relative z-10 border border-white/20">
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold text-white">Crie sua conta</h1>
          <p className="text-white/80">Preencha os dados abaixo para se cadastrar.</p>
        </div>

        <AuthTabs />

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative group">
              <div className="flex items-center gap-2">
                <div className="flex-shrink-0 w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center text-white/60 group-focus-within:text-white transition-colors">
                  <User className="w-5 h-5" />
                </div>
                <input
                  type="text"
                  name="name_user"
                  value={values.name_user}
                  onChange={handleChange}
                  placeholder="Nome completo"
                  className={`w-full py-3 px-4 rounded-xl bg-white/10 border-2 text-white text-sm placeholder-white/60 focus:outline-none focus:border-white/50 focus:ring-2 focus:ring-white/20 transition-all duration-200 backdrop-blur-sm ${errors.name_user ? "border-red-500" : "border-white/20"}`}
                />
              </div>
              {errors.name_user && <p className="text-red-300 text-sm mt-1 ml-12">{errors.name_user}</p>}
            </div>

            <div className="relative group">
              <div className="flex items-center gap-2">
                <div className="flex-shrink-0 w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center text-white/60 group-focus-within:text-white transition-colors">
                  <Clipboard className="w-5 h-5" />
                </div>
                <input
                  type="text"
                  name="crfa"
                  value={values.crfa}
                  onChange={handleChange}
                  placeholder="CRFa"
                  className={`w-full py-3 px-4 rounded-xl bg-white/10 border-2 text-white text-sm placeholder-white/60 focus:outline-none focus:border-white/50 focus:ring-2 focus:ring-white/20 transition-all duration-200 backdrop-blur-sm ${errors.crfa ? "border-red-500" : "border-white/20"}`}
                />
              </div>
              {errors.crfa && <p className="text-red-300 text-sm mt-1 ml-12">{errors.crfa}</p>}
            </div>

            <div className="relative group md:col-span-2">
              <div className="flex items-center gap-2">
                <div className="flex-shrink-0 w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center text-white/60 group-focus-within:text-white transition-colors">
                  <Mail className="w-5 h-5" />
                </div>
                <input
                  type="email"
                  name="email"
                  value={values.email}
                  onChange={handleChange}
                  placeholder="E-mail"
                  className={`w-full py-3 px-4 rounded-xl bg-white/10 border-2 text-white text-sm placeholder-white/60 focus:outline-none focus:border-white/50 focus:ring-2 focus:ring-white/20 transition-all duration-200 backdrop-blur-sm ${errors.email ? "border-red-500" : "border-white/20"}`}
                />
              </div>
              {errors.email && <p className="text-red-300 text-sm mt-1 ml-12">{errors.email}</p>}
            </div>

            <div className="relative group">
              <div className="flex items-center gap-2">
                <div className="flex-shrink-0 w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center text-white/60 group-focus-within:text-white transition-colors">
                  <Lock className="w-5 h-5" />
                </div>
                <input
                  type="password"
                  name="password"
                  value={values.password}
                  onChange={handleChange}
                  placeholder="Senha"
                  className={`w-full py-3 px-4 rounded-xl bg-white/10 border-2 text-white text-sm placeholder-white/60 focus:outline-none focus:border-white/50 focus:ring-2 focus:ring-white/20 transition-all duration-200 backdrop-blur-sm ${errors.password ? "border-red-500" : "border-white/20"}`}
                />
              </div>
              {errors.password && <p className="text-red-300 text-sm mt-1 ml-12">{errors.password}</p>}
            </div>

            <div className="relative group">
              <div className="flex items-center gap-2">
                <div className="flex-shrink-0 w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center text-white/60 group-focus-within:text-white transition-colors">
                  <Lock className="w-5 h-5" />
                </div>
                <input
                  type="password"
                  name="confirmPassword"
                  value={values.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirme sua senha"
                  className={`w-full py-3 px-4 rounded-xl bg-white/10 border-2 text-white text-sm placeholder-white/60 focus:outline-none focus:border-white/50 focus:ring-2 focus:ring-white/20 transition-all duration-200 backdrop-blur-sm ${errors.confirmPassword ? "border-red-500" : "border-white/20"}`}
                />
              </div>
              {errors.confirmPassword && <p className="text-red-300 text-sm mt-1 ml-12">{errors.confirmPassword}</p>}
            </div>
          </div>

          <Button
            type="submit"
            size="full"
          >
            Cadastrar
          </Button>
        </form>
      </div>
    </SubLayout>
  );
}

export default RegisterPage;
