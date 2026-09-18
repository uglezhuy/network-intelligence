import { getTelegramChatIdAndLastUpdateId } from "./getTelegramChatIdAndLastUpdateId.js";


async function startBotMax() {

    console.log("MAX bot started");


    while (true) {

        await getTelegramChatIdAndLastUpdateId();

        await new Promise(resolve =>
            setTimeout(resolve, 1000)
        );
    }
}




export { startBotMax };