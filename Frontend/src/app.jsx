import { useState } from "react";
import LoginForm from "./components/loginForm";
import RegisterForm from "./components/registerForm";
import BookingForm from "./components/bookingForm";
import BookingList from "./components/bookingList";
import BookingStats from "./components/bookingStats";

function App() {
  const [token, setToken] = useState(() => localStorage.getItem('authToken'));
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('authUser');
    return saved ? JSON.parse(saved) : null;
  });
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleAuth = ({ token: newToken, user: userData }) => {
    localStorage.setItem('authToken', newToken);
    localStorage.setItem('authUser', JSON.stringify(userData));
    setToken(newToken);
    setUser(userData);
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('authUser');
    setToken(null);
    setUser(null);
    setSelectedBooking(null);
  };

  const handleSaved = () => {
    setSelectedBooking(null);
    setRefreshTrigger((prev) => prev + 1);
  };

  return (
    <div className="app-shell">
      <header className="app-header">
        <div>
          <h1>Agenda Fácil</h1>
          <p>Gerencie seus agendamentos de forma simples, com filtros e estatísticas.</p>
        </div>
        {token && <button className="logout-button" onClick={handleLogout}>Sair</button>}
      </header>

      {!token ? (
        <main className="auth-layout">
          <LoginForm onLogin={handleAuth} />
          <RegisterForm />
        </main>
      ) : (
        <main className="dashboard-layout">
          <div className="dashboard-left">
            <BookingStats token={token} refreshTrigger={refreshTrigger} />
            {user?.role === 'cliente' ? (
              <BookingForm
                token={token}
                userRole={user?.role}
                editBooking={selectedBooking}
                clearEdit={() => setSelectedBooking(null)}
                onSaved={handleSaved}
              />
            ) : (
              <section className="card form-card">
                <h2>Agenda do Prestador</h2>
                <p>Como prestador de serviço, você pode ver solicitações de reserva e aprová-las ou rejeitá-las.</p>
              </section>
            )}
          </div>
          <BookingList
            token={token}
            userRole={user?.role}
            onEdit={setSelectedBooking}
            refreshTrigger={refreshTrigger}
          />
        </main>
      )}
    </div>
  );
}

export default App;
