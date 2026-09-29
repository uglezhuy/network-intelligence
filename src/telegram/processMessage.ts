import "dotenv/config";

import { analyzers } from "../analyzers.js";
import { saveResultinScan } from "../database/results.js";
import { monitor } from "../monitor.js";

import {
    stopMonitorAll,
    stopMonitorID,
    stopMyMonitor
} from "../stopMonitor.js";

import {
    tgPrintResultMonitor,
    tgPrintStopMonitor,
    tgPrintAllMyMonitors
} from "./tgPrintResultMonitor.js";

import { tgPrintResultScan } from "./tgPrintResultScan.js";

import {
    showMonitorsByTelegramUserId
} from "./selectMonitorsByTelegramUserId.js";


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


async function processMessage(
    message: TelegramMessage
) {

    // =========================================================
    // Получаем данные сообщения
    // =========================================================

    const telegramUserId =
        message.from?.id;

    const chatId =
        message.chat?.id;

    const text =
        message.text?.trim() ?? "";


    console.log(
        "Обработка сообщения:"
    );

    console.log(
        "Telegram User ID:",
        telegramUserId
    );

    console.log(
        "Chat ID:",
        chatId
    );

    console.log(
        "Text:",
        text
    );


    // =========================================================
    // Проверка данных
    // =========================================================

    if (!telegramUserId) {

        console.log(
            "Ошибка: не найден Telegram User ID"
        );

        return;
    }


    if (!chatId) {

        console.log(
            "Ошибка: не найден Chat ID"
        );

        return;
    }


    if (!text) {

        console.log(
            "Сообщение пустое"
        );

        return;
    }


    // =========================================================
    // Разбираем команду
    // =========================================================

    const parts =
        text.split(/\s+/);


    const command =
        parts[0];

    const target =
        parts[1];

    const intervalText =
        parts[2];


    // =========================================================
    // /scan
    // =========================================================

    if (command === "/scan") {

        console.log(
            "команда /scan"
        );


        if (!target) {

            console.log(
                "Ошибка: не указан target"
            );

            return;
        }


        try {

            const result =
                await analyzers(target);


            await saveResultinScan(
                result,
                telegramUserId,
                "telegram"
            );


            await tgPrintResultScan(
                result,
                telegramUserId
            );


        } catch (error) {

            console.error(
                "Ошибка выполнения /scan:",
                error
            );

        }

        return;
    }


    // =========================================================
    // /events
    // =========================================================

    if (command === "/events") {

        console.log(
            "команда /events"
        );


        if (!target) {

            console.log(
                "Ошибка: не указан target"
            );

            return;
        }


        if (!intervalText) {

            console.log(
                "Ошибка: не указан interval"
            );

            return;
        }


        const interval =
            Number(intervalText);


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
                "events",
                false,
                true,
                false,
                false,
                telegramUserId,
                "telegram"
            );


            console.log(
                "команда /events выполнена"
            );


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

        console.log(
            "команда /monitor"
        );


        if (!target) {

            console.log(
                "Ошибка: не указан target"
            );

            return;
        }


        if (!intervalText) {

            console.log(
                "Ошибка: не указан interval"
            );

            return;
        }


        const interval =
            Number(intervalText);


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
                "monitors",
                true,
                false,
                false,
                false,
                telegramUserId,
                "telegram"
            );


            console.log(
                "команда /monitor выполнена"
            );


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

        console.log(
            "команда /stop"
        );


        // -----------------------------------------------------
        // /stop
        // -----------------------------------------------------

        if (!target) {

            try {

                await stopMyMonitor(
                    telegramUserId
                );


                console.log(
                    "Мои мониторы остановлены"
                );


                await tgPrintStopMonitor(
                    0,
                    telegramUserId
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
        // -----------------------------------------------------

        if (target === "all") {

            try {

                await stopMonitorAll();


                console.log(
                    "Все мониторы остановлены"
                );


                await tgPrintStopMonitor(
                    0,
                    telegramUserId
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

        const monitorId =
            Number(target);


        if (!Number.isInteger(monitorId)) {

            console.log(
                "Ошибка: ID должен быть целым числом"
            );

            return;
        }


        if (monitorId <= 0) {

            console.log(
                "Ошибка: ID должен быть больше 0"
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


            await tgPrintStopMonitor(
                monitorId,
                telegramUserId
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

        console.log(
            "команда /monitors"
        );


        try {

            const resultRows =
                await showMonitorsByTelegramUserId(
                    telegramUserId
                );


            console.log(
                "Результат showMonitorsByTelegramUserId:",
                resultRows
            );


            await tgPrintAllMyMonitors(
                resultRows,
                telegramUserId
            );


            console.log(
                "tgPrintAllMyMonitors завершена"
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

    if (command === "/app") {

        console.log(
            "команда /app"
        );


        const token =
            process.env.TELEGRAM_BOT_TOKEN;


        if (!token) {

            console.log(
                "TELEGRAM_BOT_TOKEN не найден"
            );

            return;
        }


        try {

            await fetch(
                `https://api.telegram.org/bot${token}/sendMessage`,
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify({

                        chat_id: chatId,

                        text:
                            "Network Intelligence",

                        reply_markup: {

                            inline_keyboard: [
                                [
                                    {
                                        text:
                                            "🚀 Открыть Network Intelligence",

                                        web_app: {
                                            url:
                                                "https://wellness-nearby-occurrence-rise.trycloudflare.com"
                                        }
                                    }
                                ]
                            ]

                        }

                    })
                }
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