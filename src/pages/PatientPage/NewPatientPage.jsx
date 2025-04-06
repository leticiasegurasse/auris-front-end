// src/pages/NewPatientsPage.jsx
import { useForm } from "../../hooks/useForm";
import MainLayout from "../../layouts/MainLayout";
import Button from "../../components/ButtonComponent/ButtonComponent";
import { useCustomNavigate } from "../../hooks/useCustomNavigate";
import { useAuth } from "../../hooks/useAuth";
import { registerPatientRequest } from "../../api/patients/patient";

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
      password: (v) => (v.trim().length < 5 ? "Mínimo 6 caracteres" : ""),
      birthDate: (v) => (v.trim() === "" ? "Campo obrigatório" : ""),
    }
  );

  const { user } = useAuth();
  const { goTo } = useCustomNavigate();

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
      <div className="w-full max-w-xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Cadastrar Novo Paciente</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-1">Nome do paciente</label>
            <input type="text" name="name_user" value={values.name_user} onChange={handleChange} className="input" />
            {errors.name_user && <p className="text-red-500 text-sm">{errors.name_user}</p>}
          </div>

          <div>
            <label className="block mb-1">Email</label>
            <input type="email" name="email" value={values.email} onChange={handleChange} className="input" />
            {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
          </div>

          <div>
            <label className="block mb-1">Senha</label>
            <input type="password" name="password" value={values.password} onChange={handleChange} className="input" />
            {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}
          </div>

          <div>
            <label className="block mb-1">Data de nascimento</label>
            <input type="date" name="birthDate" value={values.birthDate} onChange={handleChange} className="input" />
            {errors.birthDate && <p className="text-red-500 text-sm">{errors.birthDate}</p>}
          </div>

          <div>
            <label className="block mb-1">Diagnóstico</label>
            <input type="text" name="diagnosis" value={values.diagnosis} onChange={handleChange} className="input" />
            {errors.diagnosis && <p className="text-red-500 text-sm">{errors.diagnosis}</p>}
          </div>

          <Button type="submit" size="full" variant="secondary">Cadastrar</Button>
        </form>
      </div>
    </MainLayout>
  );
}

export default NewPatientsPage;



