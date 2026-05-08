const { DataTypes } = require('sequelize');
const sequelize = require('./index');
const User = require('./User');

const Booking = sequelize.define('Booking', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  service: { type: DataTypes.STRING, allowNull: false },
  date: { type: DataTypes.DATEONLY, allowNull: false },
  time: { type: DataTypes.STRING, allowNull: false },
  clientId: { type: DataTypes.INTEGER, allowNull: false },
  providerId: { type: DataTypes.INTEGER, allowNull: false },
  status: { type: DataTypes.ENUM('pendente', 'aprovado', 'rejeitado', 'cancelado'), allowNull: false, defaultValue: 'pendente' }
}, {
  tableName: 'bookings',
  timestamps: true
});

// Relacionamentos:
User.hasMany(Booking, { foreignKey: 'clientId', as: 'customerBookings' });
User.hasMany(Booking, { foreignKey: 'providerId', as: 'providerBookings' });
Booking.belongsTo(User, { foreignKey: 'clientId', as: 'client' });
Booking.belongsTo(User, { foreignKey: 'providerId', as: 'provider' });

module.exports = Booking;
