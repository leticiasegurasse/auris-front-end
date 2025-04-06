import { useForm } from "../../hooks/useForm";
import SubLayout from "../../layouts/Sublayout";
import { Mail, Lock } from "lucide-react";
import Button from "../../components/ButtonComponent/ButtonComponent";
import AuthTabs from "../../components/ButtonComponent/AuthTabs";

function RegisterPage() {
  const { values, errors, handleChange, validateForm } = useForm(
    { email: "", password: "" },
    {
      // email: (value) => (!value.includes("@") ? "Email inválido" : ""),
      // password: (value) => (value.length < 6 ? "Senha deve ter no mínimo 6 caracteres" : ""),
    }
  );

  function handleSubmit(e) {
    e.preventDefault();

    if (validateForm()) {
      console.log("Login enviado:", values);
      // aqui você pode chamar sua função de login
    }
  }

  return (
    <SubLayout>
      <div className="w-full flex justify-evenly">
        <div>
          <h1>Bem vindo!</h1>
        </div>
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-sm space-y-6"
        >
          <AuthTabs />

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
                className={`w-full pl-14 pr-4 py-4 rounded-full bg-transparent border border-[var(--secondary-color)] text-[var(--secondary-color)] text-sm placeholder-[var(--secondary-color)] focus:outline-none focus:ring-2 focus:ring-blue-400 ${
                  errors.email ? "border border-red-500" : "border border-[var(--secondary-color)]"
                }`}
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
                className={`w-full pl-14 pr-4 py-4 rounded-full bg-transparent border border-[var(--secondary-color)] text-[var(--secondary-color)] text-sm placeholder-[var(--secondary-color)] focus:outline-none focus:ring-2 focus:ring-blue-400 ${
                  errors.email ? "border border-red-500" : "border border-[var(--secondary-color)]"
                }`}
              />
            </div>

            {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
          </div>

          <Button
            type="submit"
            size="full"
            variant="cta"
            className="!rounded-full"
          >
            Entrar
          </Button>
        </form>
      </div>
    </SubLayout>
  );
}

export default RegisterPage;
