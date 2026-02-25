# Prisma + MySQL

## Configuração

1. Crie o banco MySQL (ex.: `salas_reuniao`).
2. No `.env` ou `.env.local` defina:

```env
DATABASE_URL="mysql://USUARIO:SENHA@localhost:3306/salas_reuniao"
```

3. Aplicar o schema no banco:

```bash
npm run db:push
```

Ou usar migrações:

```bash
npm run db:migrate
```

4. (Opcional) Abrir o Prisma Studio:

```bash
npm run db:studio
```

## Modelos

- **Sala**: nome, descricao, capacidade, ativo.
- **Reserva**: sala, usuarioLogin, usuarioNome, inicio, fim, titulo.
