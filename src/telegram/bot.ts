import { getTelegramChatIdAndLastUpdateId } from "./getTelegramChatIdAndLastUpdateId.js";

async function startBotTg() {

    console.log("Telegram bot started");

    while (true) {

        try {

            await getTelegramChatIdAndLastUpdateId();

        } catch (error) {

            console.error("ТГ бот лег", error);

        }

        await new Promise(resolve =>
            setTimeout(resolve, 1000)
        );
    }
}

export { startBotTg };