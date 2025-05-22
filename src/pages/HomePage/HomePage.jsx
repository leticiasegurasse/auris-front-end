import MainLayout from "../../layouts/MainLayout"
import Button from "../../components/ButtonComponent/ButtonComponent";
import { useAuth } from "../../hooks/useAuth";
import { useCustomNavigate } from "../../hooks/useCustomNavigate";
import { useEffect, useState } from "react";
import { getAllPatients } from "../../api/patients/patient";
import { getAppointments, getAppointmentsFuture } from "../../api/calendar/calendar";
import { getRecentLogs } from "../../api/logs/logs";
import { Users, Calendar, ClipboardList, Activity, Clock } from "lucide-react";
import ConsultationAlerts from "../../components/AlertsComponent/ConsultationAlerts";
import AlertMessage from "../../components/AlertComponent/AlertMessage";

function HomePage() {
  const { user } = useAuth();
  const { goTo } = useCustomNavigate();
  const [patientsCount, setPatientsCount] = useState(0);
  const [totalAppointments, setTotalAppointments] = useState(0);
  const [loading, setLoading] = useState(true);
  const [events, setEvents] = useState([]);
  const [alert, setAlert] = useState(null);
  const [recentLogs, setRecentLogs] = useState([]);

  useEffect(() => {
    async function loadData() {
      try {
        const [patientsResponse] = await Promise.all([
          getAllPatients()
        ]);

        loadAppointments();
        loadRecentLogs();
        
        setPatientsCount(patientsResponse.data.length);
        
      } catch (error) {
        console.error("Erro ao carregar dados:", error);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  const loadAppointments = async () => {
    try {
      const appointments = await getAppointmentsFuture();
      console.log("Appointments:", appointments);

      setTotalAppointments(appointments.length);

      console.log("Appointments raw:", appointments);
      const formattedEvents = appointments.map(appointment => {
        const startDate = new Date(appointment.consultationDateTime);
        const endDate = new Date(startDate.getTime() + 60 * 60 * 1000);

        const formatDateTime = (date) => {
          return date.toISOString();
        };
        
        return {
          id: appointment._id,
          title: `${appointment.patient?.userId.name_user || 'Paciente'}`,
          start: formatDateTime(startDate),
          end: formatDateTime(endDate),
          color: "#3B82F6",
          allDay: false,
          extendedProps: {
            patient: appointment.patient,
            observations: appointment.observations
          }
        };
      });
      console.log("Formatted Events:", formattedEvents);
      setEvents(formattedEvents);
    } catch (error) {
      console.error("Erro ao carregar consultas:", error);
      setAlert({ type: "error", message: "Erro ao carregar consultas: " + error });
    }
  };

  const loadRecentLogs = async () => {
    try {
      const logs = await getRecentLogs();
      setRecentLogs(logs.slice(0, 10)); // Pegar apenas os 5 logs mais recentes
    } catch (error) {
      console.error("Erro ao carregar logs:", error);
    }
  };

  return(
    <MainLayout>
      <div className="space-y-8">
        {/* Cabeçalho */}
        <div>
          <h1 className="font-bold text-2xl">Olá, {user?.name_user || "Usuário"}!</h1>
          <p className="text-md text-gray-600">Acompanhe, oriente e evolua com inteligência.</p>
        </div>

        {/* Cards de Resumo */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-xl shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500">Total de Pacientes</p>
                <h3 className="text-3xl font-bold">{patientsCount}</h3>
              </div>
              <div className="bg-blue-100 p-3 rounded-full">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500">Total de Consultas</p>
                <h3 className="text-3xl font-bold">{totalAppointments}</h3>
              </div>
              <div className="bg-green-100 p-3 rounded-full">
                <Calendar className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500">Exercícios Ativos</p>
                <h3 className="text-3xl font-bold">12</h3>
              </div>
              <div className="bg-purple-100 p-3 rounded-full">
                <Activity className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500">Documentos</p>
                <h3 className="text-3xl font-bold">5</h3>
              </div>
              <div className="bg-orange-100 p-3 rounded-full">
                <ClipboardList className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Ações Rápidas */}
        <div className="bg-white p-6 rounded-xl shadow-md">
          <h2 className="text-xl font-semibold mb-4">Ações Rápidas</h2>
          <div className="grid grid-cols-4 gap-4">
            <Button onClick={() => goTo("NEW_PATIENT")} variant="primary" size="full">
              Novo Paciente
            </Button>
            <Button onClick={() => goTo("CALENDAR")} variant="primary" size="full">
              Agendar Consulta
            </Button>
            <Button onClick={() => goTo("CATEGORIES")} variant="primary" size="full">
              Exercícios
            </Button>
            <Button onClick={() => goTo("EVOLUTION")} variant="primary" size="full">
              Documentos
            </Button>
          </div>
        </div>

        {/* Grid de duas colunas */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Coluna da esquerda */}
            {/* Consultas de Hoje */}
            <div className="bg-white p-6 rounded-xl shadow-md">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold">Consultas de Hoje</h2>
                <Button onClick={() => goTo("CALENDAR")} variant="outline" size="sm">
                  Ver Calendário
                </Button>
              </div>
              
              <div className="">
                {loading ? (
                  <p>Carregando...</p>
                ) : (
                  <ConsultationAlerts events={events} />
                )}
              </div>
            </div>

          {/* Coluna da direita - Atividades Recentes */}
          <div className="bg-white p-6 rounded-xl shadow-md">
            <h2 className="text-xl font-semibold mb-4">Atividades Recentes</h2>
            <div className="space-y-4 overflow-y-auto max-h-[calc(100vh-400px)] pr-2">
              {loading ? (
                <p>Carregando...</p>
              ) : recentLogs.length === 0 ? (
                <p className="text-gray-500">Nenhuma atividade recente</p>
              ) : (
                <div className="space-y-4">
                  {recentLogs.map((log) => (
                    <div key={log._id} className="border-l-4 border-blue-500 pl-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium">
                            {log.user.email} {log.action.toLowerCase()} {log.entity}
                          </p>
                          <p className="text-sm text-gray-500">
                            {new Date(log.timestamp).toLocaleString('pt-BR')}
                          </p>
                        </div>
                      </div>
                      {log.changes && (
                        <div className="mt-2 text-sm text-gray-600">
                          <p>Alterações:</p>
                          <ul className="list-disc list-inside">
                            {Object.entries(log.changes).map(([key, value]) => (
                              <li key={key}>
                                {key}: {value}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </MainLayout>  
  );
}

export default HomePage;
