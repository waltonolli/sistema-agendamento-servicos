const express = require('express');
const cors = require('cors');
const authRoutes = require('./Routes/auth');
const bookingRoutes = require('./Routes/booking');

const app = express();
app.use(cors());
app.use(express.json());

// Rotas
app.use('/api/auth', authRoutes);
app.use('/api/bookings', bookingRoutes);

const PORT = 5000;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
