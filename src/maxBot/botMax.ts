import { getTelegramChatIdAndLastUpdateId } from "./getTelegramChatIdAndLastUpdateId.js";
import { setMaxCommands } from "./setMaxCommands.js";

async function startBotMax() {

    console.log("MAX bot started");

    // Регистрируем команды MAX-бота один раз при запуске
    await setMaxCommands();

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