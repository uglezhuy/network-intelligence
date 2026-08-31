import mysql from "mysql2/promise";

const connection = mysql.createConnection({
    host: "localhost",
    port: 8889,
    user: "root",
    password: "root",
    database: "network_intelligence"
});

export { connection };