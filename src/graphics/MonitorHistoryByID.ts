import { connection } from "../database/connection.js";

async function MonitorHistoryByID(monitorId: number, days?: string | null) {
    const db = await connection;

    const [rows]: any = await db.execute(
        `SELECT
            id,
            created_at,
            data
        FROM monitor_results
        WHERE monitor_id = ?
        AND (? IS NULL OR created_at >= DATE_SUB(NOW(), INTERVAL ? DAY))
        ORDER BY created_at ASC`,   // ASC — чтобы график шёл слева направо
        [monitorId, days ? Number(days) : null, days ? Number(days) : null]
    );

    const history = rows.map((row: any) => {
        const data =
            typeof row.data === "string"
                ? JSON.parse(row.data)
                : row.data;

        return {
            id: row.id,
            time: row.created_at,
            status: data?.http?.status ?? null,
            responseTime: data?.http?.responseTime ?? null
        };
    });

    console.log("История монитора:", monitorId, history.length, "точек");

    return history;
}

export { MonitorHistoryByID };
