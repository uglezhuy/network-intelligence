import "dotenv/config";

async function MaxPrintResultScan(
    result: any,
    maxUserId: number
) {
    const dnsInfo = result.dns;

    const token = process.env.MAX_BOT_TOKEN;

    if (!token) {
        console.log("MAX_BOT_TOKEN не найден");
        return;
    }

    // DNS
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

    // HTTP
    console.log("HTTP:", result.http);

    const HttpStatus = result.http.status;
    const ResponseTime = result.http.responseTime;

    // TLS
    console.log("TLS:", result.tls);

    const tlsEnabled = result.tls ? "enabled" : "disabled";

    const tlsValidFrom =
        result.tls?.getCertificate?.valid_from ?? "Не найдено";

    const validTo =
        result.tls?.getCertificate?.valid_to ?? "Не найдено";

    const tlsInfo =
        result.tls?.Protocol ?? "Не найдено";

    const tlsDaysLeft =
        validTo !== "Не найдено"
            ? Math.ceil(
                (
                    new Date(validTo).getTime() - Date.now()
                ) / (1000 * 60 * 60 * 24)
            )
            : "Неизвестно";

    // Ports
    const openPorts =
        result.ports.length > 0
            ? result.ports
                .filter((item: any) => item.status === "open")
                .map((item: any) => item.port)
                .join(", ")
            : "Нет открытых портов";

    const message = `
Сайт: ${result.target}

============= DNS =============
IPv4: ${ipv4}
IPv6: ${ipv6}
MX: ${mx}
NS: ${ns}

============= HTTP =============
HTTP Status: ${HttpStatus}
Response Time: ${ResponseTime} ms

============= TLS =============
TLS enabled: ${tlsEnabled}
TLS version: ${tlsInfo}
Valid from: ${tlsValidFrom}
Valid to: ${validTo}
TLS days left: ${tlsDaysLeft}

============= Ports =============
Open ports: ${openPorts}
`;

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

export { MaxPrintResultScan };