import { useState, useEffect } from 'react';
import { Clock, Bell } from 'lucide-react';

const ConsultationAlerts = ({ events }) => {
  const [todayConsultations, setTodayConsultations] = useState([]);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    // Atualiza o tempo atual a cada minuto
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (!events) return;

    // Filtra as consultas do dia atual
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const todayEvents = events.filter(event => {
      const eventDate = new Date(event.start);
      const eventDay = new Date(eventDate);
      eventDay.setHours(0, 0, 0, 0);
      return eventDay.getTime() === today.getTime() && new Date(event.start) > currentTime;
    });

    // Ordena por horário
    const sortedEvents = todayEvents.sort((a, b) => 
      new Date(a.start).getTime() - new Date(b.start).getTime()
    );

    setTodayConsultations(sortedEvents);
  }, [events, currentTime]);

  const getTimeRemaining = (consultationTime) => {
    const diff = new Date(consultationTime) - currentTime;
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    if (hours > 0) {
      return `${hours}h ${minutes}min`;
    }
    return `${minutes}min`;
  };

  const getAlertColor = (timeRemaining) => {
    const minutesRemaining = Math.floor(timeRemaining / (1000 * 60));
    if (minutesRemaining <= 30) return 'bg-red-100 border-red-500 text-red-700';
    if (minutesRemaining <= 60) return 'bg-yellow-100 border-yellow-500 text-yellow-700';
    return 'bg-blue-100 border-blue-500 text-blue-700';
  };

  if (todayConsultations.length === 0) {
    return (
      <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
        <div className="flex items-center gap-2 text-gray-600">
          <Bell size={20} />
          <p>Não há consultas agendadas para hoje</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mb-6 space-y-2">
      <div className="space-y-2">
        {todayConsultations.map((consultation) => {
          const timeRemaining = new Date(consultation.start) - currentTime;
          const alertColor = getAlertColor(timeRemaining);

          return (
            <div
              key={consultation.id}
              className={`p-4 rounded-lg border ${alertColor} flex items-center justify-between`}
            >
              <div>
                <p className="font-medium">{consultation.title}</p>
                <p className="text-sm">
                  {new Date(consultation.start).toLocaleTimeString('pt-BR', {
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Clock size={16} />
                <span className="font-medium">
                  {getTimeRemaining(consultation.start)}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ConsultationAlerts; 