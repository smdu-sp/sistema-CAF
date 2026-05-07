# Prisma — Comandos Principais

> Os schemas ficam em `prisma/schema/`, as migrations em `prisma/migrations/`.
> O config central é `prisma.config.ts` na raiz do projeto.

---

## Geração de cliente

```bash
# Gera o cliente a partir dos schemas (roda automaticamente no build)
npx prisma generate

# ou via script do projeto
npm run db:generate
```

---

## Migrations

```bash
# Cria e aplica uma nova migration (ambiente de dev)
npx prisma migrate dev --name descricao_da_mudanca

# ou via script do projeto
npm run db:migrate

# Aplica migrations pendentes sem criar nova (produção)
npx prisma migrate deploy

# Verifica o status das migrations
npx prisma migrate status
```

---

## Reset do banco

```bash
# Apaga tudo, re-aplica todas as migrations e roda o seed
npx prisma migrate reset

# Reset sem confirmação interativa
npx prisma migrate reset --force
```

> **Atenção:** destrói todos os dados do banco.

---

## Seed

```bash
# Roda o seed manualmente (prisma/seed.ts)
npx prisma db seed

# ou via script do projeto
npm run db:seed
```

---

## Push direto (sem migration)

```bash
# Sincroniza o schema com o banco sem criar arquivo de migration
# Útil para prototipagem — não usar em produção
npx prisma db push

# ou via script do projeto
npm run db:push
```

---

## Prisma Studio

```bash
# Abre o painel visual para navegar e editar dados
npx prisma studio

# ou via script do projeto
npm run db:studio
```

---

## Introspecção (engenharia reversa)

```bash
# Gera o schema a partir do banco existente
npx prisma db pull
```

---

## Validação do schema

```bash
# Verifica se os arquivos .prisma estão corretos
npx prisma validate
```

---

## Formatação

```bash
# Formata todos os arquivos .prisma
npx prisma format
```
