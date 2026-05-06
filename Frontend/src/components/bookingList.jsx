import { useState, useEffect } from "react";
import { API_ENDPOINTS } from "../config/api";

function BookingList({ token, onEdit, refreshTrigger }) {
  const [bookings, setBookings] = useState([]);
  const [message, setMessage] = useState("");
  const [serviceFilter, setServiceFilter] = useState("");
  const [startDateFilter, setStartDateFilter] = useState("");
  const [endDateFilter, setEndDateFilter] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchBookings = async () => {
    setLoading(true);
    setMessage("");

    try {
      const params = new URLSearchParams();
      if (serviceFilter.trim()) params.append('service', serviceFilter.trim());
      if (startDateFilter) params.append('startDate', startDateFilter);
      if (endDateFilter) params.append('endDate', endDateFilter);

      const res = await fetch(`${API_ENDPOINTS.BOOKINGS_GET}?${params.toString()}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();

      if (!res.ok) {
        setMessage(data.error || 'Não foi possível carregar os agendamentos.');
        setBookings([]);
      } else {
        setBookings(data);
      }
    } catch (error) {
      console.error(error);
      setMessage('Falha ao buscar agendamentos.');
      setBookings([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, [token, refreshTrigger]);

  const handleSearch = async (e) => {
    e.preventDefault();
    await fetchBookings();
  };

  const clearFilters = () => {
    setServiceFilter("");
    setStartDateFilter("");
    setEndDateFilter("");
    setMessage("");
    fetchBookings();
  };

  const handleCancel = async (id) => {
    try {
      const res = await fetch(API_ENDPOINTS.BOOKINGS_DELETE(id), {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();

      if (!res.ok) {
        setMessage(data.error || 'Erro ao cancelar agendamento.');
        return;
      }

      setBookings((prev) => prev.filter((b) => b.id !== id));
      setMessage('Agendamento cancelado com sucesso.');
    } catch (error) {
      console.error(error);
      setMessage('Erro de conexao ao cancelar.');
    }
  };

  return (
    <section className="card list-card">
      <div className="list-header">
        <div>
          <h2>Meus Agendamentos</h2>
          <p>{bookings.length} agendamento(s) encontrados</p>
        </div>
      </div>

      <form className="filter-form" onSubmit={handleSearch}>
        <label>
          Buscar servi�o
          <input
            type="text"
            value={serviceFilter}
            onChange={(e) => setServiceFilter(e.target.value)}
            placeholder="Ex: Corte, Manicure"
          />
        </label>
        <label>
          De
          <input type="date" value={startDateFilter} onChange={(e) => setStartDateFilter(e.target.value)} />
        </label>
        <label>
          Ate
          <input type="date" value={endDateFilter} onChange={(e) => setEndDateFilter(e.target.value)} />
        </label>
        <div className="filter-actions">
          <button className="secondary-button" type="submit">Filtrar</button>
          <button className="danger-button" type="button" onClick={clearFilters}>Limpar</button>
        </div>
      </form>

      {message && <p className="list-message">{message}</p>}
      {loading ? (
        <p>Carregando agendamentos...</p>
      ) : (
        <div className="booking-table">
          {bookings.length === 0 ? (
            <p>Você ainda não tem agendamentos. Faça um novo agendamento!</p>
          ) : (
            bookings.map((booking) => (
              <article key={booking.id} className="booking-card">
                <div className="booking-details">
                  <strong>{booking.service}</strong>
                  <p>{booking.date} �s {booking.time}</p>
                </div>
                <div className="booking-actions">
                  <button className="secondary-button" onClick={() => onEdit(booking)}>
                    Editar
                  </button>
                  <button className="danger-button" onClick={() => handleCancel(booking.id)}>
                    Cancelar
                  </button>
                </div>
              </article>
            ))
          )}
        </div>
      )}
    </section>
  );
}

export default BookingList;
