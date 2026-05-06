const Joi = require('joi');

const createBookingSchema = Joi.object({
  service: Joi.string().min(3).max(100).required().messages({
    'string.empty': 'Serviço é obrigatório',
    'string.min': 'Serviço deve ter no mínimo 3 caracteres',
    'string.max': 'Serviço não pode exceder 100 caracteres'
  }),
  date: Joi.string().isoDate().required().messages({
    'string.isoDate': 'Data deve estar em formato ISO (YYYY-MM-DD)',
    'string.empty': 'Data é obrigatória'
  }),
  time: Joi.string().pattern(/^([0-1][0-9]|2[0-3]):[0-5][0-9]$/).required().messages({
    'string.pattern.base': 'Hora deve estar em formato HH:MM (ex: 14:30)',
    'string.empty': 'Hora é obrigatória'
  })
});

module.exports = {
  createBookingSchema
};
