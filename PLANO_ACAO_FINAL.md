# Plano de Ação Final – 2ª Entrega

## O que já está pronto

- Estrutura do repositório no GitHub.
- Backend separado em pastas.
- Frontend em React/Vite.
- Documentação inicial.
- Autenticação com JWT.
- Banco SQLite com Sequelize.
- Fluxo de cadastro, login e agendamento.
- Controle de status dos agendamentos.

## O que precisa ser feito agora

### 1. Subir os arquivos desta pasta `Docs/`

Adicionar ao GitHub:

- `Docs/ENTREGA_02_POC.md`
- `Docs/CHECKLIST_TESTES_2_ENTREGA.md`
- `Docs/ROTEIRO_VIDEO_2_ENTREGA.md`
- `Docs/PLANO_ACAO_FINAL.md`

### 2. Testar o projeto

Rodar o backend:

```bash
cd Backend
npm install
cp .env.example .env
npm run dev
```

Rodar o frontend:

```bash
cd Frontend
npm install
npm run dev
```

### 3. Registrar evidências

Tirar prints de:

- GitHub com estrutura do projeto.
- Backend rodando.
- Frontend rodando.
- Login/cadastro.
- Criação de agendamento.
- Aprovação ou rejeição do prestador.

### 4. Gravar o vídeo

Usar o arquivo `ROTEIRO_VIDEO_2_ENTREGA.md`.

### 5. Atualizar o README principal

Adicionar uma seção chamada `2ª Entrega – PoC/MVP` explicando que o projeto já possui uma versão funcional para validação do fluxo principal.

## Sugestão de mensagem de commit

```text
docs: adiciona documentação da segunda entrega do projeto integrador
```
