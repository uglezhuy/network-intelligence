import { connection } from "./database/connection.js";

async function startMonitorID(monitorId: any) {

    const db = await connection;

    await db.execute(
        "UPDATE monitors SET status = 'active' WHERE id = ? AND status = 'stopped'",
        [
            monitorId
        ]
    );

    console.log(`Monitor ${monitorId} started`);
}
export { startMonitorID };