import "dotenv/config";

async function tgPrintResultScan(
    result: any,
    telegramUserId: number
) {
    const token = process.env.TELEGRAM_BOT_TOKEN;

    if (!token) {
        console.log("TELEGRAM_BOT_TOKEN не найден");
        return;
    }

    // ============================================================
    // DNS
    // ============================================================

    const dnsInfo = result.dns;

    const ipv4 =
        dnsInfo?.ipv4?.status === "fulfilled"
            ? dnsInfo.ipv4.value.join(", ")
            : "Ошибка";

    const ipv6 =
        dnsInfo?.ipv6?.status === "fulfilled"
            ? dnsInfo.ipv6.value.join(", ")
            : "Не найден";

    const mx =
        dnsInfo?.mx?.status === "fulfilled"
            ? dnsInfo.mx.value
                .map((record: any) => record.exchange)
                .join(", ")
            : "Ошибка";

    const ns =
        dnsInfo?.ns?.status === "fulfilled"
            ? dnsInfo.ns.value.join(", ")
            : "Ошибка";


    // ============================================================
    // HTTP
    // ============================================================

    console.log("HTTP:", result.http);

    const httpStatus =
        result.http?.status ?? "Не найден";

    const responseTime =
        result.http?.responseTime ?? "Неизвестно";

    const finalUrl =
        result.http?.finalUrl ?? "Не найден";

    const httpProtocol =
        result.http?.proto ?? "Не найден";

    const contentType =
        result.http?.contentType ?? "Не найден";

    const server =
        result.http?.server ?? "Не указан";

    const title =
        result.http?.title ?? "Не найден";

    const bodySizeKB =
        result.http?.bodySizeKB ?? "Неизвестно";


    // ============================================================
    // TLS
    // ============================================================

    console.log("TLS:", result.tls);

    const tlsEnabled = result.tls
        ? "✅ Включён"
        : "❌ Отключён";

    const tlsValidFrom =
        result.tls?.getCertificate?.valid_from ??
        "Не найдено";

    const validTo =
        result.tls?.getCertificate?.valid_to ??
        "Не найдено";

    const tlsInfo =
        result.tls?.Protocol ??
        "Не найдено";

    const tlsDaysLeft =
        validTo !== "Не найдено"
            ? Math.ceil(
                (
                    new Date(validTo).getTime() -
                    Date.now()
                ) /
                (1000 * 60 * 60 * 24)
            )
            : "Неизвестно";


    // ============================================================
    // PORTS
    // ============================================================

    const openPorts =
        Array.isArray(result.ports) &&
            result.ports.length > 0
            ? result.ports
                .filter(
                    (item: any) =>
                        item.status === "open"
                )
                .map(
                    (item: any) =>
                        item.port
                )
                .join(", ")
            : "Нет открытых портов";


    // ============================================================
    // Сообщение
    // ============================================================

    const message = `
🌐 ПРОВЕРКА САЙТА

${result.target}

━━━━━━━━━━━━━━━━━━━━
📡 DNS
━━━━━━━━━━━━━━━━━━━━

• IPv4: ${ipv4}
• IPv6: ${ipv6}
• MX: ${mx}
• NS: ${ns}

━━━━━━━━━━━━━━━━━━━━
🌍 HTTP
━━━━━━━━━━━━━━━━━━━━

• Статус: ${httpStatus}
• Время ответа: ${responseTime} мс
• URL: ${finalUrl}
• Протокол: ${httpProtocol}
• Content-Type: ${contentType}
• Сервер: ${server}
• Заголовок: ${title}
• Размер: ${bodySizeKB} KB

━━━━━━━━━━━━━━━━━━━━
🔐 TLS
━━━━━━━━━━━━━━━━━━━━

• Состояние: ${tlsEnabled}
• Версия: ${tlsInfo}
• Действует с: ${tlsValidFrom}
• Действует до: ${validTo}
• Осталось: ${tlsDaysLeft} дней

━━━━━━━━━━━━━━━━━━━━
🔌 ОТКРЫТЫЕ ПОРТЫ
━━━━━━━━━━━━━━━━━━━━

${openPorts}
`;


    // ============================================================
    // Отправка сообщения
    // ============================================================

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
            "Ошибка при отправке результата scan:",
            error
        );

    }
}

export { tgPrintResultScan };