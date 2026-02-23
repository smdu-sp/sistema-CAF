# Reserva de Salas de Reunião

App Next.js fullstack para reserva de salas. **Não há dependência das pastas base-frontend ou base-backend**: este projeto é autossuficiente (componentes, auth e UI próprios).

## Requisitos

- Node 18+
- Uma API de autenticação/usuários compatível (login, refresh, usuarios) — a URL é configurada por variável de ambiente, não por caminho de pasta.

## Configuração

1. Copie `example.env` para `.env.local`.
2. Defina `AUTH_SECRET` (ex.: `openssl rand -base64 32`).
3. Ajuste `NEXT_PUBLIC_API_URL` para a URL base da API (ex.: `http://localhost:3000/`). Pode ser qualquer servidor que exponha os endpoints de login/refresh/usuários; não é necessário estar na pasta base-backend.

## Desenvolvimento

```bash
npm install --legacy-peer-deps
npm run dev
```

## Build

```bash
npm run build
npm start
```
