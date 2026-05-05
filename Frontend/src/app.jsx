import { useState } from "react";
import LoginForm from "./components/loginForm";
import RegisterForm from "./components/registerForm";
import BookingForm from "./components/bookingForm";
import BookingList from "./components/bookingList";
import BookingStats from "./components/bookingStats";

function App() {
  const [token, setToken] = useState(() => localStorage.getItem('authToken'));
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleToken = (newToken) => {
    localStorage.setItem('authToken', newToken);
    setToken(newToken);
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    setToken(null);
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
          <LoginForm setToken={handleToken} />
          <RegisterForm />
        </main>
      ) : (
        <main className="dashboard-layout">
          <div className="dashboard-left">
            <BookingStats token={token} refreshTrigger={refreshTrigger} />
            <BookingForm
              token={token}
              editBooking={selectedBooking}
              clearEdit={() => setSelectedBooking(null)}
              onSaved={handleSaved}
            />
          </div>
          <BookingList
            token={token}
            onEdit={setSelectedBooking}
            refreshTrigger={refreshTrigger}
          />
        </main>
      )}
    </div>
  );
}

export default App;
