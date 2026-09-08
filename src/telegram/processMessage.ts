import { analyzers } from "../analyzers.js";
import { saveResultinScan } from "../database/results.js";
import { monitor } from "../monitor.js";
import { stopMonitorAll } from "../stopMonitor.js";
import { stopMonitorID } from "../stopMonitor.js";
import { tgPrintResultScan } from "./tgPrintResultScan.js";
import { stopMyMonitor } from "../stopMonitor.js";
import { showMonitorsByTelegramUserId } from "./selectMonitorsByTelegramUserId.js";



type TelegramMessage = {
    from: {
        id: number;
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
        await saveResultinScan(result, telegramUserId);
        tgPrintResultScan(result, telegramUserId);
    }
    if (command === "/monitor") {
        console.log("команда /monitor");
        monitor(target, Number(interval), telegramUserId);

    }

    if (command === "/stop" && !target) {
        console.log("команда /stop");
        stopMyMonitor(telegramUserId);
        console.log("команда /stop выполнена ");
    }


    if (command === "/stop" && target === "all") {
        console.log("команда /stop");
        stopMonitorAll();
        console.log("команда /stop выполнена ");
    }



    if (command === "/stop" && target) {
        console.log("команда /stop");
        stopMonitorID(Number(target));
        console.log("команда /stop id " + target + " выполнена ");
    }

    if (command === "/monitors") {
        console.log("команда /monitors");

        showMonitorsByTelegramUserId(telegramUserId);
        console.log("команда /monitors выполнена ");


    }


}

export { processMessage };