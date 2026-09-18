import { getTelegramChatIdAndLastUpdateId } from "./getTelegramChatIdAndLastUpdateId.js";
import { startApiServer } from "../api/startApiServer.js";


async function startBot() {

    console.log("Telegram bot started");





    while (true) {

        await getTelegramChatIdAndLastUpdateId();

        await new Promise(resolve =>
            setTimeout(resolve, 1000)
        );
    }
}




export { startBot };