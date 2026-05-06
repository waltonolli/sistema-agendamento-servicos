# 🔧 GUIA PRÁTICO DE CORREÇÕES

Este documento contém exemplos prontos para corrigir os principais problemas identificados.

---

## 1️⃣ CONFIGURAR VARIÁVEIS DE AMBIENTE

### 1.1 Instale dotenv
```bash
cd Backend
npm install dotenv
```

### 1.2 Crie `/Backend/.env`
```env
# Servidor
PORT=5000
NODE_ENV=development

# JWT
JWT_SECRET=sua_chave_super_secreta_e_complexa_aqui_minimo_32_caracteres

# Banco de Dados
DB_DIALECT=sqlite
DB_STORAGE=./data/agenda.sqlite
DB_NAME=agenda_db

# Para MySQL/PostgreSQL (descomente se precisar)
# DB_HOST=localhost
# DB_PORT=3306
# DB_USER=seu_usuario
# DB_PASS=sua_senha
```

### 1.3 Atualize `/Backend/server.js` (primeiras linhas)
```javascript
require('dotenv').config(); // Adicione isto no início

const path = require('path');
const express = require('express');
const cors = require('cors');

// Validar variáveis obrigatórias
if (!process.env.JWT_SECRET) {
  throw new Error('JWT_SECRET não definido em .env');
}

const app = express();
// ... resto do código
```

### 1.4 Atualize `/Backend/Models/Index.js`
```javascript
const { Sequelize } = require('sequelize');
const path = require('path');

const dbDialect = process.env.DB_DIALECT || 'sqlite';

const sequelizeOptions = {
  dialect: dbDialect,
  logging: false,
};

if (dbDialect === 'sqlite') {
  sequelizeOptions.storage = process.env.DB_STORAGE || 
    path.join(__dirname, '..', 'data', 'agenda.sqlite');
} else {
  sequelizeOptions.host = process.env.DB_HOST;
  sequelizeOptions.port = process.env.DB_PORT;
  sequelizeOptions.username = process.env.DB_USER;
  sequelizeOptions.password = process.env.DB_PASS;
}

const sequelize = new Sequelize(
  process.env.DB_NAME || 'agenda_db',
  process.env.DB_USER,
  process.env.DB_PASS,
  sequelizeOptions
);

sequelize.authenticate()
  .then(() => console.log('✅ Conexão com banco de dados estabelecida!'))
  .catch(err => console.error('❌ Erro ao conectar:', err));

module.exports = sequelize;
```

### 1.5 Atualize `/Backend/Controllers/authController.js`
```javascript
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../Models/User');

const jwtSecret = process.env.JWT_SECRET; // Remova o || 'supersecret_senha'

exports.register = async (req, res) => {
  // ... resto do código mantém igual
};

exports.login = async (req, res) => {
  // ... resto do código mantém igual
};
```

### 1.6 Atualize `/Backend/Middleware/authMiddleware.js`
```javascript
const jwt = require('jsonwebtoken');

const jwtSecret = process.env.JWT_SECRET; // Remova o || 'supersecret_senha'

module.exports = (req, res, next) => {
  // ... resto do código mantém igual
};
```

---

## 2️⃣ IMPLEMENTAR FUNÇÃO cancelBooking

### 2.1 Complete `/Backend/Controllers/bookingController.js`
Adicione esta função ao final do arquivo:

```javascript
exports.cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findOne({ 
      where: { id: req.params.id, userId: req.user.id } 
    });
    
    if (!booking) {
      return res.status(404).json({ error: 'Agendamento não encontrado.' });
    }

    await booking.destroy();
    res.json({ message: 'Agendamento cancelado com sucesso!' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao cancelar agendamento' });
  }
};
```

---

## 3️⃣ ADICIONAR VALIDAÇÃO COM JOI

### 3.1 Instale joi
```bash
cd Backend
npm install joi
```

### 3.2 Crie `/Backend/validators/authValidator.js`
```javascript
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
  email: Joi.string().email().required(),
  password: Joi.string().required()
});

module.exports = {
  registerSchema,
  loginSchema
};
```

### 3.3 Crie `/Backend/validators/bookingValidator.js`
```javascript
const Joi = require('joi');

const createBookingSchema = Joi.object({
  service: Joi.string().min(3).max(100).required().messages({
    'string.empty': 'Serviço é obrigatório',
    'string.min': 'Serviço deve ter no mínimo 3 caracteres'
  }),
  date: Joi.date().iso().required().messages({
    'date.base': 'Data deve ser válida (YYYY-MM-DD)',
    'date.required': 'Data é obrigatória'
  }),
  time: Joi.string().pattern(/^([0-1][0-9]|2[0-3]):[0-5][0-9]$/).required().messages({
    'string.pattern.base': 'Hora deve estar em formato HH:MM',
    'string.required': 'Hora é obrigatória'
  })
});

module.exports = {
  createBookingSchema
};
```

### 3.4 Atualize `/Backend/Controllers/authController.js`
```javascript
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../Models/User');
const { registerSchema, loginSchema } = require('../validators/authValidator');

const jwtSecret = process.env.JWT_SECRET;

exports.register = async (req, res) => {
  // Validar com joi
  const { error, value } = registerSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }

  const { name, email, password } = value;

  try {
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(409).json({ error: 'Este email já está cadastrado.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashedPassword });
    res.status(201).json({
      message: 'Usuário registrado com sucesso!',
      user: { id: user.id, name: user.name, email: user.email },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao registrar usuário' });
  }
};

exports.login = async (req, res) => {
  // Validar com joi
  const { error, value } = loginSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }

  const { email, password } = value;

  try {
    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(404).json({ error: 'Usuário não encontrado' });

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) return res.status(401).json({ error: 'Senha inválida' });

    const token = jwt.sign({ id: user.id, name: user.name }, jwtSecret, { expiresIn: '1h' });
    res.json({ 
      message: 'Login realizado com sucesso!', 
      token, 
      user: { id: user.id, name: user.name, email: user.email } 
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro no login' });
  }
};
```

---

## 4️⃣ ADICIONAR RATE LIMITING

### 4.1 Instale express-rate-limit
```bash
cd Backend
npm install express-rate-limit
```

### 4.2 Crie `/Backend/middleware/rateLimitMiddleware.js`
```javascript
const rateLimit = require('express-rate-limit');

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 5, // máximo 5 tentativas
  message: 'Muitas tentativas de login. Tente novamente em 15 minutos.',
  standardHeaders: true,
  legacyHeaders: false,
});

const registerLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hora
  max: 3, // máximo 3 registros por hora
  message: 'Muitos registros realizados. Tente novamente mais tarde.',
});

module.exports = {
  loginLimiter,
  registerLimiter
};
```

### 4.3 Atualize `/Backend/Routes/auth.js`
```javascript
const express = require('express');
const router = express.Router();
const { register, login } = require('../Controllers/authController');
const { loginLimiter, registerLimiter } = require('../Middleware/rateLimitMiddleware');

router.post('/register', registerLimiter, register);
router.post('/login', loginLimiter, login);

module.exports = router;
```

---

## 5️⃣ CONFIGURAR FRONTEND COM VARIÁVEIS DE AMBIENTE

### 5.1 Crie `/Frontend/.env.local`
```env
VITE_API_URL=http://localhost:5000
```

### 5.2 Crie `/Frontend/.env.production`
```env
VITE_API_URL=https://seu-dominio.com
```

### 5.3 Crie `/Frontend/src/config/api.js`
```javascript
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export const API_ENDPOINTS = {
  AUTH_LOGIN: `${API_URL}/api/auth/login`,
  AUTH_REGISTER: `${API_URL}/api/auth/register`,
  BOOKINGS_CREATE: `${API_URL}/api/bookings`,
  BOOKINGS_GET: `${API_URL}/api/bookings`,
  BOOKINGS_SUMMARY: `${API_URL}/api/bookings/summary`,
};

export default API_URL;
```

### 5.4 Atualize `/Frontend/src/components/loginForm.jsx`
```javascript
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

  // ... resto do componente
}

export default LoginForm;
```

---

## 6️⃣ ADICIONAR ESLINT

### 6.1 Instale eslint
```bash
cd Backend
npm install --save-dev eslint
npx eslint --init
```

### 6.2 Crie `/Backend/.eslintrc.json`
```json
{
  "env": {
    "node": true,
    "es2021": true
  },
  "extends": "eslint:recommended",
  "parserOptions": {
    "ecmaVersion": "latest"
  },
  "rules": {
    "no-console": "warn",
    "no-unused-vars": "warn",
    "semi": ["error", "always"],
    "quotes": ["error", "single"],
    "indent": ["error", 2]
  }
}
```

### 6.3 Configure no `package.json`
```json
{
  "scripts": {
    "start": "node server.js",
    "dev": "node server.js",
    "lint": "eslint ."
  }
}
```

---

## 7️⃣ ADICIONAR LOGGER WINSTON

### 7.1 Instale winston
```bash
cd Backend
npm install winston
```

### 7.2 Crie `/Backend/config/logger.js`
```javascript
const winston = require('winston');

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/combined.log' }),
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.printf(({ level, message, timestamp }) => {
          return `${timestamp} [${level}]: ${message}`;
        })
      )
    })
  ]
});

module.exports = logger;
```

### 7.3 Use no `server.js`
```javascript
const logger = require('./config/logger');

sequelize.sync({ alter: true })
  .then(() => logger.info('Tabelas sincronizadas com o banco de dados'))
  .catch(err => logger.error('Erro ao sincronizar tabelas:', err));

app.listen(PORT, () => logger.info(`Servidor rodando na porta ${PORT}`));
```

---

## 📦 INSTALAÇÕES RÁPIDAS

Execute tudo de uma vez no diretório `Backend`:
```bash
npm install dotenv joi express-rate-limit winston
npm install --save-dev eslint
```

---

## ✅ PRÓXIMOS PASSOS

1. ✅ Implemente as correções acima em ordem
2. ✅ Teste cada alteração
3. ✅ Commit das mudanças no Git
4. ✅ Considere adicionar testes com Jest
5. ✅ Configure CI/CD pipeline

---
