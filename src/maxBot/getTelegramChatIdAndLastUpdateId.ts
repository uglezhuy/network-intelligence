import "dotenv/config";
import { processMessage } from "./processMessage.js";

process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

let marker: number | null = null;

async function getTelegramChatIdAndLastUpdateId() {

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

        console.log("Получено событие MAX:", update);

        if (update.update_type !== "message_created") {
            continue;
        }

        console.log("Новое сообщение:", update);

        console.log(
            "Текст:",
            update.message?.body?.text
        );

        console.log(
            "Пользователь:",
            update.message?.sender
        );

        console.log(
            "Chat ID:",
            update.message?.recipient?.chat_id
        );
    }

    if (data.marker !== undefined) {
        marker = data.marker;
    }
}

export { getTelegramChatIdAndLastUpdateId };