import { connection } from "./database/connection.js";

async function deleteMonitorID(monitorId: any) {

    const db = await connection;

    await db.execute(
        "DELETE FROM monitors WHERE id = ?",
        [
            monitorId
        ]
    );

    console.log(`Monitor ${monitorId} deleted`);
}
export { deleteMonitorID };