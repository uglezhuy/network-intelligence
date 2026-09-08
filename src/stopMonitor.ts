import { connection } from "./database/connection.js";
import { tgPrintStopMonitor } from "./telegram/tgPrintResultMonitor.js";

async function stopMonitorID(monitorId: any) {

    const db = await connection;

    await db.execute(
        "UPDATE monitors SET status = 'stopped' WHERE id = ? AND status = 'active'",
        [
            monitorId
        ]
    );

    console.log(`Monitor ${monitorId} stopped`);
}

async function stopMonitorAll() {
    console.log("stopMonitorAll");
    const db = await connection;

    await db.execute(
        "UPDATE monitors SET status = 'stopped' WHERE status = 'active'",
    );

    console.log(` ALL Monitor stopped`);
}




async function stopMyMonitor(telegramUserId: number) {
    console.log("stopMyMonitor", telegramUserId);
    const db = await connection;

    const [rows]: any = await db.execute(
        "SELECT id FROM monitors WHERE telegram_user_id = ? AND status = 'active'",
        [telegramUserId]
    );

    console.log("Найдено мониторов:", rows.length);

    for (const monitor of rows) {
        await db.execute(
            "UPDATE monitors SET status = 'stopped' WHERE id = ? AND status = 'active'",
            [
                monitor.id
            ]

        );
        await tgPrintStopMonitor(monitor.id, telegramUserId);
    }




    console.log("stopMyMonitor ready", telegramUserId);

}






export { stopMonitorID };
export { stopMonitorAll };
export { stopMyMonitor };