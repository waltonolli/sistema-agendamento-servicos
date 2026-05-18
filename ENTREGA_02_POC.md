# 2ª Entrega – Projeto Integrador

## Sistema de Agendamento de Serviços

### 1. Objetivo da 2ª entrega

A segunda entrega tem como objetivo apresentar a evolução prática do projeto por meio de uma PoC/MVP funcional, demonstrando a viabilidade técnica do sistema de agendamento de serviços.

O projeto desenvolvido busca atender empresas como salões, barbearias e clínicas, permitindo que clientes solicitem agendamentos e que prestadores de serviço aprovem, rejeitem ou acompanhem essas solicitações.

---

### 2. Problema identificado

Muitos pequenos negócios ainda realizam agendamentos de forma manual, por mensagens, ligações ou anotações, o que pode gerar conflitos de horário, perda de informações e dificuldade no acompanhamento das solicitações.

---

### 3. Proposta de solução

A solução proposta é um sistema web de agendamento com dois perfis principais:

- Cliente: realiza cadastro, login, escolhe prestador, serviço, data e horário.
- Prestador: acessa sua agenda, visualiza solicitações pendentes e aprova ou rejeita agendamentos.

Cada agendamento possui status para controle do fluxo: pendente, aprovado, rejeitado ou cancelado.

---

### 4. Escopo da PoC/MVP

A PoC não tem como objetivo entregar um sistema comercial completo. O foco é validar o fluxo principal do projeto:

1. Cadastro de usuários.
2. Login com autenticação.
3. Diferenciação entre cliente e prestador.
4. Criação de solicitação de agendamento.
5. Listagem de agendamentos.
6. Aprovação ou rejeição pelo prestador.
7. Controle de status do agendamento.

---

### 5. Tecnologias utilizadas

- Frontend: React + Vite
- Backend: Node.js + Express
- Banco de dados: SQLite
- ORM: Sequelize
- Autenticação: JWT
- Validação de dados: Joi
- Controle de versão: Git e GitHub

---

### 6. Estrutura do repositório

```text
sistema-agendamento-servicos/
├── Backend/
│   ├── Controllers/
│   ├── Middleware/
│   ├── Models/
│   ├── Routes/
│   ├── validators/
│   ├── .env.example
│   ├── package.json
│   └── server.js
├── Frontend/
│   ├── src/
│   ├── .env.example
│   ├── package.json
│   └── vite.config.js
├── Docs/
│   └── README.md
└── README.md
```

---

### 7. Funcionalidades implementadas

| Funcionalidade | Status |
|---|---|
| Cadastro de cliente | Implementado |
| Cadastro de prestador | Implementado |
| Login com JWT | Implementado |
| Separação de perfis | Implementado |
| Listagem de prestadores | Implementado |
| Criação de agendamento | Implementado |
| Listagem de agendamentos | Implementado |
| Aprovação de agendamento | Implementado |
| Rejeição de agendamento | Implementado |
| Cancelamento de agendamento | Implementado |
| Histórico por cliente/prestador | Implementado |

---

### 8. Como executar o projeto

#### Backend

```bash
cd Backend
npm install
cp .env.example .env
npm run dev
```

Caso não utilize o comando `cp`, crie manualmente um arquivo `.env` dentro da pasta `Backend` com o conteúdo:

```env
JWT_SECRET=sua_chave_secreta_aqui
DB_DIALECT=sqlite
DB_STORAGE=./data/agenda.sqlite
PORT=5000
```

#### Frontend

```bash
cd Frontend
npm install
npm run dev
```

Se necessário, crie um arquivo `.env` dentro da pasta `Frontend`:

```env
VITE_API_URL=http://localhost:5000
```

---

### 9. Validação da PoC

A validação da PoC deve ser feita pelo seguinte roteiro:

1. Criar um usuário do tipo prestador.
2. Criar um usuário do tipo cliente.
3. Entrar como cliente.
4. Selecionar o prestador.
5. Escolher serviço, data e horário.
6. Criar o agendamento.
7. Entrar como prestador.
8. Visualizar solicitação pendente.
9. Aprovar ou rejeitar o agendamento.
10. Conferir se o status foi atualizado.

---

### 10. Evidências sugeridas para a entrega

Inserir prints das seguintes telas:

- Tela inicial ou login.
- Cadastro de cliente.
- Cadastro de prestador.
- Tela de solicitação de agendamento.
- Lista de agendamentos do cliente.
- Tela do prestador com solicitação pendente.
- Agendamento aprovado/rejeitado.

---

### 11. Limitações da versão atual

A versão atual valida o funcionamento principal do sistema, mas ainda possui pontos que podem ser evoluídos:

- Interface pode ser refinada visualmente.
- Não há envio automático de notificações.
- Não há integração com calendário externo.
- Não há confirmação por e-mail ou WhatsApp.
- O banco SQLite atende bem à PoC, mas poderia ser substituído por PostgreSQL/MySQL em produção.
- Não há deploy público configurado.
- Os testes automatizados ainda podem ser adicionados.

---

### 12. Melhorias futuras

- Criar painel administrativo.
- Implementar disponibilidade por prestador.
- Bloquear horários já ocupados.
- Criar notificações automáticas.
- Adicionar recuperação de senha.
- Criar testes unitários e de integração.
- Publicar o sistema em ambiente online.
- Melhorar responsividade para dispositivos móveis.

---

### 13. Conclusão

A PoC desenvolvida demonstra que a proposta do sistema é tecnicamente viável. O projeto já possui estrutura de backend, frontend, autenticação, banco de dados e fluxo principal de agendamento.

Com isso, a segunda etapa comprova que o sistema pode evoluir para uma solução mais completa, com melhorias futuras voltadas para usabilidade, automação e implantação em ambiente real.
