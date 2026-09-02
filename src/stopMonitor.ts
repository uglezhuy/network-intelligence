import { connection } from "./database/connection.js";

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






export { stopMonitorID };
export {stopMonitorAll};