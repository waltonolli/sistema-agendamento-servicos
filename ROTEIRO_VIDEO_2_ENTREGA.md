# Roteiro do Vídeo – 2ª Entrega

Duração sugerida: 1 a 3 minutos.

## Abertura

Olá, este é o projeto integrador do grupo 22. O sistema desenvolvido é uma aplicação web para agendamento de serviços, voltada para empresas como salões, barbearias e clínicas.

## Problema

O problema identificado é que muitos negócios ainda controlam agendamentos manualmente, o que pode gerar conflito de horários, perda de informações e dificuldade de acompanhamento.

## Solução

A solução proposta permite que clientes solicitem agendamentos e que prestadores de serviço visualizem essas solicitações, aprovando ou rejeitando cada uma delas.

## Tecnologias

O backend foi desenvolvido com Node.js, Express, Sequelize e SQLite. O frontend utiliza React com Vite. A autenticação é feita com JWT, e o código está versionado no GitHub.

## Demonstração

Agora vamos demonstrar o fluxo principal da PoC.

Primeiro, acessamos o sistema e fazemos login. O cliente pode selecionar um prestador, escolher um serviço, uma data e um horário. Depois disso, o agendamento é criado com o status pendente.

Em seguida, acessamos o sistema como prestador. O prestador consegue visualizar as solicitações recebidas e decidir se deseja aprovar ou rejeitar o agendamento.

Após a ação do prestador, o status do agendamento é atualizado no sistema.

## Conclusão

Com essa PoC, conseguimos validar a viabilidade técnica do projeto. O sistema já possui autenticação, separação de perfis, cadastro, criação de agendamentos e controle de status. Como melhorias futuras, o projeto pode receber notificações, integração com calendário, melhoria visual e deploy em ambiente online.
