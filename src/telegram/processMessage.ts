import { analyzers } from "../analyzers.js";
import { saveResultinScan } from "../database/results.js";
import { printResult } from "../printResult.js";
import { monitor } from "../monitor.js";
import { stopMonitorAll } from "../stopMonitor.js";
import { stopMonitorID } from "../stopMonitor.js";



type TelegramMessage = {
    from?: {
        id?: number;
        username?: string;
    };
    chat: {
        id: number;
    };
    text?: string;
};

async function processMessage(message: TelegramMessage) {

    const telegramUserId = message.from?.id;
    const chatId = message.chat.id;
    const text = message.text ?? "";

    console.log("Обработка сообщения:");
    console.log("Telegram User ID:", telegramUserId);
    console.log("Chat ID:", chatId);
    console.log("Text:", text);



    const parts = text.split(" ");

    const command = parts[0];
    const target = parts[1];
    const interval = parts[2];

    if (command === "/scan") {
        console.log("команда /scan");
        const result = await analyzers(target);
        await saveResultinScan(result);
        printResult(result);
    }
    if (command === "/monitor") {
        console.log("команда /monitor");
        await monitor(target, Number(interval));
    }

    if (command === "/stop") { // доделат не рабоатет хз почему!!!!!!!!!!!!!!!!!!
        if (interval === 'all') {
            await stopMonitorAll(); return;
        }
        await stopMonitorID(Number(interval));// доделат не рабоатет хз почему!!!!!!!!!!!!!!!!!!
        return;
    }






}

export { processMessage };