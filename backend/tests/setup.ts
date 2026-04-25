import { config } from "dotenv";

config({ path: ".env.test" });

process.env.JWT_SECRET = "test-secret-that-is-at-least-32-characters-long";
process.env.ADMIN_PASSWORD_HASH =
  "$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi";
process.env.FRONTEND_URL = "http://localhost:5173";
process.env.NODE_ENV = "test";
