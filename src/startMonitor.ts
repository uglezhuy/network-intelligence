import { connection } from "./database/connection.js";
import { startActiveMonitors } from "./monitor.js";




async function startMonitorID(monitorId: any) {

    const db = await connection;

    await db.execute(
        "UPDATE monitors SET status = 'active' WHERE id = ? AND status = 'stopped'",
        [
            monitorId
        ]
    );

    console.log(`Monitor ${monitorId} started`);

    startActiveMonitors(monitorId);
    console.log(`Monitor ${monitorId} started and active monitors started`);
}
export { startMonitorID };