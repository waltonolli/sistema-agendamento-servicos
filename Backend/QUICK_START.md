# 🚀 QUICK START - PRIMEIROS PASSOS

Comece por aqui! Este é o guia mais rápido para corrigir os problemas críticos.

---

## ⏱️ TEMPO: 30 MINUTOS

### PASSO 1: PREPARAR AMBIENTE (5 min)

```bash
# 1. Abra terminal na pasta Backend
cd Backend

# 2. Instale as dependências essenciais
npm install dotenv joi express-rate-limit
```

---

### PASSO 2: CRIAR .env (5 min)

**Copie o arquivo `Backend/.env.example` e renomeie para `.env`**

Ou execute no terminal:
```bash
# Windows (PowerShell)
copy .env.example .env

# Mac/Linux
cp .env.example .env
```

**Agora edite o arquivo `.env` que foi criado:**

```env
PORT=5000
NODE_ENV=development
JWT_SECRET=your_super_secret_key_here_minimum_32_chars_12345678901234567890
DB_DIALECT=sqlite
DB_STORAGE=./data/agenda.sqlite
DB_NAME=agenda_db
```

---

### PASSO 3: ATUALIZAR server.js (5 min)

**Arquivo: `Backend/server.js`**

Adicione na PRIMEIRA linha:
```javascript
require('dotenv').config();
```

Resultado:
```javascript
require('dotenv').config();  // ← ADICIONE ISTO AQUI

const path = require('path');
const express = require('express');
const cors = require('cors');
// ... resto do código
```

---

### PASSO 4: IMPLEMENTAR cancelBooking (5 min)

**Arquivo: `Backend/Controllers/bookingController.js`**

Adicione ao FINAL do arquivo:
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

### PASSO 5: TESTAR (5 min)

```bash
# Execute o servidor
npm start
```

**Você deve ver:**
```
✅ Conexão com banco de dados estabelecida!
✅ Tabelas sincronizadas com o banco de dados
🚀 Servidor rodando na porta 5000
```

---

## ✅ VERIFICAÇÃO RÁPIDA

Teste se está funcionando:

```bash
# Terminal 1: Inicie o servidor
npm start

# Terminal 2: Teste a API com curl
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Teste",
    "email": "teste@test.com",
    "password": "123456"
  }'

# Esperado:
# {"message":"Usuário registrado com sucesso!","user":{"id":1,"name":"Teste","email":"teste@test.com"}}
```

Se ver o resultado acima: ✅ **Tudo funcionando!**

---

## 🎉 PRÓXIMOS PASSOS

Depois de completar acima, faça em ordem:

1. **Validação Robusta** (15 min)
   - Ver [GUIA_PRATICO_CORRECOES.md](../GUIA_PRATICO_CORRECOES.md) - Seção 3

2. **Rate Limiting** (10 min)
   - Ver [GUIA_PRATICO_CORRECOES.md](../GUIA_PRATICO_CORRECOES.md) - Seção 4

3. **Configurar Frontend** (10 min)
   - Ver [GUIA_PRATICO_CORRECOES.md](../GUIA_PRATICO_CORRECOES.md) - Seção 5

4. **ESLint** (10 min)
   - Ver [GUIA_PRATICO_CORRECOES.md](../GUIA_PRATICO_CORRECOES.md) - Seção 6

5. **Logger Winston** (20 min)
   - Ver [GUIA_PRATICO_CORRECOES.md](../GUIA_PRATICO_CORRECOES.md) - Seção 7

---

## 🔥 PROBLEMAS COMUNS

### Erro: "Cannot find module 'dotenv'"
```bash
npm install dotenv
npm start
```

### Erro: "JWT_SECRET is required"
- Abra `.env`
- Adicione: `JWT_SECRET=sua_chave_super_secreta_aqui`
- Salve e reinicie com `npm start`

### Porta 5000 já em uso
```bash
# Mude em .env:
PORT=3000
npm start
```

### Database locked (SQLite)
```bash
# Delete o arquivo de banco e deixe recriarse:
del data/agenda.sqlite
npm start
```

---

## 📊 CHECKLIST DESTA SESSÃO

- [ ] Instalou `dotenv`, `joi`, `express-rate-limit`
- [ ] Criou arquivo `.env`
- [ ] Adicionou `require('dotenv').config()` em `server.js`
- [ ] Implementou função `cancelBooking`
- [ ] Testou com `npm start`
- [ ] Testou com curl/Postman
- [ ] Git commit: `git add . && git commit -m "fix: security and validation improvements"`

---

## 🚀 VOCÊ COMPLETOU!

Você completou os 5 problemas **CRÍTICOS** em 30 minutos! 🎉

**Score melhorou de:** 5.5/10 → 6.5/10

**Próxima meta:** Chegar a 8/10 em 1 semana

Siga o [PLANO_IMPLEMENTACAO.md](../PLANO_IMPLEMENTACAO.md) para continuar!

---

## 📞 PRECISA DE AJUDA?

1. Verifique [ANALISE_PADROES_INDUSTRIA.md](../ANALISE_PADROES_INDUSTRIA.md) para entender os problemas
2. Consulte [GUIA_PRATICO_CORRECOES.md](../GUIA_PRATICO_CORRECOES.md) para código detalhado
3. Leia [README_RESUMO.md](../README_RESUMO.md) para visão geral

---

**Boa sorte! Você está no caminho certo! 💪**
