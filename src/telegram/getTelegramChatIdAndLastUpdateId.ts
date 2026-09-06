import "dotenv/config";
import { connection } from "../database/connection.js";
import { processMessage } from "./processMessage.js";



async function getTelegramChatIdAndLastUpdateId() {
    const db = await connection;

    const [stateRows]: any = await db.execute(
        "SELECT last_update_id FROM telegram_bot_state WHERE id = 1"
    );

    const lastUpdateId = stateRows[0]?.last_update_id ?? 0;
    const offset = lastUpdateId + 1;


    const token = process.env.TELEGRAM_BOT_TOKEN;

    if (!token) {
        console.log("TELEGRAM_BOT_TOKEN не найден");
        return;
    }


    const response = await fetch(
        `https://api.telegram.org/bot${token}/getUpdates?offset=${offset}`
    );

    const data: any = await response.json();

    if (!data.ok) {
        console.log("Ошибка Telegram:", data);
        return;
    }

    for (const update of data.result) {



        if (!update.message) {
            continue;
        }



        await db.execute(

            `UPDATE telegram_bot_state

                SET last_update_id = ?

                 WHERE id = 1`,

            [update.update_id]

        );

        const chatId = update.message.chat.id;

        const username =
            update.message.from?.username ?? null;

        const telegram_user_id =
            update.message.from?.id ?? null;

        const text =
            update.message.text ?? null;


        const [userRows]: any = await db.execute(
            "SELECT id FROM telegram_users WHERE telegram_user_id = ?",
            [telegram_user_id]
        );

        if (userRows.length === 0) {
            console.log("Пользователь не нашелся в базе данных");


            await db.execute(
                `INSERT INTO telegram_users
                    (telegram_chat_id, username, telegram_user_id)
                    VALUES (?, ?,?)`,
                [
                    chatId,
                    username,
                    telegram_user_id
                ]
            );

            console.log("Пользователь добавлен в базу данных");
        }
        else {
            console.log("Пользователь нашелся в базе данных");
        }

        //////////////////////////////////////////////////////////////////////////
        await processMessage(update.message);
    }



}

export { getTelegramChatIdAndLastUpdateId };