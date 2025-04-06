import { useForm } from "../../hooks/useForm";
import SubLayout from "../../layouts/Sublayout";
import { Mail, Lock } from "lucide-react";
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
        login(res.data);
        goTo("dashboard");
      } catch (err) {
        alert("Falha no login:", err);
      }
    }
  }

  return (
    <SubLayout>
      <div className="w-full flex justify-center">
        <div className="w-full max-w-sm space-y-6">
          <AuthTabs />
          <form onSubmit={handleSubmit} className="space-y-6">

            <div>
              <label className="block text-gray-500 mb-1">Email:</label>
              <div className="relative flex items-center">
                <div className="absolute left-2 top-1/2 -translate-y-1/2 bg-gray-500 rounded-full w-10 h-10 flex items-center justify-center">
                  <Mail className="text-white w-5 h-5" />
                </div>
                <input
                  type="email"
                  name="email"
                  value={values.email}
                  onChange={handleChange}
                  placeholder="Digite seu e-mail..."
                  className={`w-full pl-14 pr-4 py-4 rounded-full bg-transparent border text-gray-500 text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-400 ${errors.email ? "border-red-500" : "border-gray-500"}`}
                />
              </div>
              {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
            </div>

            <div>
              <label className="block text-gray-500 mb-1">Senha:</label>
              <div className="relative flex items-center">
                <div className="absolute left-2 top-1/2 -translate-y-1/2 bg-gray-500 rounded-full w-10 h-10 flex items-center justify-center">
                  <Lock className="text-white w-5 h-5" />
                </div>
                <input
                  type="password"
                  name="password"
                  value={values.password}
                  onChange={handleChange}
                  placeholder="Digite sua senha..."
                  className={`w-full pl-14 pr-4 py-4 rounded-full bg-transparent border text-gray-500 text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-400 ${errors.password ? "border-red-500" : "border-gray-500"}`}
                />
              </div>
              {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
            </div>

            <p className="text-end cursor-pointer text-sm text-[var(--orange)]" onClick={() => goTo("forgotpassword")}>
              Esqueceu sua senha?
            </p>

            <Button type="submit" size="full" variant="secondary" className="!rounded-full">
              Entrar
            </Button>
          </form>
        </div>
      </div>
    </SubLayout>
  );
}

export default LoginPage;
