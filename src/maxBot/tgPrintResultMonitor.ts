import "dotenv/config";

const token = process.env.MAX_BOT_TOKEN;


async function MaxPrintResultMonitor(
    maxEvents: any,
    maxUserId: number,
    target: string
) {
    const message = `
Изменения на сайте: ${target}

============== Monitor ID ==============
${maxEvents.monitorId}

============== Parameter ==============
${maxEvents.parameter}

============== Old Value ==============
${maxEvents.oldValue}

============== New Value ==============
${maxEvents.newValue}

============== Parameter Value ==============
${maxEvents.parameterValue}
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


async function MaxPrintStopMonitor(
    monitorId: number,
    maxUserId: number
) {
    const message = `
Монитор остановлен.

============== Monitor ID ==============
${monitorId}
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


async function MaxPrintAllMyMonitors(
    monitors: any,
    maxUserId: number
) {
    let message =
        `Все мониторы пользователя: ${maxUserId}:\n`;

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


export {
    MaxPrintResultMonitor,
    MaxPrintStopMonitor,
    MaxPrintAllMyMonitors
};