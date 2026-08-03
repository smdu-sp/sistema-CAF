# Sistema CAF

Aplicação web em Next.js para gestão de reservas de salas de reunião e avaliação de limpeza, com autenticação, permissões por módulo e integração com banco MySQL via Prisma.

## Visão geral

O projeto reúne dois fluxos principais:

- Reserva de salas: cadastro de salas, agenda, reservas, participantes e acompanhamento de status.
- Avaliação de limpeza: cadastro de categorias, critérios, salas e avaliações com notas e anexos.

Além disso, a aplicação oferece administração de usuários, coordenadorias e permissões, com autenticação baseada em NextAuth e integração opcional com LDAP.

## Stack técnico

- Next.js 15 + React 19 + TypeScript
- Tailwind CSS + shadcn/ui style components
- NextAuth para autenticação
- Prisma 7 com MySQL
- TanStack React Query para consultas no cliente
- LDAP via ldapts (autenticação e importação de usuários)

## Estrutura do projeto

- app/: rotas da aplicação, layouts e páginas por módulo
- components/: componentes reutilizáveis de interface
- lib/: helpers centrais de autenticação, Prisma e utilidades
- services/: integração com regras de negócio e permissões
- prisma/: schema, migrações, seed e configuração do Prisma
- providers/: providers globais como autenticação, tema e React Query
- public/: arquivos estáticos e uploads

## Funcionalidades principais

### 1. Autenticação e autorização

- Login com credenciais locais via NextAuth.
- Integração opcional com Active Directory/LDAP para validação de usuários.
- Sessão baseada em JWT.
- Controle de permissões por módulo e ação.

### 2. Reserva de salas

- Gestão de salas de reunião.
- Criação, edição e cancelamento de reservas.
- Visualização de agenda e reservas pessoais.
- Suporte a participantes, coordenadoria, telefone, e-mail e detalhes da reserva.

### 3. Avaliação de limpeza

- Cadastro de categorias e critérios de avaliação.
- Gestão de salas avaliadas.
- Registro de avaliações, notas, observações e arquivos anexados.

### 4. Administração

- Cadastro e manutenção de usuários.
- Gestão de coordenadorias.
- Controle de permissões e usuário desenvolvedor.

## Requisitos

- Node.js 18 ou superior
- MySQL disponível localmente ou em ambiente configurado
- Opcionalmente: servidor LDAP para autenticação integrada

## Configuração do ambiente

Crie ou ajuste um arquivo de ambiente com as variáveis abaixo:

```env
NEXT_PUBLIC_API_URL=http://localhost:3000/
AUTH_SECRET=exemplo-secreto-ficticio
NEXTAUTH_URL=http://localhost:3000

DATABASE_URL="mysql://usuario-criado:senha-criada@localhost:3306/banco-ficticio"
DATABASE_HOST=localhost
DATABASE_USER=usuario-criado
DATABASE_PASSWORD=senha-criada
DATABASE_NAME=banco-criado
ENVIRONMENT=local
```

## Instalação

```bash
npm install
```

## Banco de dados

Gere o cliente do Prisma e aplique o schema:

```bash
npm run db:generate
npm run db:push
```

Se quiser popular dados iniciais:

```bash
npm run db:seed
```

## Executando em desenvolvimento

```bash
npm run dev
```

A aplicação ficará disponível em http://localhost:3000.

## Build e execução em produção

```bash
npm run build
npm start
```

## Scripts disponíveis

- npm run dev: inicia o servidor de desenvolvimento
- npm run build: gera o Prisma Client e cria o build do Next.js
- npm run start: sobe a aplicação em modo produção
- npm run lint: executa a checagem de lint do Next.js
- npm run db:generate: gera o cliente Prisma
- npm run db:push: aplica mudanças no banco
- npm run db:migrate: cria uma migração interativa do Prisma
- npm run db:studio: abre o Prisma Studio
- npm run db:seed: executa o seed inicial

## Arquitetura de dados

O schema do Prisma está dividido em módulos:

- prisma/schema/schema.prisma: modelos base como coordenadorias, usuários, permissões e relações principais
- prisma/schema/reserva_sala.prisma: salas, reservas, participantes e detalhes de layout
- prisma/schema/avaliacao_limpeza.prisma: categorias, critérios, avaliações e arquivos