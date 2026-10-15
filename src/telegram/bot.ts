import { getTelegramChatIdAndLastUpdateId } from "./getTelegramChatIdAndLastUpdateId.js";
import type { MonitorService } from "../nest/monitor/monitor.service.js";

async function startBotTg(monitorService: MonitorService) {
    console.log("Telegram bot started");

    while (true) {
        try {
            await getTelegramChatIdAndLastUpdateId(monitorService);
        } catch (error) {
            console.error("ТГ бот лег", error);
        }

        await new Promise(resolve =>
            setTimeout(resolve, 1000)
        );
    }
}

export { startBotTg };