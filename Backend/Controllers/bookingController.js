const Booking = require('../../Models/Booking');

exports.createBooking = async (req, res) => {
  const { service, date, time } = req.body;
  try {
    const booking = await Booking.create({ userId: req.user.id, service, date, time });
    res.status(201).json({ message: 'Agendamento criado!', booking });
  } catch (error) {
    res.status(400).json({ error: 'Erro ao criar agendamento' });
  }
};

exports.getBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ userId: req.user.id });
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar agendamentos' });
  }
};

exports.cancelBooking = async (req, res) => {
  try {
    await Booking.findByIdAndDelete(req.params.id);
    res.json({ message: 'Agendamento cancelado!' });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao cancelar agendamento' });
  }
};
