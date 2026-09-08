import "dotenv/config";



async function tgPrintResultScan(tgEvents: any, telegramUserId: number) {
    const token = process.env.TELEGRAM_BOT_TOKEN;




    const message = `
            Изменения на сайте:";
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
export { tgPrintResultScan }