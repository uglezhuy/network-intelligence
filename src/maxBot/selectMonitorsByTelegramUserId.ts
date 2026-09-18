import { connection } from "../database/connection";




async function showMonitorsByTelegramUserId(telegramUserId: number) {
    const db = await connection;

    const resultRows: any = await db.execute(
        "SELECT * FROM monitors WHERE telegram_user_id = ?",
        [telegramUserId]
    );


    return resultRows[0];









}


export { showMonitorsByTelegramUserId };