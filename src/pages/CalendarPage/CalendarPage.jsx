import { useState } from "react";
import MainLayout from "../../layouts/MainLayout";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import ptBrLocale from "@fullcalendar/core/locales/pt-br";

function CalendarPage() {
  const handleDateClick = (arg) => {
    // Aqui você pode adicionar a lógica para criar um novo evento
    console.log("Data clicada:", arg.dateStr);
  };

  const handleEventClick = (arg) => {
    // Aqui você pode adicionar a lógica para editar um evento existente
    console.log("Evento clicado:", arg.event);
  };

  return (
    <MainLayout>
      <div className="max-w-6xl mx-auto p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Calendário</h1>
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
            events={[
              // Exemplo de eventos
              {
                title: "Sessão de Fonoaudiologia",
                start: "2024-03-20T10:00:00",
                end: "2024-03-20T11:00:00",
                color: "#3B82F6"
              },
              {
                title: "Exercícios de Fala",
                start: "2024-03-22T14:00:00",
                end: "2024-03-22T15:00:00",
                color: "#10B981"
              }
            ]}
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
      </div>
    </MainLayout>
  );
}

export default CalendarPage;
