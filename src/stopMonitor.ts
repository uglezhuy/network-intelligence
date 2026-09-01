import { connection } from "./database/connection.js";

async function stopMonitor(monitorId: number) {

    const db = await connection;

    await db.execute(
        "UPDATE monitors SET status = 'stopped' WHERE id = ? AND status = 'active'",
        [
            monitorId
        ]
    );

    console.log(`Monitor ${monitorId} stopped`);
}

export { stopMonitor };