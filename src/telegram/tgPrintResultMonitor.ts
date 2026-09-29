import "dotenv/config";

const token = process.env.TELEGRAM_BOT_TOKEN;


// ============================================================
// Событие монитора
// ============================================================

async function tgPrintResultMonitor(
    tgEvents: any,
    telegramUserId: number,
    target: string
) {
    if (!token) {
        console.log("TELEGRAM_BOT_TOKEN не найден");
        return;
    }


    // ========================================================
    // Название параметра
    // ========================================================

    let parameterName =
        tgEvents.parameter;


    if (tgEvents.parameter === "responseTime") {
        parameterName = "Время ответа";
    }

    if (tgEvents.parameter === "dnsInfo ipv4") {
        parameterName = "DNS IPv4";
    }

    if (tgEvents.parameter === "dnsInfo MX") {
        parameterName = "DNS MX";
    }

    if (tgEvents.parameter === "dnsInfo NS") {
        parameterName = "DNS NS";
    }

    if (tgEvents.parameter === "http status") {
        parameterName = "HTTP статус";
    }

    if (tgEvents.parameter === "http server") {
        parameterName = "HTTP сервер";
    }

    if (tgEvents.parameter === "http bodySize") {
        parameterName = "Размер страницы";
    }

    if (tgEvents.parameter === "PORT ports") {
        parameterName = "Открытые порты";
    }


    // ========================================================
    // Изменение времени ответа
    // ========================================================

    let changeText = "";

    if (
        tgEvents.parameter === "responseTime" &&
        typeof tgEvents.oldValue === "number" &&
        typeof tgEvents.newValue === "number"
    ) {

        const difference =
            tgEvents.newValue -
            tgEvents.oldValue;

        const sign =
            difference > 0
                ? "+"
                : "";

        changeText =
            `\n📈 Изменение: ${sign}${difference} мс`;
    }


    // ========================================================
    // Сообщение
    // ========================================================

    const message = `
⚠️ ОБНАРУЖЕНО ИЗМЕНЕНИЕ

🌐 Сайт: ${target}

━━━━━━━━━━━━━━━━━━━━
📊 ПАРАМЕТР
━━━━━━━━━━━━━━━━━━━━

${parameterName}

━━━━━━━━━━━━━━━━━━━━
🔄 ИЗМЕНЕНИЕ
━━━━━━━━━━━━━━━━━━━━

Было:
${tgEvents.oldValue}

Стало:
${tgEvents.newValue}${changeText}

━━━━━━━━━━━━━━━━━━━━
🎯 ПОРОГ СОБЫТИЯ
━━━━━━━━━━━━━━━━━━━━

${tgEvents.parameterValue}

━━━━━━━━━━━━━━━━━━━━
🆔 МОНИТОР
━━━━━━━━━━━━━━━━━━━━

#${tgEvents.monitorId}
`;


    // ========================================================
    // Отправка
    // ========================================================

    try {

        const response = await fetch(
            `https://api.telegram.org/bot${token}/sendMessage`,
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    chat_id: telegramUserId,
                    text: message
                })
            }
        );


        const data = await response.json();

        console.log(
            "Telegram sendMessage:",
            data
        );

    } catch (error) {

        console.error(
            "Ошибка при отправке события:",
            error
        );

    }
}


// ============================================================
// Остановка монитора
// ============================================================

async function tgPrintStopMonitor(
    monitorId: number,
    telegramUserId: number
) {
    if (!token) {
        console.log("TELEGRAM_BOT_TOKEN не найден");
        return;
    }


    const message = `
🛑 МОНИТОР ОСТАНОВЛЕН

━━━━━━━━━━━━━━━━━━━━

🆔 Монитор: #${monitorId}

Проверки больше не выполняются.
`;


    try {

        const response = await fetch(
            `https://api.telegram.org/bot${token}/sendMessage`,
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    chat_id: telegramUserId,
                    text: message
                })
            }
        );


        const data = await response.json();

        console.log(
            "Telegram sendMessage:",
            data
        );

    } catch (error) {

        console.error(
            "Ошибка при отправке остановки монитора:",
            error
        );

    }
}


// ============================================================
// Все мониторы пользователя
// ============================================================

async function tgPrintAllMyMonitors(
    monitors: any,
    telegramUserId: number
) {
    if (!token) {
        console.log("TELEGRAM_BOT_TOKEN не найден");
        return;
    }


    console.log(
        "tgPrintAllMyMonitors запущена"
    );

    console.log(
        "monitors:",
        monitors
    );

    console.log(
        "telegramUserId:",
        telegramUserId
    );


    // ========================================================
    // Если мониторов нет
    // ========================================================

    if (
        !Array.isArray(monitors) ||
        monitors.length === 0
    ) {

        const message = `
📋 МОИ МОНИТОРЫ

У вас пока нет созданных мониторов.
`;

        try {

            await fetch(
                `https://api.telegram.org/bot${token}/sendMessage`,
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify({
                        chat_id: telegramUserId,
                        text: message
                    })
                }
            );

        } catch (error) {

            console.error(
                "Ошибка при отправке списка мониторов:",
                error
            );

        }

        return;
    }


    // ========================================================
    // Формируем список
    // ========================================================

    const blocks: string[] = [];


    for (const monitor of monitors) {

        const status =
            monitor.status === "active"
                ? "🟢 Активен"
                : "🔴 Остановлен";


        blocks.push(`
🆔 Монитор #${monitor.id}

🌐 ${monitor.target}

⏱ Интервал:
${monitor.interval_minutes} мин.

📊 Статус:
${status}
`);
    }


    const message = `
📋 МОИ МОНИТОРЫ

━━━━━━━━━━━━━━━━━━━━

${blocks.join("\n━━━━━━━━━━━━━━━━━━━━\n")}
`;


    console.log(
        "Сообщение Telegram:"
    );

    console.log(message);


    // ========================================================
    // Отправка
    // ========================================================

    try {

        const response = await fetch(
            `https://api.telegram.org/bot${token}/sendMessage`,
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    chat_id: telegramUserId,
                    text: message
                })
            }
        );


        const data = await response.json();

        console.log(
            "Telegram sendMessage:",
            data
        );

    } catch (error) {

        console.error(
            "Ошибка при отправке списка мониторов:",
            error
        );

    }
}


// ============================================================
// Export
// ============================================================

export {
    tgPrintResultMonitor,
    tgPrintStopMonitor,
    tgPrintAllMyMonitors
};