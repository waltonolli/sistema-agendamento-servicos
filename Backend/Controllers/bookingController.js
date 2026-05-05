const Booking = require('../Models/Booking');
const { Op } = require('sequelize');

exports.createBooking = async (req, res) => {
  const { service, date, time } = req.body;

  if (!service || !date || !time) {
    return res.status(400).json({ error: 'Serviço, data e hora são obrigatórios.' });
  }

  try {
    const booking = await Booking.create({ userId: req.user.id, service, date, time });
    res.status(201).json({ message: 'Agendamento criado!', booking });
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: 'Erro ao criar agendamento' });
  }
};

exports.getBookings = async (req, res) => {
  try {
    const { service, startDate, endDate } = req.query;
    const where = { userId: req.user.id };

    if (service) {
      where.service = { [Op.like]: `%${service.trim()}%` };
    }

    if (startDate && endDate) {
      where.date = { [Op.between]: [startDate, endDate] };
    } else if (startDate) {
      where.date = { [Op.gte]: startDate };
    } else if (endDate) {
      where.date = { [Op.lte]: endDate };
    }

    const bookings = await Booking.findAll({ where, order: [['date', 'ASC'], ['time', 'ASC']] });
    res.json(bookings);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao buscar agendamentos' });
  }
};

exports.getBookingSummary = async (req, res) => {
  try {
    const bookings = await Booking.findAll({ where: { userId: req.user.id }, order: [['date', 'ASC'], ['time', 'ASC']] });
    const today = new Date().toISOString().slice(0, 10);
    const upcoming = bookings.filter((booking) => booking.date >= today).length;
    const past = bookings.filter((booking) => booking.date < today).length;

    const services = bookings.reduce((acc, booking) => {
      const key = booking.service;
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {});

    const topServices = Object.entries(services)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([service, count]) => ({ service, count }));

    res.json({ total: bookings.length, upcoming, past, topServices });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao gerar o resumo de agendamentos' });
  }
};

exports.getBookingById = async (req, res) => {
  try {
    const booking = await Booking.findOne({ where: { id: req.params.id, userId: req.user.id } });
    if (!booking) {
      return res.status(404).json({ error: 'Agendamento não encontrado.' });
    }
    res.json(booking);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao buscar agendamento' });
  }
};

exports.updateBooking = async (req, res) => {
  const { service, date, time } = req.body;

  if (!service || !date || !time) {
    return res.status(400).json({ error: 'Serviço, data e hora são obrigatórios.' });
  }

  try {
    const booking = await Booking.findOne({ where: { id: req.params.id, userId: req.user.id } });
    if (!booking) {
      return res.status(404).json({ error: 'Agendamento não encontrado.' });
    }

    await booking.update({ service, date, time });
    res.json({ message: 'Agendamento atualizado!', booking });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao atualizar agendamento' });
  }
};

exports.cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findOne({ where: { id: req.params.id, userId: req.user.id } });
    if (!booking) {
      return res.status(404).json({ error: 'Agendamento não encontrado.' });
    }

    await booking.destroy();
    res.json({ message: 'Agendamento cancelado!' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao cancelar agendamento' });
  }
};
