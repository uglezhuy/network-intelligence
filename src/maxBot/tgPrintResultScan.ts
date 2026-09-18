import "dotenv/config";

async function tgPrintResultScan(
    result: any,
    telegramUserId: number
) {

    const dnsInfo = result.dns;

    const token = process.env.TELEGRAM_BOT_TOKEN;


    //dns
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
    //http
    console.log("HTTP:", result.http);
    const HttpStatus = result.http.status

    const ResponseTime = result.http.responseTime

    //tls





    console.log("TLS:", result.tls);
    const tlsEnabled = result.tls ? "enabled" : "disabled";
    const tlsValidFrom = result.tls.getCertificate.valid_from
    const validTo = result.tls.getCertificate.valid_to
    const tlsInfo = result.tls.Protocol
    const tlsDaysLeft = Math.ceil(
        (
            new Date(validTo).getTime() - Date.now()
        ) / (1000 * 60 * 60 * 24)
    );




    //ports

    const openPorts = result.ports.length > 0
        ? result.ports
            .filter((item: any) => item.status === "open")
            .map((item: any) => item.port)
            .join(", ")
        : "Нет открытых портов"; ``

    const message = `
    Сайт: ${result.target}

    ============= DNS =============
    ID монитора: ${result.monitorId}//
    IPv4: ${ipv4}
    IPv6: ${ipv6}
    MX: ${mx}
    NS: ${ns}
    ============= HTTP =============
    HTTP Status: ${HttpStatus}
    Response Time: ${ResponseTime}
    ============= TLS =============
    tls enabled: ${tlsEnabled}
    TLS versionInfo: ${tlsInfo}
    validFrom:${tlsValidFrom}
    validTo:${validTo}
    tlsDaysLeft: ${tlsDaysLeft}

    ================= Ports =================
    Open ports: ${openPorts}



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