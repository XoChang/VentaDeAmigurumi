import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import helmet from "helmet";
import { productsPublicRouter } from "./interface/routes/products.public.routes";
import { productsAdminRouter } from "./interface/routes/products.admin.routes";
import { authRouter } from "./interface/routes/auth.routes";
import { configRouter } from "./interface/routes/config.routes";

const app = express();

const ALLOWED_ORIGINS = (process.env.FRONTEND_URL ?? "http://localhost:5173")
  .split(",")
  .map((o) => o.trim());

app.use(helmet());
app.use(
  cors({
    origin: (origin, cb) => {
      if (!origin || ALLOWED_ORIGINS.some((o) => origin.startsWith(o))) {
        cb(null, true);
      } else {
        cb(new Error(`CORS: origin ${origin} not allowed`));
      }
    },
    credentials: true,
  })
);
app.use(express.json());

app.get("/health", (_req, res) => res.json({ status: "ok" }));

app.use("/api/auth", authRouter);
app.use("/api/products", productsPublicRouter);
app.use("/api/admin/products", productsAdminRouter);
app.use("/api/config", configRouter);

app.use((_req, res) => {
  res.status(404).json({ error: "Not found" });
});

app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error({ msg: "Unhandled error", error: err.message });
  res.status(500).json({ error: "Internal server error" });
});

export default app;
