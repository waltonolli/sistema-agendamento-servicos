import { useState, useEffect } from "react";
import { API_ENDPOINTS } from "../config/api";

function BookingForm({ token, editBooking, clearEdit, onSaved }) {
  const [service, setService] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (editBooking) {
      setService(editBooking.service);
      setDate(editBooking.date);
      setTime(editBooking.time);
    } else {
      setService("");
      setDate("");
      setTime("");
    }
  }, [editBooking]);

  const resetForm = () => {
    setService("");
    setDate("");
    setTime("");
    clearEdit();
    setMessage("");
  };

  const handleBooking = async (e) => {
    e.preventDefault();

    if (!service.trim() || !date || !time) {
      setMessage('Preencha todos os campos antes de enviar.');
      return;
    }

    const method = editBooking ? 'PUT' : 'POST';
    const url = editBooking
      ? API_ENDPOINTS.BOOKINGS_UPDATE(editBooking.id)
      : API_ENDPOINTS.BOOKINGS_CREATE;

    try {
      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ service, date, time }),
      });
      const data = await res.json();

      if (!res.ok) {
        setMessage(data.error || 'Erro ao salvar o agendamento.');
        return;
      }

      setMessage(data.message || 'Operação realizada com sucesso.');
      resetForm();
      onSaved();
    } catch (error) {
      console.error(error);
      setMessage('Falha de comunicação com o servidor.');
    }
  };

  return (
    <section className="card form-card">
      <h2>{editBooking ? 'Editar Agendamento' : 'Novo Agendamento'}</h2>
      <form onSubmit={handleBooking} className="booking-form">
        <label>
          Serviço
          <input
            type="text"
            value={service}
            placeholder="Ex: Corte de cabelo"
            onChange={(e) => setService(e.target.value)}
          />
        </label>
        <label>
          Data
          <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
        </label>
        <label>
          Hora
          <input type="time" value={time} onChange={(e) => setTime(e.target.value)} />
        </label>

        <div className="form-actions">
          <button className="primary-button" type="submit">
            {editBooking ? 'Salvar Alterações' : 'Agendar'}
          </button>
          {editBooking && (
            <button type="button" className="secondary-button" onClick={resetForm}>
              Cancelar edição
            </button>
          )}
        </div>

        {message && <p className="form-message">{message}</p>}
      </form>
    </section>
  );
}

export default BookingForm;
