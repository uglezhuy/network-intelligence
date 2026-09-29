import { connection } from "./connection.js";



async function saveResultinScan(
    result: any,
    UserId?: number,
    platform?: string
) {
    const db = await connection;

    if (UserId) {
        await db.execute(
            "INSERT INTO scans (target, data, telegram_user_id, platform) VALUES (?, ?, ?, ?)",
            [
                result.target,
                JSON.stringify(result),
                UserId,
                platform
            ]
        );
    }
    else {
        await db.execute(
            "INSERT INTO scans (target, data) VALUES (?, ?)",
            [
                result.target,
                JSON.stringify(result)
            ]
        );
    }
}


async function saveResultinMonitors(
    target: string,
    min: number,
    mode: string,
    sendMonitorNotificationsTG: boolean,
    sendEventNotificationsTG: boolean,
    sendMonitorNotificationsMAX: boolean,
    sendEventNotificationsMAX: boolean,
    telegramUserId?: number,
    platform?: string
) {
    const db = await connection;

    if (telegramUserId) {
        const [result]: any = await db.execute(
            `INSERT INTO monitors (
                target,
                interval_minutes,
                status,
                telegram_user_id,
                type,
                platform,
                send_monitor_notificationsTG,
                send_event_notificationsTG,
                send_monitor_notificationsMAX,
                send_event_notificationsMAX
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                target,
                min,
                "active",
                telegramUserId,
                mode,
                platform ?? null,
                sendMonitorNotificationsTG,
                sendEventNotificationsTG,
                sendMonitorNotificationsMAX,
                sendEventNotificationsMAX
            ]
        );

        return result.insertId;
    } else {
        const [result]: any = await db.execute(
            `INSERT INTO monitors (
                target,
                interval_minutes,
                status,
                type,
                platform
            ) VALUES (?, ?, ?, ?, ?)`,
            [
                target,
                min,
                "active",
                mode,
                platform ?? null
            ]
        );

        return result.insertId;
    }
}


// первый и послед результаты монитора
async function saveInMonitor_results(result: any, monitorId: number) {
    const db = await connection;
    //  первый результат монитора
    await db.execute(
        "INSERT INTO monitor_results (monitor_id, data) VALUES (?, ?)",
        [
            monitorId,
            JSON.stringify(result)
        ]
    );

    return monitorId;
}




async function checkStateMonitorById(monitorId: number) {
    const db = await connection;
    const [rows]: any = await db.execute(
        "SELECT status FROM monitors WHERE id = ?",
        [
            monitorId
        ]
    );
    return rows[0]?.status;
}


export { saveResultinScan };

export { saveResultinMonitors };
export { saveInMonitor_results }

export { checkStateMonitorById }
