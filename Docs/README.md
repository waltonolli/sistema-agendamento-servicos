# Sistema de Agendamento de Serviços

## Visão Geral

Projeto integrador do grupo 22 para desenvolvimento de um sistema de agendamento de serviços voltado para empresas como barbearias, salões e clínicas.

O sistema diferencia claramente dois perfis de usuário:
- `cliente`: escolhe serviço, seleciona prestador e envia solicitação de reserva.
- `prestador`: visualiza seu calendário, recebe solicitações e aprova ou rejeita cada agendamento.

Cada prestador possui um calendário próprio e os agendamentos são controlados por status: `pendente`, `aprovado`, `rejeitado` e `cancelado`.

## Tecnologias

- Backend: Node.js, Express, Sequelize, SQLite
- Frontend: React, Vite
- Autenticação: JWT
- Validação: Joi
- Rate limit: express-rate-limit

## Estrutura do Projeto

- `Backend/`: API REST, autenticação, controle de agendamentos
- `Frontend/`: interface React para login, cadastro, agendamentos e histórico
- `Docs/`: documentação do projeto
- `Database/`: arquivos ou scripts do banco de dados, se houver

## Membros do Grupo

- Andre Luis Silva de Andrade
- Filipi Jose do Monte Silva
- Luiz Antonio de Jesus Lima Ferreira
- Paulo Rodriguez Suarez Gomes
- Rafael Oliveira Marques
- Walkyria Rita Tonolli

## Funcionalidades Principais

- Cadastro de usuários como `cliente` ou `prestador`
- Login com JWT e proteção de rotas
- Seleção de serviço e prestador pelo cliente
- Agendamento de data e hora no calendário do prestador
- Triagem de solicitações pendentes pelo prestador
- Aprovação ou rejeição de reservas
- Visualização de status do agendamento
- Histórico de agendamentos por cliente e por prestador

## Como Executar

### Backend

1. Acesse a pasta do backend:
   ```bash
   cd Backend
   ```
2. Instale as dependências:
   ```bash
   npm install
   ```
3. Crie um arquivo `.env` com as variáveis mínimas:
   ```env
   JWT_SECRET=sua_chave_secreta_aqui
   DB_DIALECT=sqlite
   DB_STORAGE=./data/agenda.sqlite
   ```
4. Inicie o servidor:
   ```bash
   npm run dev
   ```

O backend usa Sequelize e sincroniza as tabelas automaticamente no primeiro acesso.

### Frontend

1. Acesse a pasta do frontend:
   ```bash
   cd Frontend
   ```
2. Instale as dependências:
   ```bash
   npm install
   ```
3. Inicie a aplicação:
   ```bash
   npm run dev
   ```

A aplicação será servida pelo Vite e deve se conectar ao backend usando a variável `VITE_API_URL` ou `http://localhost:5000` por padrão.

## Endpoints Principais

### Autenticação
- `POST /api/auth/register` — registra cliente ou prestador
- `POST /api/auth/login` — autentica e retorna token JWT
- `GET /api/auth/providers` — lista prestadores disponíveis

### Agendamentos
- `POST /api/bookings` — cria agendamento (cliente)
- `GET /api/bookings` — lista agendamentos do cliente ou prestador
- `GET /api/bookings/summary` — resumo de agendamentos
- `GET /api/bookings/:id` — detalhes do agendamento
- `PUT /api/bookings/:id` — atualiza agendamento pendente (cliente)
- `PUT /api/bookings/:id/approve` — aprova agendamento (prestador)
- `PUT /api/bookings/:id/reject` — rejeita agendamento (prestador)
- `DELETE /api/bookings/:id` — cancela agendamento

## Fluxo de Uso

### Cliente
1. Registra conta como `cliente`
2. Faz login
3. Seleciona um prestador de serviço
4. Escolhe serviço, data e hora
5. Envia solicitação de agendamento
6. Aguarda aprovação do prestador

### Prestador
1. Registra conta como `prestador`
2. Faz login
3. Visualiza agenda e solicitações pendentes
4. Aprova ou rejeita cada agendamento

## Observações

- O fluxo foi desenvolvido para suportar múltiplos prestadores com calendários separados.
- O estado do agendamento informa claramente se a reserva está aguardando aprovação ou já foi processada.
- A comunicação entre frontend e backend utiliza token JWT para manter a sessão segura.

## Contato

Este documento acompanha a entrega do projeto no Git e mantém a documentação de uso e implantação organizada.
