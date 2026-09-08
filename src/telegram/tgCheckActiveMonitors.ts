import { connection } from "../database/connection.js";



async function tgCheckActiveMonitors() {
    const db = await connection;

    const [rows]: any = await db.execute(
        "SELECT * FROM monitors WHERE status = 'active'"
    );

    const activeMonitors = rows;


    return activeMonitors;


}

export { tgCheckActiveMonitors };