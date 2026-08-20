# ATECC Teletrabalho

Sistema de registro e controle de atividades de teletrabalho para a equipe da ATECC (Assessoria Técnica de Comissões e Colegiados) — SMUL/SP.

## Pré-requisitos

- Node.js
- MySQL

## Configuração

Configure o arquivo `.env.local` na raiz do projeto:

```env
DATABASE_URL="mysql://USUARIO:SENHA@HOST:3306/atecc_teletrabalho"
VITE_ADMIN_PASSWORD="sua_senha_admin"
```

## Primeira execução

```bash
# 1. Instalar dependências
npm install

# 2. Criar as tabelas no banco
npm run db:push

# 3. Popular com dados iniciais (usuários, unidades, atividades)
npm run db:seed

# 4. Subir a aplicação
npm run dev
```

A aplicação ficará disponível em `http://localhost:3000`.

## Execuções seguintes

```bash
npm run dev
```

## Scripts disponíveis

| Script | Descrição |
|---|---|
| `npm run dev` | Sobe Vite (porta 3000) e Express (porta 3001) juntos |
| `npm run build` | Gera build de produção |
| `npm run db:push` | Aplica o schema no banco sem migrations |
| `npm run db:seed` | Popula o banco com dados iniciais |
| `npm run db:studio` | Abre o Prisma Studio para inspecionar o banco |

## Arquitetura

- **Frontend:** React + Vite + Tailwind CSS (porta 3000)
- **Backend:** Express (porta 3001) — proxy transparente via Vite em dev
- **Banco de dados:** MySQL via Prisma ORM

## Estrutura relevante

```
src/
  components/   # Componentes React
  lib/api.ts    # Helpers de fetch para a API
  types.ts      # Tipos TypeScript
  constants.ts  # Dados padrão (seed)
server/
  index.ts      # API Express com todas as rotas
prisma/
  schema.prisma # Schema do banco de dados
  seed.ts       # Script de seed
```
