import "dotenv/config";

async function tgPrintResultScan(
    result: any,
    telegramUserId: number
) {

    const dnsInfo = result.dns;

    const token = process.env.TELEGRAM_BOT_TOKEN;



    const ipv4 =
        dnsInfo.ipv4.status === "fulfilled"
            ? dnsInfo.ipv4.value.join(", ")
            : "Ошибка";

    const ipv6 =
        dnsInfo.ipv6.status === "fulfilled"
            ? dnsInfo.ipv6.value.join(", ")
            : "Не найден";

    const mx =
        dnsInfo.mx.status === "fulfilled"
            ? dnsInfo.mx.value
                .map((record: any) => record.exchange)
                .join(", ")
            : "Ошибка";

    const ns =
        dnsInfo.ns.status === "fulfilled"
            ? dnsInfo.ns.value.join(", ")
            : "Ошибка";

    const message = `
Target: ${result.target}

============= DNS =============
IPv4: ${ipv4}
IPv6: ${ipv6}
MX: ${mx}
NS: ${ns}
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
            "Ошибка при отправке сообщения:",
            error
        );
    }
}

export { tgPrintResultScan };