const Booking = require('../Models/Booking');
const User = require('../Models/User');
const { Op } = require('sequelize');
const { createBookingSchema, updateBookingSchema } = require('../validators/bookingValidator');

exports.createBooking = async (req, res) => {
  const { error, value } = createBookingSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }

  const { service, date, time, providerId } = value;

  try {
    const provider = await User.findOne({ where: { id: providerId, role: 'prestador' } });
    if (!provider) {
      return res.status(400).json({ error: 'Prestador de serviço inválido.' });
    }

    const booking = await Booking.create({
      clientId: req.user.id,
      providerId,
      service,
      date,
      time,
      status: 'pendente'
    });

    res.status(201).json({ message: 'Agendamento criado e aguardando aprovação do prestador.', booking });
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: 'Erro ao criar agendamento' });
  }
};

exports.getBookings = async (req, res) => {
  try {
    const { service, startDate, endDate, status } = req.query;
    const where = req.user.role === 'prestador'
      ? { providerId: req.user.id }
      : { clientId: req.user.id };

    if (service) {
      where.service = { [Op.like]: `%${service.trim()}%` };
    }

    if (status) {
      where.status = status;
    }

    if (startDate && endDate) {
      where.date = { [Op.between]: [startDate, endDate] };
    } else if (startDate) {
      where.date = { [Op.gte]: startDate };
    } else if (endDate) {
      where.date = { [Op.lte]: endDate };
    }

    const bookings = await Booking.findAll({
      where,
      include: [
        { model: User, as: 'client', attributes: ['id', 'name', 'email'] },
        { model: User, as: 'provider', attributes: ['id', 'name', 'email'] }
      ],
      order: [['date', 'ASC'], ['time', 'ASC']]
    });
    res.json(bookings);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao buscar agendamentos' });
  }
};

exports.getBookingSummary = async (req, res) => {
  try {
    const where = req.user.role === 'prestador'
      ? { providerId: req.user.id }
      : { clientId: req.user.id };

    const bookings = await Booking.findAll({ where, order: [['date', 'ASC'], ['time', 'ASC']] });
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
    const where = req.user.role === 'prestador'
      ? { id: req.params.id, providerId: req.user.id }
      : { id: req.params.id, clientId: req.user.id };

    const booking = await Booking.findOne({
      where,
      include: [
        { model: User, as: 'client', attributes: ['id', 'name', 'email'] },
        { model: User, as: 'provider', attributes: ['id', 'name', 'email'] }
      ]
    });

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
  const { error, value } = updateBookingSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }

  const { service, date, time, providerId } = value;

  try {
    const booking = await Booking.findOne({ where: { id: req.params.id, clientId: req.user.id } });
    if (!booking) {
      return res.status(404).json({ error: 'Agendamento não encontrado ou não pertence ao cliente.' });
    }

    if (booking.status !== 'pendente') {
      return res.status(400).json({ error: 'Somente agendamentos pendentes podem ser editados.' });
    }

    if (providerId && providerId !== booking.providerId) {
      const provider = await User.findOne({ where: { id: providerId, role: 'prestador' } });
      if (!provider) {
        return res.status(400).json({ error: 'Prestador de serviço inválido.' });
      }
    }

    await booking.update({
      service,
      providerId: providerId || booking.providerId,
      date,
      time
    });
    res.json({ message: 'Agendamento atualizado!', booking });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao atualizar agendamento' });
  }
};

exports.cancelBooking = async (req, res) => {
  try {
    const where = req.user.role === 'prestador'
      ? { id: req.params.id, providerId: req.user.id }
      : { id: req.params.id, clientId: req.user.id };

    const booking = await Booking.findOne({ where });
    if (!booking) {
      return res.status(404).json({ error: 'Agendamento não encontrado.' });
    }

    await booking.update({ status: 'cancelado' });
    res.json({ message: 'Agendamento cancelado!' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao cancelar agendamento' });
  }
};

exports.setBookingStatus = async (req, res) => {
  const { status } = req.body;
  if (!['aprovado', 'rejeitado'].includes(status)) {
    return res.status(400).json({ error: 'Status inválido. Use aprovado ou rejeitado.' });
  }

  try {
    const booking = await Booking.findOne({ where: { id: req.params.id, providerId: req.user.id } });
    if (!booking) {
      return res.status(404).json({ error: 'Agendamento não encontrado ou você não é o prestador responsável.' });
    }

    await booking.update({ status });
    res.json({ message: `Agendamento ${status} com sucesso.`, booking });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao atualizar status do agendamento' });
  }
};

exports.getProviders = async (req, res) => {
  try {
    const providers = await User.findAll({ where: { role: 'prestador' }, attributes: ['id', 'name', 'email'] });
    res.json(providers);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao buscar prestadores de serviço' });
  }
};

exports.approveBooking = async (req, res) => {
  try {
    const booking = await Booking.findOne({ where: { id: req.params.id, providerId: req.user.id } });
    if (!booking) {
      return res.status(404).json({ error: 'Agendamento não encontrado.' });
    }

    if (booking.status !== 'pendente') {
      return res.status(400).json({ error: 'Somente agendamentos pendentes podem ser aprovados.' });
    }

    await booking.update({ status: 'aprovado' });
    res.json({ message: 'Agendamento aprovado.', booking });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao aprovar agendamento' });
  }
};

exports.rejectBooking = async (req, res) => {
  try {
    const booking = await Booking.findOne({ where: { id: req.params.id, providerId: req.user.id } });
    if (!booking) {
      return res.status(404).json({ error: 'Agendamento não encontrado.' });
    }

    if (booking.status !== 'pendente') {
      return res.status(400).json({ error: 'Somente agendamentos pendentes podem ser rejeitados.' });
    }

    await booking.update({ status: 'rejeitado' });
    res.json({ message: 'Agendamento rejeitado.', booking });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao rejeitar agendamento' });
  }
};
