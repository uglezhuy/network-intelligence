import { connection } from "./connection.js";



let monitorResult: any = [];
let monitorId: number;
async function saveResultinScan(
    result: any,
    telegramUserId?: number
) {

    const db = await connection;

    if (telegramUserId) {
        await db.execute(
            "INSERT INTO scans (target, data, telegram_user_id) VALUES (?, ?, ?)",
            [
                result.target,
                JSON.stringify(result),
                telegramUserId
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
    telegramUserId?: number
) {
    const db = await connection;

    if (telegramUserId) {
        await db.execute(
            "INSERT INTO monitors (target, interval_minutes, status, telegram_user_id) VALUES (?, ?, ?, ?)",
            [
                target,
                min,
                "active",
                telegramUserId
            ]
        );
    } else {
        await db.execute(
            "INSERT INTO monitors (target, interval_minutes, status) VALUES (?, ?, ?)",
            [
                target,
                min,
                "active"
            ]
        );
    }

    // ID последнего созданного монитора
    const [rows]: any = await db.execute(
        "SELECT id FROM monitors WHERE target = ? ORDER BY id DESC LIMIT 1",
        [target]
    );

    monitorId = rows[0].id;

    return monitorId;
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
