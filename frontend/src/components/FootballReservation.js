// FootballReservation.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import FullCalendar from '@fullcalendar/react';
import timeGridPlugin from '@fullcalendar/timegrid';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import backendURL from '../config';
import './FootballReservation.css';
import { FaFutbol } from 'react-icons/fa';

const FootballReservation = () => {

  const [date, setDate] = useState(new Date());
  const [events, setEvents] = useState([]);
  const [showModal, setShowModal] = useState(false);

  const [slot, setSlot] = useState({
    dateStr: '',
    startTime: '17:00',
    endTime: '18:00'
  });

  const [user, setUser] = useState('');
  const [message, setMessage] = useState('');

  const formattedDate = (d) => format(d, 'yyyy-MM-dd');

  // 🔵 Convertir respuesta a formato FullCalendar
  const convertToFC = (data) =>
    data.map(r => ({
      id: r._id,
      title: r.user,
      start: `${r.date}T${r.startTime}`,   // <-- AHORA SIEMPRE EXISTE
      end: `${r.date}T${r.endTime}`,
      extendedProps: { user: r.user }
    }));

  // 🔵 Cargar reservas del backend en un rango
  const fetchRange = async (startStr, endStr) => {
    try {
      const res = await axios.get(
        `${backendURL}/football-reservations/range?start=${startStr}&end=${endStr}`
      );

      setEvents(convertToFC(res.data));   // <-- CONVERSIÓN CORRECTA

    } catch (err) {
      console.error('Error fetch range', err);
    }
  };

  // 🔵 FullCalendar pide datos cada vez que cambia la vista
  const handleDatesSet = (arg) => {
    const start = format(arg.start, 'yyyy-MM-dd');
    const end = format(arg.end, 'yyyy-MM-dd');
    fetchRange(start, end);
  };

  // Cargar eventos iniciales
  useEffect(() => {
    const start = formattedDate(new Date(date.getFullYear(), date.getMonth(), date.getDate() - 7));
    const end = formattedDate(new Date(date.getFullYear(), date.getMonth(), date.getDate() + 7));
    fetchRange(start, end);
  }, []);

  // 🔵 Cuando seleccionás una franja en el calendario
  const handleSelect = (selectInfo) => {
    const isoStart = selectInfo.startStr; // YYYY-MM-DDTHH:MM:SS
    const isoEnd = selectInfo.endStr;

    const datePart = isoStart.slice(0, 10);
    const startTime = isoStart.slice(11, 16);
    const endTime = isoEnd.slice(11, 16);

    setSlot({ dateStr: datePart, startTime, endTime });
    setShowModal(true);
  };

  // 🔵 Generar slots de 1 hora para la lista lateral
  const generateDailySlots = (day) => {
    const slots = [];
    const startHour = 17; // 17:00
    const endHour = 22;   // hasta 22:00

    for (let h = startHour; h < endHour; h++) {
      const s = `${String(h).padStart(2, '0')}:00`;
      const e = `${String(h + 1).padStart(2, '0')}:00`;
      slots.push({ date: day, startTime: s, endTime: e });
    }

    return slots;
  };

  // 🔵 Crear reserva desde modal o lista lateral
  const handleCreate = async (e) => {
    e.preventDefault();
    setMessage('');

    try {
      await axios.post(`${backendURL}/football-reservations`, {
        date: slot.dateStr,
        startTime: slot.startTime,
        endTime: slot.endTime,
        user
      });

      setMessage('Reserva realizada');
      setShowModal(false);
      setUser('');

      const start = slot.dateStr;
      fetchRange(start, start);

    } catch (err) {
      setMessage(err.response?.data?.message || 'Error al reservar');
    }
  };

  return (
    <div className="football-wrapper">

      <header className="football-header">
        <div className="football-title"><FaFutbol /> Cancha BARRIO TIRO FEDERAL</div>

        <div className="football-controls">
          <DatePicker
            selected={date}
            onChange={(d) => setDate(d)}
            dateFormat="yyyy-MM-dd"
            locale={es}
            className="football-datepicker"
          />
        </div>
      </header>

      <div className="football-main">

        {/* 🟦 CALENDARIO */}
        <div className="football-calendar">
          <FullCalendar
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
            initialView="timeGridWeek"
            allDaySlot={false}
            slotMinTime="16:00:00"
            slotMaxTime="22:00:00"
            weekends={true}
            events={events}
            selectable={true}
            select={handleSelect}
            datesSet={handleDatesSet}
            height="auto"
            headerToolbar={{
              left: 'prev,next today',
              center: 'title',
              right: 'dayGridMonth,timeGridWeek,timeGridDay'
            }}
          />
        </div>

        {/* 🟩 PANEL LATERAL */}
        <aside className="football-aside">
          <h4>Reservas - {formattedDate(date)}</h4>

          <div className="football-slot-list">
            {generateDailySlots(formattedDate(date)).map(s => {

              const occupied = events.some(ev =>
                ev.start.slice(0, 10) === s.date &&
                ev.start.slice(11, 16) === s.startTime
              );

              return (
                <div key={`${s.date}-${s.startTime}`}
                  className={`slot ${occupied ? 'occupied' : 'free'}`}>
                  <div className="slot-time">{s.startTime} - {s.endTime}</div>
                  <div className="slot-action">
                    {occupied ? (
                      <span>Ocupada</span>
                    ) : (
                      <button onClick={() => {
                        setSlot({ dateStr: s.date, startTime: s.startTime, endTime: s.endTime });
                        setShowModal(true);
                      }}>
                        Reservar
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="legend">
            <div><span className="dot free"></span> Libre</div>
            <div><span className="dot occupied"></span> Ocupada</div>
          </div>
        </aside>
      </div>

      {/* 🟣 MODAL */}
      {showModal && (
        <div className="modal-backdrop" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h3>Reservar {slot.dateStr}</h3>
            <p>{slot.startTime} - {slot.endTime}</p>

            <form onSubmit={handleCreate}>
              <label>Torre - Piso - Dpto</label>
              <input value={user} onChange={(e) => setUser(e.target.value)} required />

              <div className="modal-actions">
                <button type="submit">Confirmar</button>
                <button type="button" onClick={() => setShowModal(false)}>Cancelar</button>
              </div>
            </form>

            {message && <p className="modal-msg">{message}</p>}
          </div>
        </div>
      )}

    </div>
  );
};

export default FootballReservation;
