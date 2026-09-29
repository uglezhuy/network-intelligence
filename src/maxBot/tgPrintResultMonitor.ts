
import "dotenv/config";

const token = process.env.MAX_BOT_TOKEN;


// ============================================================
// Событие монитора
// ============================================================

async function MaxPrintResultMonitor(
    maxEvents: any,
    maxUserId: number,
    target: string
) {

    let parameterName = maxEvents.parameter;

    // Красивые названия параметров
    if (maxEvents.parameter === "responseTime") {
        parameterName = "Время ответа";
    }

    if (maxEvents.parameter === "dnsInfo ipv4") {
        parameterName = "DNS IPv4";
    }

    if (maxEvents.parameter === "dnsInfo MX") {
        parameterName = "DNS MX";
    }

    if (maxEvents.parameter === "dnsInfo NS") {
        parameterName = "DNS NS";
    }

    if (maxEvents.parameter === "http status") {
        parameterName = "HTTP статус";
    }

    if (maxEvents.parameter === "http server") {
        parameterName = "HTTP сервер";
    }

    if (maxEvents.parameter === "http bodySize") {
        parameterName = "Размер страницы";
    }

    if (maxEvents.parameter === "PORT ports") {
        parameterName = "Открытые порты";
    }


    // Красивое отображение изменения
    let changeText = "";

    if (
        maxEvents.parameter === "responseTime" &&
        typeof maxEvents.oldValue === "number" &&
        typeof maxEvents.newValue === "number"
    ) {

        const difference =
            maxEvents.newValue - maxEvents.oldValue;

        const sign = difference > 0 ? "+" : "";

        changeText =
            `\n📈 Изменение: ${sign}${difference} мс`;
    }


    const message = `
⚠️ ОБНАРУЖЕНО ИЗМЕНЕНИЕ

🌐 Сайт: ${target}

📊 ${parameterName}

Было:
${maxEvents.oldValue}

Стало:
${maxEvents.newValue}${changeText}

🎯 Порог события:
${maxEvents.parameterValue}

🆔 Монитор: #${maxEvents.monitorId}
`;


    if (!token) {
        console.log("MAX_BOT_TOKEN не найден");
        return;
    }


    try {

        const response = await fetch(
            `https://platform-api2.max.ru/messages?user_id=${maxUserId}`,
            {
                method: "POST",

                headers: {
                    "Authorization": token,
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    text: message
                })
            }
        );


        const data = await response.json();

        console.log("MAX sendMessage:", data);

    } catch (error) {

        console.error(
            "Ошибка при отправке сообщения MAX:",
            error
        );

    }
}



// ============================================================
// Остановка монитора
// ============================================================

async function MaxPrintStopMonitor(
    monitorId: number,
    maxUserId: number
) {

    const message = `
🛑 МОНИТОР ОСТАНОВЛЕН

🆔 Монитор: #${monitorId}

Проверки больше не выполняются.
`;


    if (!token) {
        console.log("MAX_BOT_TOKEN не найден");
        return;
    }


    try {

        const response = await fetch(
            `https://platform-api2.max.ru/messages?user_id=${maxUserId}`,
            {
                method: "POST",

                headers: {
                    "Authorization": token,
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    text: message
                })
            }
        );


        const data = await response.json();

        console.log("MAX sendMessage:", data);

    } catch (error) {

        console.error(
            "Ошибка при отправке сообщения MAX:",
            error
        );

    }
}



// ============================================================
// Все мониторы пользователя
// ============================================================

async function MaxPrintAllMyMonitors(
    monitors: any,
    maxUserId: number
) {

    console.log("MaxPrintAllMyMonitors запущена");

    console.log("monitors:", monitors);

    console.log("maxUserId:", maxUserId);

    let message = `📋 МОИ МОНИТОРЫ\n`;

    const blocks: string[] = [];

    for (const monitor of monitors) {

        const status =
            monitor.status === "active"
                ? "🟢 Активен"
                : "🔴 Остановлен";

        blocks.push(`
🆔 Монитор #${monitor.id}
🌐 ${monitor.target}
⏱ Интервал: ${monitor.interval_minutes} мин.
${status}
`);
    }

    message += blocks.join("\n");

    console.log("Сообщение для MAX:");
    console.log(message);

    if (!token) {
        console.log("MAX_BOT_TOKEN не найден");
        return;
    }

    try {

        const response = await fetch(
            `https://platform-api2.max.ru/messages?user_id=${maxUserId}`,
            {
                method: "POST",

                headers: {
                    "Authorization": token,
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    text: message
                })
            }
        );

        console.log("MAX HTTP status:", response.status);

        const data = await response.json();

        console.log("MAX sendMessage:", data);

    } catch (error) {

        console.error(
            "Ошибка при отправке сообщения MAX:",
            error
        );

    }
}



// ============================================================
// Export
// ============================================================

export {
    MaxPrintResultMonitor,
    MaxPrintStopMonitor,
    MaxPrintAllMyMonitors
};