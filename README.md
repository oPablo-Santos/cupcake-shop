# Cupcake Shop (MVP)

Monólito Next.js + TypeScript + Prisma + PostgreSQL com camadas `1-domain`, `2-business`, `3-controller` e `4-framework`.

## Pré-requisitos

- Node.js 20+
- PostgreSQL local (ou URL compatível)

## Configuração

```bash
cp .env.example .env
# Defina DATABASE_URL, ADMIN_PASSWORD (≥12 chars) e ADMIN_SESSION_SECRET (≥16 chars, aleatório)
npm install
npm run db:generate
npm run db:push
npm run db:seed
npm run dev
```

**Catálogo e admin dependem de PostgreSQL ativo.** Sem banco ou sem `npm run db:seed`, a home pode exibir mensagem amigável e o admin não terá produtos/pedidos para validar o fluxo completo.

Abra [http://localhost:3456](http://localhost:3456). Admin: [http://localhost:3456/admin/login](http://localhost:3456/admin/login) com a senha definida em `ADMIN_PASSWORD` (exemplo local: `cupcake-admin-dev`).

**PostgreSQL via Docker (opcional):**

```bash
docker run -d --name cupcake-pg \
  -e POSTGRES_USER=postgres -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=cupcake_shop \
  -p 5432:5432 postgres:16-alpine
npm run db:push && npm run db:seed
```

## Scripts

| Comando | Descrição |
|---------|-----------|
| `npm run dev` | Servidor de desenvolvimento |
| `npm run build` | Build de produção |
| `npm run typecheck` | Verificação TypeScript |
| `npm run lint` | ESLint (somente código-fonte) |
| `npm run test` | Testes unitários (Jest) |
| `npm run db:migrate` | Migration interativa (alternativa ao `db:push`) |
| `npm run db:migrate:deploy` | Aplica migrations (produção) |
| `npm run db:seed` | Popula produtos de exemplo |

## Escopo do MVP

- Catálogo público, carrinho (localStorage), checkout com recálculo de preços no servidor
- Admin com login por senha (cookie assinado), CRUD de produtos, desativação em vez de delete destrutivo
- Listagem/detalhe de pedidos com atualização de status

## Dados pessoais (MVP)

Pedidos armazenam nome, e-mail, telefone e endereço apenas para processamento e acompanhamento do pedido neste ambiente de demonstração. Não há política formal de retenção ou exclusão automatizada; em produção real seria necessário base legal, prazo de retenção e fluxo de exclusão. O painel admin exibe e-mail e telefone parcialmente mascarados.

## Deploy (Vercel + Neon)

### 1. Repositório Git

```bash
git init
git add .
git commit -m "Prepare Cupcake Shop for Vercel deploy"
git remote add origin <url-do-repo>
git push -u origin main
```

### 2. Banco Neon

1. Crie um projeto em [neon.tech](https://neon.tech).
2. Copie duas connection strings:
   - **Pooled** (host com `-pooler`) → `DATABASE_URL`
   - **Direct** (sem pooler) → `DIRECT_URL`
3. Ambas com `?sslmode=require` se o Neon não incluir SSL na URL.

### 3. Projeto na Vercel

1. Importe o repositório em [vercel.com/new](https://vercel.com/new).
2. Framework: **Next.js** (detectado automaticamente).
3. **Environment variables** (Production + Preview):

| Variável | Valor |
|----------|--------|
| `DATABASE_URL` | Neon pooled |
| `DIRECT_URL` | Neon direct |
| `ADMIN_PASSWORD` | Senha forte (≥ 12 chars, não use exemplos do README) |
| `ADMIN_SESSION_SECRET` | Segredo aleatório (≥ 16 chars), ex.: `openssl rand -base64 24` |
| `NEXT_PUBLIC_SITE_URL` | `https://<seu-projeto>.vercel.app` |

4. Deploy. O build roda `prisma migrate deploy` e depois `next build`.

### 4. Seed (uma vez)

O seed **apaga pedidos e produtos** — rode só na primeira carga ou em ambiente descartável.

Com as URLs Neon no `.env` local (use **direct** em `DIRECT_URL`):

```bash
npm run db:seed
```

Ou, a partir da máquina local apontando só `DATABASE_URL`/`DIRECT_URL` para o Neon.

### 5. Pós-deploy

- Abra a URL pública → catálogo com produtos.
- `/admin/login` com a senha definida em `ADMIN_PASSWORD`.
- Se o catálogo estiver vazio, o seed não foi executado ou falhou a conexão.

### CI (GitHub Actions)

Workflow em `.github/workflows/ci.yml`: Postgres de serviço, `migrate deploy`, lint, typecheck, testes e `build:app`.

### Scripts úteis

| Comando | Uso |
|---------|-----|
| `npm run build` | Produção (Vercel): migrations + Next |
| `npm run build:app` | Só Next (CI após migrate) |
| `npm run db:migrate:deploy` | Aplicar migrations manualmente |
| `npm run db:migrate` | Nova migration em dev (`migrate dev`) |
