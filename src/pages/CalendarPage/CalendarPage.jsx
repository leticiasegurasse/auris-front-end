import { useState, useEffect } from "react";
import MainLayout from "../../layouts/MainLayout";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import ptBrLocale from "@fullcalendar/core/locales/pt-br";
import { 
  createAppointment, 
  getAppointments, 
  updateAppointment, 
  deleteAppointment 
} from "../../api/calendar/calendar";
import { getAllPatients } from "../../api/patients/patient";
import Button from "../../components/ButtonComponent/ButtonComponent";
import AlertMessage from "../../components/AlertComponent/AlertMessage";
import { Plus, Trash2, Search } from "lucide-react";

function CalendarPage() {
  const [events, setEvents] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [alert, setAlert] = useState(null);
  const [patients, setPatients] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [formData, setFormData] = useState({
    patient: "",
    consultationDateTime: "",
    observations: ""
  });
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  useEffect(() => {
    loadAppointments();
    loadPatients();
  }, []);

  const loadPatients = async () => {
    try {
      const response = await getAllPatients();
      setPatients(response.data);
    } catch (error) {
      console.error("Erro ao carregar pacientes:", error);
      setAlert({ type: "error", message: "Erro ao carregar pacientes: " + error });
    }
  };

  const filteredPatients = patients.filter(patient => 
    patient.userId?.name_user?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const loadAppointments = async () => {
    try {
      const appointments = await getAppointments();
      const formattedEvents = appointments.map(appointment => ({
        id: appointment._id,
        title: `Consulta - ${appointment.patient.name}`,
        start: new Date(appointment.consultationDateTime),
        end: new Date(new Date(appointment.consultationDateTime).getTime() + 60 * 60 * 1000), // 1 hora de duração
        color: "#3B82F6",
        extendedProps: {
          ...appointment
        }
      }));
      setEvents(formattedEvents);
    } catch (error) {
      console.error("Erro ao carregar consultas:", error);
      setAlert({ type: "error", message: "Erro ao carregar consultas: " + error });
    }
  };

  const handleDateClick = (arg) => {
    setSelectedDate(arg.date);
    setSelectedAppointment(null);
    setFormData({
      patient: "",
      consultationDateTime: arg.date.toISOString(),
      observations: ""
    });
    setIsModalOpen(true);
  };

  const handleEventClick = (arg) => {
    setSelectedAppointment(arg.event.extendedProps);
    setFormData({
      patient: arg.event.extendedProps.patient._id,
      consultationDateTime: new Date(arg.event.start).toISOString(),
      observations: arg.event.extendedProps.observations || ""
    });
    setIsModalOpen(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (selectedAppointment) {
        await updateAppointment(selectedAppointment._id, formData);
        setAlert({ type: "success", message: "Consulta atualizada com sucesso!" });
      } else {
        await createAppointment(formData);
        setAlert({ type: "success", message: "Consulta agendada com sucesso!" });
      }
      setIsModalOpen(false);
      loadAppointments();
    } catch (error) {
      console.error("Erro ao salvar consulta:", error);
      setAlert({ type: "error", message: "Erro ao salvar consulta: " + error });
    }
  };

  const handleDelete = async () => {
    if (!selectedAppointment) return;
    
    try {
      await deleteAppointment(selectedAppointment._id);
      setAlert({ type: "success", message: "Consulta excluída com sucesso!" });
      setIsModalOpen(false);
      loadAppointments();
    } catch (error) {
      console.error("Erro ao excluir consulta:", error);
      setAlert({ type: "error", message: "Erro ao excluir consulta: " + error });
    }
  };

  return (
    <MainLayout>
      <div className="max-w-6xl mx-auto p-6">
        {alert && (
          <AlertMessage 
            type={alert.type} 
            message={alert.message} 
            className="mb-4" 
            onClose={() => setAlert(null)} 
          />
        )}

        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Calendário de Consultas</h1>
          <Button
            icon={Plus}
            onClick={() => {
              setSelectedAppointment(null);
              setFormData({
                patient: "",
                consultationDateTime: "",
                observations: ""
              });
              setIsModalOpen(true);
            }}
          >
            Nova Consulta
          </Button>
        </div>

        <div className="bg-white rounded-lg shadow p-4">
          <FullCalendar
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
            initialView="dayGridMonth"
            headerToolbar={{
              left: "prev,next today",
              center: "title",
              right: "dayGridMonth,timeGridWeek"
            }}
            locale={ptBrLocale}
            height="auto"
            dateClick={handleDateClick}
            eventClick={handleEventClick}
            events={events}
            eventTimeFormat={{
              hour: "2-digit",
              minute: "2-digit",
              hour12: false
            }}
            slotMinTime="08:00:00"
            slotMaxTime="20:00:00"
            allDaySlot={false}
            weekends={true}
            editable={true}
            selectable={true}
            selectMirror={true}
            dayMaxEvents={true}
          />
        </div>

        {/* Modal de Agendamento */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
              <h2 className="text-2xl font-bold mb-4">
                {selectedAppointment ? "Editar Consulta" : "Agendar Consulta"}
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block font-medium mb-1">Paciente</label>
                  <div className="relative">
                    <div 
                      className="w-full p-2 border rounded cursor-pointer"
                      onClick={() => setIsSearchOpen(!isSearchOpen)}
                    >
                      {formData.patient ? 
                        patients.find(p => p._id === formData.patient)?.userId?.name_user || 'Sem nome' : 
                        'Selecione um paciente'
                      }
                    </div>
                    {isSearchOpen && (
                      <div className="absolute z-10 w-full mt-1 bg-white border rounded shadow-lg">
                        <div className="p-2 border-b">
                          <input
                            type="text"
                            placeholder="Buscar paciente..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full p-2 border rounded"
                            onClick={(e) => e.stopPropagation()}
                          />
                        </div>
                        <div className="max-h-60 overflow-y-auto">
                          {filteredPatients.map(patient => (
                            <div
                              key={patient._id}
                              className="p-2 hover:bg-gray-100 cursor-pointer"
                              onClick={() => {
                                setFormData(prev => ({ ...prev, patient: patient._id }));
                                setIsSearchOpen(false);
                              }}
                            >
                              {patient.userId?.name_user || 'Sem nome'}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                <div>
                  <label className="block font-medium mb-1">Data e Hora</label>
                  <input
                    type="datetime-local"
                    name="consultationDateTime"
                    value={formData.consultationDateTime}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded"
                    required
                  />
                </div>
                <div>
                  <label className="block font-medium mb-1">Observações</label>
                  <textarea
                    name="observations"
                    value={formData.observations}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded"
                    rows="3"
                  />
                </div>
                <div className="flex justify-end gap-4">
                  {selectedAppointment && (
                    <Button
                      variant="danger"
                      icon={Trash2}
                      onClick={handleDelete}
                    >
                      Excluir
                    </Button>
                  )}
                  <Button
                    variant="outline"
                    onClick={() => setIsModalOpen(false)}
                  >
                    Cancelar
                  </Button>
                  <Button type="submit">
                    {selectedAppointment ? "Salvar" : "Agendar"}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
}

export default CalendarPage;
