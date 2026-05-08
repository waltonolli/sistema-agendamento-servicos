import { useState, useEffect } from "react";
import { API_ENDPOINTS } from "../config/api";

function BookingForm({ token, userRole, editBooking, clearEdit, onSaved }) {
  const [service, setService] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [providerId, setProviderId] = useState("");
  const [providers, setProviders] = useState([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (editBooking) {
      setService(editBooking.service);
      setDate(editBooking.date);
      setTime(editBooking.time);
      setProviderId(editBooking.providerId || "");
    } else {
      setService("");
      setDate("");
      setTime("");
      setProviderId("");
    }
  }, [editBooking]);

  useEffect(() => {
    const fetchProviders = async () => {
      if (userRole !== 'cliente') return;
      try {
        const res = await fetch(API_ENDPOINTS.BOOKINGS_PROVIDERS, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        const data = await res.json();
        if (res.ok) {
          setProviders(data);
          if (!providerId && data.length > 0) setProviderId(data[0].id);
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchProviders();
  }, [userRole, token, providerId]);

  const resetForm = () => {
    setService("");
    setDate("");
    setTime("");
    clearEdit();
    setMessage("");
  };

  const handleBooking = async (e) => {
    e.preventDefault();

    if (!service.trim() || !date || !time || (!editBooking && !providerId)) {
      setMessage('Preencha todos os campos antes de enviar.');
      return;
    }

    const method = editBooking ? 'PUT' : 'POST';
    const url = editBooking
      ? API_ENDPOINTS.BOOKINGS_UPDATE(editBooking.id)
      : API_ENDPOINTS.BOOKINGS_CREATE;

    const payload = { service, date, time, providerId };

    try {
      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
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

  if (userRole === 'prestador') {
    return (
      <section className="card form-card">
        <h2>Agenda do Prestador</h2>
        <p>Você é prestador de serviços. Aqui você visualiza e aprova solicitações no seu calendário.</p>
      </section>
    );
  }

  return (
    <section className="card form-card">
      <h2>{editBooking ? 'Editar Agendamento' : 'Novo Agendamento'}</h2>
      <form onSubmit={handleBooking} className="booking-form">
        <label>
          Prestador
          <select value={providerId} onChange={(e) => setProviderId(e.target.value)}>
            <option value="">Selecione um prestador</option>
            {providers.map((provider) => (
              <option key={provider.id} value={provider.id}>
                {provider.name}
              </option>
            ))}
          </select>
        </label>
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
