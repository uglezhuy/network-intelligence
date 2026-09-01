import { connection } from "./connection.js";



let monitorResult: any=[];
let monitorId: number;
async function saveResultinScan(result: any) {

    const db = await connection;

    await db.execute(
        "INSERT INTO scans (target, data) VALUES (?, ?)",
        [
            result.target,
            JSON.stringify(result)
        ]
    );
}


async function saveResultinMonitors(target: string, min: number) {

    const db = await connection;

    //монитор
    monitorResult = await db.execute(
        "INSERT INTO monitors (target, interval_minutes, status) VALUES (?, ?, ?)",
        [
            target,
            min,
            "active"
        ]
    );

    // id  монитора
    monitorId = monitorResult[0].insertId;
    return monitorId;
}


// первый и послед результаты монитора
async function  saveInMonitor_results(result: any, monitorId: number) {
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




async function checkStateMonitorById(monitorId: number)
{
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
export{ saveInMonitor_results}

export {checkStateMonitorById}