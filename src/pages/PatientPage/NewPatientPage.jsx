// src/pages/NewPatientsPage.jsx
import { useForm } from "../../hooks/useForm";
import MainLayout from "../../layouts/MainLayout";
import Button from "../../components/ButtonComponent/ButtonComponent";
import { useCustomNavigate } from "../../hooks/useCustomNavigate";
import { useAuth } from "../../hooks/useAuth";
import { registerPatientRequest } from "../../api/patients/patient";
import { ArrowBigLeftDash } from "lucide-react";

function NewPatientsPage() {
  const { values, errors, handleChange, validateForm } = useForm(
    {
      name_user: "",
      email: "",
      password: "",
      birthDate: "",
      diagnosis: "",
    },
    {
      name_user: (v) => (v.trim() === "" ? "Campo obrigatório" : ""),
      email: (v) => (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) ? "Email inválido" : ""),
      password: (v) => (v.trim().length < 6 ? "Mínimo 6 caracteres" : ""),
      birthDate: (v) => (v.trim() === "" ? "Campo obrigatório" : ""),
    }
  );

  const { user } = useAuth();
  const { goTo, goBack } = useCustomNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    if (validateForm()) {
      try {
        const payload = {
          ...values,
          role: "patient",
          therapistId: user.id,
        };
        await registerPatientRequest(payload);
        alert("Paciente cadastrado com sucesso!");
        goTo("pacientes");
      } catch (err) {
        alert("Erro ao cadastrar paciente");
        console.error(err);
      }
    } else {
      alert("Preencha todos os campos corretamente.");
    }
  }

  return (
    <MainLayout>
      <div className="w-full">
        <Button 
          variant="transparent" 
          icon={ArrowBigLeftDash}
          onClick={goBack}
        >
          Voltar
        </Button>
      </div>
      <div className="w-full max-w-xl mx-auto px-4 py-10">
        <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-2xl shadow-xl">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nome do paciente: <span className="text-red-500 text-sm mt-1">*</span></label>
            <input
              type="text"
              name="name_user"
              value={values.name_user}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.name_user && <p className="text-red-500 text-sm mt-1">{errors.name_user}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email: <span className="text-red-500 text-sm mt-1">*</span></label>
            <input
              type="email"
              name="email"
              value={values.email}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Senha: <span className="text-red-500 text-sm mt-1">*</span></label>
            <input
              type="password"
              name="password"
              value={values.password}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Data de nascimento: <span className="text-red-500 text-sm mt-1">*</span></label>
            <input
              type="date"
              name="birthDate"
              value={values.birthDate}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.birthDate && <p className="text-red-500 text-sm mt-1">{errors.birthDate}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Diagnóstico <span className="text-gray-400 text-xs">(opcional)</span></label>
            <input
              type="text"
              name="diagnosis"
              value={values.diagnosis}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <Button type="submit" size="full" variant="secondary">Cadastrar</Button>
        </form>
      </div>
    </MainLayout>
  );
}

export default NewPatientsPage;
