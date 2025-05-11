// src/pages/NewPatientsPage.jsx
import { useState } from "react";
import { useForm } from "../../hooks/useForm";
import MainLayout from "../../layouts/MainLayout";
import Button from "../../components/ButtonComponent/ButtonComponent";
import { useCustomNavigate } from "../../hooks/useCustomNavigate";
import { useAuth } from "../../hooks/useAuth";
import { registerPatientRequest } from "../../api/patients/patient";
import AlertMessage from "../../components/AlertComponent/AlertMessage";
import { User, Mail, Calendar, Stethoscope, ArrowLeft, Lock } from "lucide-react";
import PageHeader from "../../components/PageHeader/PageHeader";

function NewPatientsPage() {
  const [alert, setAlert] = useState(null);
  const { goTo } = useCustomNavigate();

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
  const { goToWithDelay } = useCustomNavigate();

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
        setAlert({ type: "success", message: "Paciente cadastrado com sucesso!" });
        goToWithDelay("PTIENTS", 1500);
      } catch (err) {
        setAlert({ type: "error", message: "Erro ao cadastrar paciente" });
        console.error(err);
      }
    } else {
      setAlert({ type: "warning", message: "Preencha todos os campos corretamente." });
    }
  }

  return (
    <MainLayout>
      <div>
        <div className=" mx-auto">
        <PageHeader 
          title="Adicionar Novo Paciente"
        />

          {alert && (
            <AlertMessage
              type={alert.type}
              message={alert.message}
              className="mb-6"
              onClose={() => setAlert(null)}
            />
          )}

          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="p-6 sm:p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                      <User size={16} className="text-gray-400" />
                      Nome do paciente
                      <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        name="name_user"
                        value={values.name_user}
                        onChange={handleChange}
                        placeholder="Digite o nome completo"
                        className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-all duration-200 ${
                          errors.name_user
                            ? "border-red-300 focus:ring-red-500"
                            : "border-gray-300 focus:ring-blue-500"
                        }`}
                      />
                      <User size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    </div>
                    {errors.name_user && (
                      <p className="text-red-500 text-sm">{errors.name_user}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                      <Mail size={16} className="text-gray-400" />
                      Email
                      <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type="email"
                        name="email"
                        value={values.email}
                        onChange={handleChange}
                        placeholder="exemplo@email.com"
                        className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-all duration-200 ${
                          errors.email
                            ? "border-red-300 focus:ring-red-500"
                            : "border-gray-300 focus:ring-blue-500"
                        }`}
                      />
                      <Mail size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    </div>
                    {errors.email && (
                      <p className="text-red-500 text-sm">{errors.email}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                      <Lock size={16} className="text-gray-400" />
                      Senha
                      <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type="password"
                        name="password"
                        value={values.password}
                        onChange={handleChange}
                        placeholder="Mínimo 6 caracteres"
                        className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-all duration-200 ${
                          errors.password
                            ? "border-red-300 focus:ring-red-500"
                            : "border-gray-300 focus:ring-blue-500"
                        }`}
                      />
                      <Lock size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    </div>
                    {errors.password && (
                      <p className="text-red-500 text-sm">{errors.password}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                      <Calendar size={16} className="text-gray-400" />
                      Data de nascimento
                      <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type="date"
                        name="birthDate"
                        value={values.birthDate}
                        onChange={handleChange}
                        className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-all duration-200 ${
                          errors.birthDate
                            ? "border-red-300 focus:ring-red-500"
                            : "border-gray-300 focus:ring-blue-500"
                        }`}
                      />
                      <Calendar size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    </div>
                    {errors.birthDate && (
                      <p className="text-red-500 text-sm">{errors.birthDate}</p>
                    )}
                  </div>

                  <div className="md:col-span-2 space-y-2">
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                      <Stethoscope size={16} className="text-gray-400" />
                      Diagnóstico
                      <span className="text-gray-400 text-xs">(opcional)</span>
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        name="diagnosis"
                        value={values.diagnosis}
                        onChange={handleChange}
                        placeholder="Descreva o diagnóstico do paciente"
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                      />
                      <Stethoscope size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    </div>
                  </div>
                </div>

                <div className="flex justify-end pt-4">
                  <Button
                    type="submit"
                    className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-8 py-3 rounded-lg transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-105"
                  >
                    Cadastrar Paciente
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}

export default NewPatientsPage;
