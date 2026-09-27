import "dotenv/config";
import { connection } from "../database/connection.js";
import { processMessage } from "./processMessage.js";

process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

let marker: number | null = null;

async function getTelegramChatIdAndLastUpdateId() {

    const db = await connection;

    const token = process.env.MAX_BOT_TOKEN;

    if (!token) {
        console.log("MAX_BOT_TOKEN не найден");
        return;
    }

    // Получаем последний marker из базы
    const [stateRows]: any = await db.execute(
        "SELECT last_update_id FROM max_bot_state WHERE id = 1"
    );

    const lastUpdateId = stateRows[0]?.last_update_id ?? 0;

    // После перезапуска берем marker из базы
    if (marker === null && lastUpdateId > 0) {
        marker = lastUpdateId;
    }

    const url =
        marker === null
            ? "https://platform-api2.max.ru/updates"
            : `https://platform-api2.max.ru/updates?marker=${marker}`;

    const response = await fetch(url, {
        headers: {
            "Authorization": token
        }
    });

    const data: any = await response.json();

    if (!response.ok) {
        console.log("Ошибка MAX:", data);
        return;
    }

    console.log("MAX updates:", data);

    for (const update of data.updates ?? []) {

        if (update.update_type !== "message_created") {
            continue;
        }

        const message = update.message;

        if (!message) {
            continue;
        }

        const chatId =
            message.recipient?.chat_id;

        const userId =
            message.sender?.user_id;

        const username =
            null;

        const text =
            message.body?.text ?? null;

        console.log("Chat ID:", chatId);
        console.log("MAX User ID:", userId);
        console.log("Username:", username);
        console.log("Text:", text);


        const [userRows]: any = await db.execute(
            `SELECT id
        FROM telegram_max_web_users
         WHERE telegram_chat_id = ?
         AND platform = 'max'`,
            [chatId]
        );

        if (userRows.length === 0) {

            console.log("Пользователь не найден");

            await db.execute(
                `INSERT INTO telegram_max_web_users
                 (telegram_chat_id, username, platform)
                VALUES (?, ?, ?)`,
                [
                    chatId,
                    username,
                    "max"
                ]
            );

            console.log("Пользователь добавлен");

        } else {

            console.log("Пользователь найден");
        }


        // Приводим MAX сообщение
        // к формату, который сейчас понимает processMessage()

        const messageForProcess = {

            from: {
                id: userId,
                username: username ?? undefined
            },

            chat: {
                id: chatId
            },

            text: text ?? undefined

        };

        await processMessage(messageForProcess);
    }


    // Получаем marker для следующего запроса
    if (data.marker !== undefined) {

        marker = data.marker;

        // Сохраняем marker в базу
        await db.execute(
            `UPDATE max_bot_state
             SET last_update_id = ?
             WHERE id = 1`,
            [marker]
        );
    }
}

export { getTelegramChatIdAndLastUpdateId };