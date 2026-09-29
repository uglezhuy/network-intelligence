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
        `SELECT id, target, interval_minutes, type, platform, telegram_user_id, send_monitor_notificationsTG, send_event_notificationsTG, send_monitor_notificationsMAX, send_event_notificationsMAX
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

        monitor.platform,

        monitor.send_monitor_notificationsTG,
        monitor.send_event_notificationsTG,

        monitor.send_monitor_notificationsMAX,
        monitor.send_event_notificationsMAX,

        monitor.telegram_user_id ?? undefined
    );
}

export { startMonitorID };
