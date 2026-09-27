import { getTelegramChatIdAndLastUpdateId } from "./getTelegramChatIdAndLastUpdateId.js";

async function startBotMax() {

    console.log("MAX bot started");

    while (true) {

        try {

            await getTelegramChatIdAndLastUpdateId();

        } catch (error) {

            console.error("Бот мах лег:", error);

        }

        await new Promise(resolve =>
            setTimeout(resolve, 1000)
        );
    }
}

export { startBotMax };