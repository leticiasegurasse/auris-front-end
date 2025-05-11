import { useForm } from "../../hooks/useForm";
import { Mail, Lock, ArrowRight } from "lucide-react";
import Button from "../../components/ButtonComponent/ButtonComponent";
import AuthTabs from "../../components/ButtonComponent/AuthTabs";
import { useCustomNavigate } from "../../hooks/useCustomNavigate";
import { loginRequest } from "../../api/auth";
import { useAuth } from "../../hooks/useAuth"; 
import SubLayout from "../../layouts/SubLayout";



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
    <SubLayout>
        <div className="w-full max-w-md bg-white/10 backdrop-blur-lg rounded-3xl shadow-2xl p-8 space-y-8 transform transition-all duration-500 hover:scale-[1.02] relative z-10 border border-white/20">
          <div className="text-center space-y-2">
            <h1 className="text-4xl font-bold text-white">Bem-vindo de volta</h1>
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
            >
              Entrar
            </Button>
          </form>
        </div>
    </SubLayout>
  );
}

export default LoginPage;
