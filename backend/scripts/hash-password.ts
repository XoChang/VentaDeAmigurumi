import bcrypt from "bcryptjs";

const password = process.argv[2];

if (!password) {
  console.error("Uso: npm run hash-password <tu-contraseña>");
  console.error("Ejemplo: npm run hash-password mi-contraseña-segura");
  process.exit(1);
}

const hash = await bcrypt.hash(password, 10);
console.log("\nCopia esta línea en tus variables de entorno de Railway:\n");
console.log(`ADMIN_PASSWORD_HASH=${hash}`);
console.log("");
