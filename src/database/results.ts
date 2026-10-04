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




async function saveResultinScanAPICrt(
    result: string[],
    target: string,
    UserId?: number,
    platform?: string
) {
    const db = await connection;

    await db.execute(
        `
        INSERT INTO scans
        (target, data, telegram_user_id, platform)
        VALUES (?, ?, ?, ?)
        `,
        [
            target,
            JSON.stringify(result),
            UserId ?? null,
            platform ?? null
        ]
    );
}






async function saveResultinMonitors(
    target: string,
    min: number,
    minCrtSh: number,
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
                subdomain_scan_interval_hours,
                status,
                telegram_user_id,
                type,
                platform,
                send_monitor_notificationsTG,
                send_event_notificationsTG,
                send_monitor_notificationsMAX,
                send_event_notificationsMAX,
                subdomain_scan_enabled

            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                target,
                min,
                minCrtSh,
                "active",
                telegramUserId,
                mode,
                platform ?? null,
                sendMonitorNotificationsTG,
                sendEventNotificationsTG,
                sendMonitorNotificationsMAX,
                sendEventNotificationsMAX
                , true]
        );

        return result.insertId;
    } else {
        const [result]: any = await db.execute(
            `INSERT INTO monitors (
                target,
                interval_minutes,
                subdomain_scan_interval_hours,
                status,
                type,
                platform,
                subdomain_scan_enabled
            ) VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [
                target,
                min,
                minCrtSh,
                "active",
                mode,
                platform ?? null
                , true
            ]
        );

        return result.insertId;
    }
}


// первый и послед результаты монитора
async function saveInMonitor_results(
    result: any,
    monitorId: number
) {
    const db = await connection;

    await db.execute(
        `
        INSERT INTO monitor_results
        (monitor_id, result_type, data)
        VALUES (?, ?, ?)
        `,
        [
            monitorId,
            "monitor",
            JSON.stringify(result)
        ]
    );

    return monitorId;
}

async function saveInMonitor_resultsAPICrt(
    result: any,
    monitorId: number
) {
    const db = await connection;

    await db.execute(
        `
        INSERT INTO monitor_results
        (monitor_id, result_type, data)
        VALUES (?, ?, ?)
        `,
        [
            monitorId,
            "subdomain",
            JSON.stringify(result)
        ]
    );
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
export { saveInMonitor_resultsAPICrt }
export { saveResultinScanAPICrt }
