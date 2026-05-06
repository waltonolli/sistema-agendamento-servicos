const Joi = require('joi');

const registerSchema = Joi.object({
  name: Joi.string().min(3).max(100).required().messages({
    'string.empty': 'Nome é obrigatório',
    'string.min': 'Nome deve ter no mínimo 3 caracteres',
    'string.max': 'Nome não pode exceder 100 caracteres'
  }),
  email: Joi.string().email().required().messages({
    'string.email': 'Email inválido',
    'string.empty': 'Email é obrigatório'
  }),
  password: Joi.string().min(6).required().messages({
    'string.min': 'Senha deve ter no mínimo 6 caracteres',
    'string.empty': 'Senha é obrigatória'
  })
});

const loginSchema = Joi.object({
  email: Joi.string().email().required().messages({
    'string.email': 'Email inválido'
  }),
  password: Joi.string().required().messages({
    'string.empty': 'Senha é obrigatória'
  })
});

module.exports = {
  registerSchema,
  loginSchema
};
