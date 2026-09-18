import { connection } from "./database/connection.js";
import { runMonitor } from "./monitor.js";

async function startMonitorID(monitorId: number) {
    const db = await connection;

    await db.execute(
        `UPDATE monitors
         SET status = 'active'
         WHERE id = ? AND status = 'stopped'`,
        [monitorId]
    );

    const [rows]: any = await db.execute(
        `SELECT id, target, interval_minutes, type, telegram_user_id
         FROM monitors
         WHERE id = ?`,
        [monitorId]
    );

    if (rows.length === 0) {
        console.log(`Monitor ${monitorId} не найден`);
        return;
    }

    const monitor = rows[0];

    console.log(
        "Запускаем монитор:",
        monitor.id,
        monitor.target,
        monitor.interval_minutes,
        monitor.type
    );

    runMonitor(
        monitor.id,
        monitor.target,
        monitor.interval_minutes,
        monitor.type,
        monitor.telegram_user_id ?? undefined
    );
}

export { startMonitorID };
