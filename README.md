# AmigurumiShop

Tienda web de amigurumis tejidos a crochet. Permite a clientes explorar y pedir productos por WhatsApp, y al administrador gestionar el catálogo desde un panel privado.

**Demo:** https://venta-de-amigurumi.vercel.app

## Estructura del proyecto

```
amigurumishop/
├── backend/    API REST — Node.js + Express + Prisma + PostgreSQL
├── frontend/   Tienda web — React + Vite + Tailwind
└── e2e/        Tests end-to-end — Playwright
```

## Despliegue

| Servicio | Plataforma | URL |
|---|---|---|
| Frontend | Vercel | https://venta-de-amigurumi.vercel.app |
| Backend | Render | https://ventadeamigurumi.onrender.com |
| Base de datos | Neon (PostgreSQL) | — |

## Desarrollo local

```bash
# Backend
cd backend
cp .env.example .env   # completar variables
npm install
npx prisma migrate deploy
npm run dev            # http://localhost:3001

# Frontend (en otra terminal)
cd frontend
npm install
npm run dev            # http://localhost:5173
```
