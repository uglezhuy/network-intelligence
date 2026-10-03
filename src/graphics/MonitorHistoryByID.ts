import { connection } from "../database/connection.js";

async function MonitorHistoryByID(monitorId: number, period?: string | null) {
    const db = await connection;

    let hours: number | null = null;

    if (period === "1h") {
        hours = 1;
    } else if (period === "6h") {
        hours = 6;
    } else if (period === "24h") {
        hours = 24;
    } else if (period === "7d") {
        hours = 24 * 7;
    }
    else if (period === "30d") {
        hours = 24 * 30;
    }



    const [rows]: any = await db.execute(
        `SELECT
            id,
            created_at,
            data
        FROM monitor_results
        WHERE monitor_id = ?
        AND (? IS NULL OR created_at >= DATE_SUB(NOW(), INTERVAL ? HOUR))
        ORDER BY created_at ASC`,
        [monitorId, hours, hours]
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
            responseTime: data?.http?.responseTime ?? null,
            bodySizeKB: data?.http?.bodySizeKB ?? null,
            fullDattaOnlyForTesting: data
        };
    });



    return history;
}

export { MonitorHistoryByID };
