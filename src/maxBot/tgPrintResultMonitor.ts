import "dotenv/config";

const token = process.env.TELEGRAM_BOT_TOKEN;

async function tgPrintResultMonitor(tgEvents: any, telegramUserId: number, target: string) {


    const message = `
            Изменения на сайте:${target}";
            ==============monitorId================
            parameter:", ${tgEvents.monitorId};
            ==============parameter================
            ${tgEvents.parameter};
            ==============oldValue================
            ${tgEvents.oldValue};
            ==============newValue================
            ${tgEvents.newValue};
            ==============parameterValue================
            ${tgEvents.parameterValue};
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
        console.error("Ошибка при отправке сообщения:", error);
    }

}
async function tgPrintStopMonitor(monitorId: number, telegramUserId: number) {

    const message = `
            Монитор остановлен:";
            ==============monitorId================
            ${monitorId};
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
        console.error("Ошибка при отправке сообщения:", error);
    }



}





async function tgPrintAllMyMonitors(monitors: any, telegramUserId: number) {

    let message = `Все мониторы пользователя:${telegramUserId}:`;
    const blocks: string[] = [];

    for (const monitor of monitors) {
        blocks.push(`
    #${monitor.id}
    Сайт: ${monitor.target}
    Интервал: ${monitor.interval_minutes} мин.
    Статус: ${monitor.status}
    `);

    }
    message += blocks.join("\n");



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
        console.error("Ошибка при отправке сообщения:", error);
    }









}





export { tgPrintResultMonitor }
export { tgPrintStopMonitor }
export { tgPrintAllMyMonitors }
