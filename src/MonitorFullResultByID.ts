import { connection } from "./database/connection.js";

async function MonitorFullResultByID(monitorId: any) {
    const db = await connection;

    const [rows] = await db.execute(
        `SELECT
            id,
            created_at,
            data
        FROM monitor_results
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

export { MonitorFullResultByID };