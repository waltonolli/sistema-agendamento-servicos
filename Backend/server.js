require('dotenv').config();

// Validar variáveis obrigatórias
if (!process.env.JWT_SECRET) {
  console.error('❌ Erro: JWT_SECRET não definido em .env');
  process.exit(1);
}

const path = require('path');
const express = require('express');
const cors = require('cors');

// Importa rotas
const authRoutes = require('./Routes/auth');
const bookingRoutes = require('./Routes/booking');

// Importa Sequelize e modelos
const sequelize = require('./models/index');
const User = require('./models/User');
const Booking = require('./models/Booking');

const app = express();
app.use(cors());
app.use(express.json());

// Rotas principais
app.use('/api/auth', authRoutes);
app.use('/api/bookings', bookingRoutes);

// Servir frontend em produção
if (process.env.NODE_ENV === 'production') {
  const frontendPath = path.join(__dirname, '..', 'Frontend', 'dist');
  app.use(express.static(frontendPath));
  app.get('*', (req, res) => res.sendFile(path.join(frontendPath, 'index.html')));
}

// Sincroniza tabelas com o banco de dados
sequelize.sync({ alter: true })
  .then(() => console.log('✅ Tabelas sincronizadas com o banco de dados'))
  .catch(err => console.error('❌ Erro ao sincronizar tabelas:', err));

app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({ error: err.message || 'Erro interno do servidor' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Servidor rodando na porta ${PORT}`));
