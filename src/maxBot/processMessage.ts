import { analyzers } from "../analyzers.js";
import { saveResultinScan } from "../database/results.js";
import { monitor } from "../monitor.js";
import { stopMonitorAll, stopMonitorID, stopMyMonitor } from "../stopMonitor.js";
import { MaxPrintResultScan } from "./MaxPrintResultScan.js";
import { showMonitorsByTelegramUserId } from "./selectMonitorsByTelegramUserId.js";
import { MaxPrintAllMyMonitors } from "./tgPrintResultMonitor.js";
import { MaxHelp } from "./MaxHelp.js";

type TelegramMessage = {
    from?: {
        id?: number;
        username?: string;
    };
    chat?: {
        id?: number;
    };
    text?: string;
};

async function processMessage(message: TelegramMessage) {

    // =========================================================
    // Получаем основные данные сообщения
    // =========================================================

    const telegramUserId = message.from?.id;
    const chatId = message.chat?.id;
    const text = message.text?.trim() ?? "";

    console.log("Обработка сообщения:");
    console.log("Telegram User ID:", telegramUserId);
    console.log("Chat ID:", chatId);
    console.log("Text:", text);


    // =========================================================
    // Защита от некорректного сообщения
    // =========================================================

    if (!telegramUserId) {
        console.log("Ошибка: не найден User ID");
        return;
    }

    if (!chatId) {
        console.log("Ошибка: не найден Chat ID");
        return;
    }

    if (!text) {
        console.log("Сообщение пустое");
        return;
    }


    // =========================================================
    // Разбираем команду
    // =========================================================

    const parts = text.split(/\s+/);

    const command = parts[0];
    const target = parts[1];
    const intervalText = parts[2];






    if (command === "/help") {

        await MaxHelp(telegramUserId);

        return;
    }
    // =========================================================
    // /scan
    // =========================================================

    if (command === "/scan") {

        console.log("команда /scan");

        if (!target) {
            console.log("Ошибка: не указан target для /scan");
            return;
        }

        try {

            const result = await analyzers(target);

            await saveResultinScan(
                result,
                telegramUserId,
                "max"
            );

            await MaxPrintResultScan(
                result,
                telegramUserId
            );

        } catch (error) {

            console.error("Ошибка выполнения /scan:", error);

        }

        return;
    }


    // =========================================================
    // /events
    // =========================================================

    if (command === "/events") {

        console.log("команда /events");

        if (!target) {
            console.log(
                "Ошибка: для /events необходимо указать target"
            );
            return;
        }

        if (!intervalText) {
            console.log(
                "Ошибка: для /events необходимо указать interval"
            );
            return;
        }

        const interval = Number(intervalText);

        if (!Number.isFinite(interval)) {
            console.log(
                "Ошибка: interval должен быть числом"
            );
            return;
        }

        if (interval <= 0) {
            console.log(
                "Ошибка: interval должен быть больше 0"
            );
            return;
        }

        try {

            await monitor(
                target,
                interval,
                60,         // subdomain_scan_interval_hours
                "events",
                false,
                false,
                false,
                true,
                telegramUserId,
                "max"
            );

            console.log("команда /events выполнена");

        } catch (error) {

            console.error(
                "Ошибка выполнения /events:",
                error
            );

        }

        return;
    }


    // =========================================================
    // /monitor
    // =========================================================

    if (command === "/monitor") {

        console.log("команда /monitor");

        if (!target) {
            console.log(
                "Ошибка: для /monitor необходимо указать target"
            );
            return;
        }

        if (!intervalText) {
            console.log(
                "Ошибка: для /monitor необходимо указать interval"
            );
            return;
        }

        const interval = Number(intervalText);

        if (!Number.isFinite(interval)) {
            console.log(
                "Ошибка: interval должен быть числом"
            );
            return;
        }

        if (interval <= 0) {
            console.log(
                "Ошибка: interval должен быть больше 0"
            );
            return;
        }

        try {

            await monitor(
                target,
                interval,
                60,         // subdomain_scan_interval_hours
                "monitors",
                false,
                false,
                true,
                false,
                telegramUserId,
                "max"
            );

            console.log("команда /monitor выполнена");

        } catch (error) {

            console.error(
                "Ошибка выполнения /monitor:",
                error
            );

        }

        return;
    }


    // =========================================================
    // /stop
    // =========================================================

    if (command === "/stop") {

        console.log("команда /stop");

        // -----------------------------------------------------
        // /stop
        // Остановить мои мониторы
        // -----------------------------------------------------

        if (!target) {

            try {

                await stopMyMonitor(
                    telegramUserId
                );

                console.log(
                    "Мои мониторы остановлены"
                );

            } catch (error) {

                console.error(
                    "Ошибка выполнения /stop:",
                    error
                );

            }

            return;
        }


        // -----------------------------------------------------
        // /stop all
        // Остановить все мониторы
        // -----------------------------------------------------

        if (target === "all") {

            try {

                await stopMonitorAll();

                console.log(
                    "Все мониторы остановлены"
                );

            } catch (error) {

                console.error(
                    "Ошибка выполнения /stop all:",
                    error
                );

            }

            return;
        }


        // -----------------------------------------------------
        // /stop ID
        // -----------------------------------------------------

        const monitorId = Number(target);

        if (!Number.isInteger(monitorId)) {

            console.log(
                "Ошибка: ID монитора должен быть целым числом"
            );

            return;
        }

        if (monitorId <= 0) {

            console.log(
                "Ошибка: ID монитора должен быть больше 0"
            );

            return;
        }

        try {

            await stopMonitorID(
                monitorId
            );

            console.log(
                `Монитор #${monitorId} остановлен`
            );

        } catch (error) {

            console.error(
                `Ошибка остановки монитора #${monitorId}:`,
                error
            );

        }

        return;
    }


    // =========================================================
    // /monitors
    // =========================================================

    if (command === "/monitors") {

        console.log("команда /monitors");

        try {

            const resultRows =
                await showMonitorsByTelegramUserId(
                    telegramUserId
                );

            console.log(
                "Результат showMonitorsByTelegramUserId:",
                resultRows
            );

            await MaxPrintAllMyMonitors(
                resultRows,
                telegramUserId
            );

            console.log(
                "MaxPrintAllMyMonitors завершена"
            );

            console.log(
                "команда /monitors выполнена"
            );

        } catch (error) {

            console.error(
                "Ошибка выполнения /monitors:",
                error
            );

        }

        return;
    }


    // =========================================================
    // /app
    // =========================================================

    // =========================================================
    // /app
    // =========================================================

    if (command === "/app") {

        console.log("команда /app");

        const token = process.env.MAX_BOT_TOKEN;

        if (!token) {

            console.log(
                "MAX_BOT_TOKEN не найден"
            );

            return;
        }

        try {

            const response = await fetch(
                `https://platform-api2.max.ru/messages?user_id=${telegramUserId}`,
                {
                    method: "POST",

                    headers: {
                        "Authorization": token,
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify({

                        text:
                            "🌐 Network Intelligence\n\n" +
                            "Открывается текущая Web-версия проекта.\n\n" +
                            "🚧 MAX Mini App находится в разработке.\n\n" +
                            "Основные функции проекта уже доступны " +
                            "через Web-интерфейс. (захаржен айди телеграмма в качестве тестового параметра)",

                        attachments: [

                            {
                                type: "inline_keyboard",

                                payload: {

                                    buttons: [

                                        [
                                            {
                                                type: "link",

                                                text:
                                                    "🚀 Открыть Web-версию",

                                                url:
                                                    "https://network-intelligence.megafonhome.ru"
                                            }
                                        ]

                                    ]

                                }

                            }

                        ]

                    })

                }
            );

            const data =
                await response.json();

            console.log(
                "Ответ MAX /app:",
                data
            );

            console.log(
                "команда /app завершена"
            );

        } catch (error) {

            console.error(
                "Ошибка выполнения /app:",
                error
            );

        }

        return;
    }


    // =========================================================
    // Неизвестная команда
    // =========================================================

    console.log(
        "Неизвестная команда:",
        command
    );
}


export { processMessage };