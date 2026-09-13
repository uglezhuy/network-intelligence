import { getTelegramChatIdAndLastUpdateId } from "./getTelegramChatIdAndLastUpdateId.js";
import { tgCheckActiveMonitors } from "./tgCheckActiveMonitors.js";
import { startActiveMonitors } from "../monitor.js";
import { startApiServer } from "../api/server.js";


async function startBot() {

    console.log("Telegram bot started");

    startApiServer();

    const activeMonitors = await tgCheckActiveMonitors();

    startActiveMonitors(activeMonitors);

    while (true) {

        await getTelegramChatIdAndLastUpdateId();

        await new Promise(resolve =>
            setTimeout(resolve, 1000)
        );
    }
}


startBot();

export { startBot };