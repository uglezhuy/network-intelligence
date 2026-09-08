import "dotenv/config";



async function tgPrintResultScan(result: any, telegramUserId: number) {


    const token = process.env.TELEGRAM_BOT_TOKEN;


    const message = `
            Target:", ${result.target};
            ==============DNS info================

            IP:", ${result.dns.ipv4.value[0]};
            ==============HTTP info================
            ${result.http};
            ==============IP info(api.ipapi.is)================
            ${result.ip};
            ==============TLS info================
            ${result.tls};
            ==============PORT info================
            ${result.ports};
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



    } catch (error) {
        console.error("Ошибка при отправке сообщения:", error);
    }

}

export { tgPrintResultScan }