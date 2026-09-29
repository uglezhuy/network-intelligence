import { connection } from "./database/connection.js";

async function EaventsFullResultByID(monitorId: any) {
    const db = await connection;

    const [rows] = await db.execute(
        `SELECT
            *
        FROM monitor_events
        WHERE monitor_id = ?
        ORDER BY created_at DESC`,
        [monitorId]
    );

    console.log(
        `Все сканы монитора ${monitorId}:`,
        rows
    );

    return rows;
}

export { EaventsFullResultByID };