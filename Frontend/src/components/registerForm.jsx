import { useState } from "react";
import { API_ENDPOINTS } from "../config/api";

function RegisterForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState('cliente');

  const [message, setMessage] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();

    if (!name.trim() || !email.trim() || !password.trim()) {
      setMessage('Preencha todos os campos para se cadastrar.');
      return;
    }

    try {
      const res = await fetch(API_ENDPOINTS.AUTH_REGISTER, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, role }),
      });
      const data = await res.json();

      if (res.ok) {
        setMessage('Cadastro realizado! Faça login para continuar.');
        setName('');
        setEmail('');
        setPassword('');
      } else {
        setMessage(data.error || 'Erro no cadastro.');
      }
    } catch (error) {
      console.error(error);
      setMessage('Falha ao conectar com o servidor.');
    }
  };

  return (
    <section className="card auth-card">
      <h2>Cadastro</h2>
      <form onSubmit={handleRegister} className="auth-form">
        <label>
          Nome
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Nome completo" />
        </label>
        <label>
          Email
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="seu@email.com" />
        </label>
        <label>
          Senha
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" />
        </label>
        <label>
          Tipo de conta
          <select value={role} onChange={(e) => setRole(e.target.value)}>
            <option value="cliente">Cliente</option>
            <option value="prestador">Prestador de serviços</option>
          </select>
        </label>
        <button className="secondary-button" type="submit">Cadastrar</button>
        {message && <p className="form-message">{message}</p>}
      </form>
    </section>
  );
}

export default RegisterForm;