import "dotenv/config";

async function alertTg(
    monitorId: number,
    parameter: string,
    oldValue: number | string,
    newValue: number | string,
    parameterValue: number | string
) {
    const token = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;

    if (!token || !chatId) {
        console.log("Telegram token или chat ID не найдены");
        return;
    }

    const message = `
    Network Intelligence ALERT

    Monitor: ${monitorId}

    Parameter: ${parameter}

    Старое значение: ${oldValue}
    Новое значение: ${newValue}

    Порог изменения: ${parameterValue}
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
                    chat_id: chatId,
                    text: message
                })
            }
        );

        if (!response.ok) {
            console.log(
                "Ошибка Telegram:",
                await response.text()
            );

            return;
        }

        console.log("Telegram ALERT отправлен");

    } catch (error) {

        console.log(
            "Ошибка подключения к Telegram:",
            error
        );
    }
}

export { alertTg };