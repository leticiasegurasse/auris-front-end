import { useForm } from "../../hooks/useForm";
import SubLayout from "../../layouts/Sublayout";
import { Mail, Lock } from "lucide-react";
import Button from "../../components/ButtonComponent/ButtonComponent";
import AuthTabs from "../../components/ButtonComponent/AuthTabs";
import { registerRequest, loginRequest } from "../../api/auth";
import { useAuth } from "../../hooks/useAuth";
import { useCustomNavigate } from "../../hooks/useCustomNavigate";

function RegisterPage() {
  const { values, errors, handleChange, validateForm } = useForm(
    { name_user: "", email: "", password: "", confirmPassword: "", crfa: "" },
    {
      name_user: (value) => value,
      email: (value) =>
        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) ? "Email inválido" : "",

    }
  );

  const { login } = useAuth();
  const { goTo } = useCustomNavigate();

  async function handleSubmit(e) {
    e.preventDefault();

    if (validateForm()) {
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
        goTo("home");
      } catch (error) {
        console.error("Erro no cadastro ou login:", error.response?.data || error.message);
        alert("Erro ao cadastrar ou logar usuário: " + (error.response?.data?.message || "verifique os dados."));
      }
    }
  }

  return (
    <SubLayout>
      <div className="w-full flex justify-evenly">
        {/* <div>
          <h1>Bem vindo!</h1>
        </div> */}
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-sm space-y-6"
        >
          <AuthTabs />

          <div>
            <label className="block text-[var(--secondary-color)] mb-1">Nome completo:</label>
            <input
              type="text"
              name="name_user"
              value={values.name_user}
              onChange={handleChange}
              placeholder="Digite seu nome..."
              className="w-full py-4 px-4 rounded-full border border-[var(--secondary-color)] bg-transparent text-[var(--secondary-color)] placeholder-[var(--secondary-color)]"
            />
          </div>

          <div>
            <label className="block text-[var(--secondary-color)] mb-1">CRFa:</label>
            <input
              type="text"
              name="crfa"
              value={values.crfa}
              onChange={handleChange}
              placeholder="Digite seu CRFa..."
              className="w-full py-4 px-4 rounded-full border border-[var(--secondary-color)] bg-transparent text-[var(--secondary-color)] placeholder-[var(--secondary-color)]"
            />
          </div>

          <div>
            <label className="block text-[var(--secondary-color)] mb-1">Email:</label>
            <div className="relative flex items-center">
              <div className="absolute left-2 top-1/2 -translate-y-1/2 bg-[var(--secondary-color)] rounded-full w-10 h-10 flex items-center justify-center">
                <Mail className="text-white w-5 h-5" />
              </div>
              <input
                type="email"
                name="email"
                value={values.email}
                onChange={handleChange}
                placeholder="Digite seu e-mail..."
                className={`w-full pl-14 pr-4 py-4 rounded-full bg-transparent border border-[var(--secondary-color)] text-[var(--secondary-color)] text-sm placeholder-[var(--secondary-color)] focus:outline-none focus:ring-2 focus:ring-blue-400 ${errors.email ? "border border-red-500" : "border border-[var(--secondary-color)]"}`}
              />
            </div>
            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
          </div>

          <div>
            <label className="block text-[var(--secondary-color)] mb-1">Senha:</label>
            <div className="relative flex items-center">
              <div className="absolute left-2 top-1/2 -translate-y-1/2 bg-[var(--secondary-color)] rounded-full w-10 h-10 flex items-center justify-center">
                <Lock className="text-white w-5 h-5" />
              </div>
              <input
                type="password"
                name="password"
                value={values.password}
                onChange={handleChange}
                placeholder="Digite sua senha..."
                className={`w-full pl-14 pr-4 py-4 rounded-full bg-transparent border border-[var(--secondary-color)] text-[var(--secondary-color)] text-sm placeholder-[var(--secondary-color)] focus:outline-none focus:ring-2 focus:ring-blue-400 ${errors.password ? "border border-red-500" : "border border-[var(--secondary-color)]"}`}
              />
            </div>
            {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
          </div>

          <div>
            <label className="block text-[var(--secondary-color)] mb-1">Confirme a Senha:</label>
            <div className="relative flex items-center">
              <div className="absolute left-2 top-1/2 -translate-y-1/2 bg-[var(--secondary-color)] rounded-full w-10 h-10 flex items-center justify-center">
                <Lock className="text-white w-5 h-5" />
              </div>
              <input
                type="password"
                name="confirmPassword"
                value={values.confirmPassword}
                onChange={handleChange}
                placeholder="Confirme sua senha..."
                className={`w-full pl-14 pr-4 py-4 rounded-full bg-transparent border border-[var(--secondary-color)] text-[var(--secondary-color)] text-sm placeholder-[var(--secondary-color)] focus:outline-none focus:ring-2 focus:ring-blue-400 ${errors.confirmPassword ? "border border-red-500" : "border border-[var(--secondary-color)]"}`}
              />
            </div>
            {errors.confirmPassword && <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>}
          </div>

          <Button
            type="submit"
            size="full"
            variant="secondary"
            className="!rounded-full"
          >
            Cadastrar
          </Button>
        </form>
      </div>
    </SubLayout>
  );
}

export default RegisterPage;
