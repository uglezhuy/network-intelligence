import mysql from "mysql2/promise";
import "dotenv/config";

// Параметры подключения к MySQL задаются переменными окружения
// (см. .env.example). Значения по умолчанию повторяют локальную
// конфигурацию разработки (localhost:8889, root/root).
const connection = mysql.createConnection({
    host: process.env.DB_HOST ?? "localhost",
    port: Number(process.env.DB_PORT ?? 8889),
    user: process.env.DB_USER ?? "root",
    password: process.env.DB_PASSWORD ?? "root",
    database: process.env.DB_NAME ?? "network_intelligence"
});

export { connection };