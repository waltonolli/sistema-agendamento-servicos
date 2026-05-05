import { useState, useEffect } from "react";

function BookingStats({ token, refreshTrigger }) {
  const [stats, setStats] = useState(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!token) return;

    const fetchSummary = async () => {
      setMessage("");

      try {
        const res = await fetch("http://localhost:5000/api/bookings/summary", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();

        if (!res.ok) {
          setMessage(data.error || 'Erro ao carregar o resumo.');
          return;
        }

        setStats(data);
      } catch (error) {
        console.error(error);
        setMessage('Falha ao buscar o resumo de agendamentos.');
      }
    };

    fetchSummary();
  }, [token, refreshTrigger]);

  const maxCount = stats?.topServices?.reduce((max, item) => Math.max(max, item.count), 0) || 1;

  return (
    <section className="card stats-card">
      <h2>Resumo rápido</h2>

      {message && <p className="list-message">{message}</p>}

      {stats ? (
        <>
          <div className="stats-grid">
            <article className="stat-card">
              <span>Total agendamentos</span>
              <strong>{stats.total}</strong>
            </article>
            <article className="stat-card">
              <span>Agendamentos futuros</span>
              <strong>{stats.upcoming}</strong>
            </article>
            <article className="stat-card">
              <span>Agendamentos passados</span>
              <strong>{stats.past}</strong>
            </article>
          </div>

          <div className="chart-card">
            <h3>Serviços mais agendados</h3>
            {stats.topServices?.length === 0 ? (
              <p>Sem agendamentos ainda.</p>
            ) : (
              stats.topServices?.map((item) => (
                <div key={item.service} className="chart-row">
                  <span>{item.service}</span>
                  <div className="chart-bar">
                    <div className="bar-fill" style={{ width: `${(item.count / maxCount) * 100}%` }} />
                  </div>
                  <strong>{item.count}</strong>
                </div>
              ))
            )}
          </div>
        </>
      ) : (
        <p>Carregando resumo...</p>
      )}
    </section>
  );
}

export default BookingStats;
