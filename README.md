# GameHub

```sh
docker compose up -d --wait db
npm ci
npm run db
node --env-file=.env prisma/seed.mjs
npm run dev
```

Скопируйте `.env.example` в `.env` перед запуском.
