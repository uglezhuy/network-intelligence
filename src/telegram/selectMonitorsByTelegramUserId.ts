import { connection } from "../database/connection";
import { tgPrintAllMyMonitors } from "./tgPrintResultMonitor.js";




async function showMonitorsByTelegramUserId(telegramUserId: number) {
    const db = await connection;

    const resultRows: any = await db.execute(
        "SELECT * FROM monitors WHERE telegram_user_id = ? AND status = 'active'",
        [telegramUserId]
    );


    return tgPrintAllMyMonitors(resultRows[0], telegramUserId);






}


export { showMonitorsByTelegramUserId };