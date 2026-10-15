import { getTelegramChatIdAndLastUpdateId } from "./getTelegramChatIdAndLastUpdateId.js";
import { setMaxCommands } from "./setMaxCommands.js";
import type { MonitorService } from "../nest/monitor/monitor.service.js";

async function startBotMax(monitorService: MonitorService) {
    console.log("MAX bot started");

    // Регистрируем команды MAX-бота один раз при запуске
    await setMaxCommands();

    while (true) {

        try {

            await getTelegramChatIdAndLastUpdateId(monitorService);
        } catch (error) {

            console.error("Бот мах лег:", error);

        }

        await new Promise(resolve =>
            setTimeout(resolve, 1000)
        );
    }
}

export { startBotMax };