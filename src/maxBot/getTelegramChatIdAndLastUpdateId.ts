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
            "SELECT id FROM telegram_users WHERE telegram_user_id = ?",
            [userId]
        );

        if (userRows.length === 0) {

            console.log("Пользователь не найден");

            await db.execute(
                `INSERT INTO telegram_users
                    (telegram_chat_id, username, telegram_user_id)
                 VALUES (?, ?, ?)`,
                [
                    chatId,
                    username,
                    userId
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


    if (data.marker !== undefined) {
        marker = data.marker;
    }
}

export { getTelegramChatIdAndLastUpdateId };