import app from "./app";

const PORT = process.env.PORT ?? 3001;

app.listen(PORT, () => {
  console.log(`AmigurumiShop API running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV ?? "development"}`);
});
