import { connection } from "./database/connection.js";
import { RowDataPacket } from "mysql2";

type MonitorEvent = RowDataPacket & {
    id: number;
    monitor_id: number;
    parameter: string;
    old_value: string;
    new_value: string;
    created_at: Date;
};

async function EaventsFullResultByID(
    monitorId: number
): Promise<MonitorEvent[]> {
    const db = await connection;

    const [rows] = await db.execute<MonitorEvent[]>(
        `SELECT
            *
        FROM monitor_events
        WHERE monitor_id = ?
        ORDER BY created_at DESC`,
        [monitorId]
    );

    console.log(
        `Все события монитора ${monitorId}:`,
        rows
    );

    return rows;
}

export { EaventsFullResultByID };