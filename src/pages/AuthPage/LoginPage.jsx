import { useForm } from "../../hooks/useForm";
import { Mail, Lock, ArrowRight } from "lucide-react";
import Button from "../../components/ButtonComponent/ButtonComponent";
import AuthTabs from "../../components/ButtonComponent/AuthTabs";
import { useCustomNavigate } from "../../hooks/useCustomNavigate";
import { loginRequest } from "../../api/auth";
import { useAuth } from "../../hooks/useAuth"; // ✅ CORRETO


function LoginPage() {
  const { goTo } = useCustomNavigate();
  const { login } = useAuth();

  const { values, errors, handleChange, validateForm } = useForm(
    { email: "", password: "" },
    {}
  );

  async function handleSubmit(e) {
    e.preventDefault();
  
    if (validateForm()) {
      try {
        const res = await loginRequest(values.email, values.password);
  
        if (res.data.user?.role !== "therapist") {
          alert("Apenas fonoaudiólogos podem acessar o sistema.");
          return;
        }
  
        login(res.data);
        goTo("HOME");
      } catch (err) {
        alert("Falha no login. Verifique suas credenciais.");
        console.error(err);
      }
    }
  }  

  return (
    <div>
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 p-4 relative overflow-hidden">
        {/* Elementos decorativos */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-to-br from-indigo-500/20 to-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-gradient-to-br from-pink-500/20 to-purple-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>

        <div className="w-full max-w-md bg-white/10 backdrop-blur-lg rounded-3xl shadow-2xl p-8 space-y-8 transform transition-all duration-500 hover:scale-[1.02] relative z-10 border border-white/20">
          {/* Logo ou ícone decorativo */}
          <div className="flex justify-center">
            <div className="w-20 h-20 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-2xl flex items-center justify-center shadow-lg transform rotate-6 hover:rotate-0 transition-transform duration-500">
              <svg className="w-10 h-10 text-white" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          </div>

          <div className="text-center space-y-2">
            <h1 className="text-4xl font-bold text-white">Bem-vindo de volta</h1>
            <p className="text-white/80">Entre com suas credenciais para acessar sua conta</p>
          </div>

          <AuthTabs />

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div className="relative group">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-white/60 group-focus-within:text-white transition-colors">
                  <Mail className="w-5 h-5" />
                </div>
                <input
                  type="email"
                  name="email"
                  value={values.email}
                  onChange={handleChange}
                  placeholder="Digite seu e-mail..."
                  className={`w-full pl-12 pr-4 py-3 rounded-xl bg-white/10 border-2 text-white text-sm placeholder-white/60 focus:outline-none focus:border-white/50 focus:ring-2 focus:ring-white/20 transition-all duration-200 backdrop-blur-sm ${errors.email ? "border-red-500" : "border-white/20"}`}
                />
                {errors.email && <p className="text-red-300 text-sm mt-1">{errors.email}</p>}
              </div>

              <div className="relative group">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-white/60 group-focus-within:text-white transition-colors">
                  <Lock className="w-5 h-5" />
                </div>
                <input
                  type="password"
                  name="password"
                  value={values.password}
                  onChange={handleChange}
                  placeholder="Digite sua senha..."
                  className={`w-full pl-12 pr-4 py-3 rounded-xl bg-white/10 border-2 text-white text-sm placeholder-white/60 focus:outline-none focus:border-white/50 focus:ring-2 focus:ring-white/20 transition-all duration-200 backdrop-blur-sm ${errors.password ? "border-red-500" : "border-white/20"}`}
                />
                {errors.password && <p className="text-red-300 text-sm mt-1">{errors.password}</p>}
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => goTo("forgotpassword")}
                className="text-sm text-white/80 hover:text-white transition-colors flex items-center gap-1 group"
              >
                Esqueceu sua senha?
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>

            <Button
              type="submit"
              size="full"
              variant="secondary"
              className="!rounded-xl !py-3 !text-base font-medium transform transition-all duration-200 hover:scale-[1.02] bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white border-none shadow-lg hover:shadow-indigo-500/25"
            >
              Entrar
            </Button>
          </form>

          {/* Elemento decorativo inferior */}
          <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-gradient-to-br from-pink-500/20 to-purple-500/20 rounded-full blur-xl"></div>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
