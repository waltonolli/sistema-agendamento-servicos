import { useState } from "react";
import { API_ENDPOINTS } from "../config/api";

function LoginForm({ setToken }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email.trim() || !password.trim()) {
      setMessage('Preencha e-mail e senha.');
      return;
    }

    try {
      const res = await fetch(API_ENDPOINTS.AUTH_LOGIN, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();

      if (data.token) {
        setToken(data.token);
      } else {
        setMessage(data.error || 'Erro no login.');
      }
    } catch (error) {
      console.error(error);
      setMessage('Falha ao conectar com o servidor.');
    }
  };

  return (
    <section className="card auth-card">
      <h2>Login</h2>
      <form onSubmit={handleLogin} className="auth-form">
        <label>
          Email
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="seu@email.com" />
        </label>
        <label>
          Senha
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" />
        </label>
        <button className="primary-button" type="submit">Entrar</button>
        {message && <p className="form-message">{message}</p>}
      </form>
    </section>
  );
}

export default LoginForm;
