import { connection } from "./database/connection.js";

import { alert } from "./alert.js";

async function monitor_events(monitorId: number) {

    console.log("============================== СТАТУС МОНИТОРА =========================================");

    const db = await connection;

    const [resultRows]: any = await db.execute(
        "SELECT data FROM monitor_results WHERE monitor_id = ? ORDER BY id DESC LIMIT 2",
        [monitorId]
    );

    if (resultRows.length < 2) {
        console.log("Недостаточно данных для сравнения");
        return [];
    }

    const lastResult = resultRows[0].data;
    const previousResult = resultRows[1].data;

    const parameters = [

        {
            name: "responseTime",
            oldValue: previousResult.http.responseTime,
            newValue: lastResult.http.responseTime,
            threshold: 20
        },
        {
            name: "dnsInfo ipv4",
            oldValue: previousResult.dns.ipv4.value[0],
            newValue: lastResult.dns.ipv4.value[0],
            threshold: 0
        },
        {
            name: "dnsInfo MX",
            oldValue: JSON.stringify(previousResult.dns.mx.value),
            newValue: JSON.stringify(lastResult.dns.mx.value),
            threshold: 0
        },
        {
            name: "dnsInfo NS",
            oldValue: JSON.stringify(previousResult.dns.ns.value),
            newValue: JSON.stringify(lastResult.dns.ns.value),
            threshold: 0
        },
        {
            name: "http status",
            oldValue: previousResult.http.status,
            newValue: lastResult.http.status,
            threshold: 0
        },
        {
            name: "http server",
            oldValue: previousResult.http.server,
            newValue: lastResult.http.server,
            threshold: 0
        },
        {
            name: "http bodySize",
            oldValue: previousResult.http.bodySize,
            newValue: lastResult.http.bodySize,
            threshold: 1000
        },
        {
            name: "PORT ports",
            oldValue: JSON.stringify(previousResult.ports),
            newValue: JSON.stringify(lastResult.ports),
            threshold: 0
        }
    ];

    const events: any[] = [];

    for (const parameter of parameters) {

        const event = await pushEventToDatabase(
            monitorId,
            parameter.name,
            parameter.oldValue,
            parameter.newValue,
            parameter.threshold
        );

        if (event) {
            events.push(event);
        }
    }

    console.log("Изменения:", events);

    if (events.length > 0) {
        await alert(
            events[0].monitorId,
            events[0].parameter,
            events[0].oldValue,
            events[0].newValue,
            events[0].parameterValue);
    }

    return events;
}


async function pushEventToDatabase(
    monitorId: number,
    parameter: string,
    oldValue: number | string,
    newValue: number | string,
    parameterValue: number
) {
    let changed = false;

    if (typeof oldValue === "number" && typeof newValue === "number") {

        const difference = newValue - oldValue;

        console.log("Parameter:", parameter);
        console.log("Old:", oldValue);
        console.log("New:", newValue);
        console.log("Difference:", difference);

        if (Math.abs(difference) > parameterValue) {
            changed = true;
        }

    } else {

        console.log("Parameter:", parameter);
        console.log("Old:", oldValue);
        console.log("New:", newValue);

        if (oldValue !== newValue) {
            changed = true;
        }
    }

    if (!changed) {
        return null;
    }

    const db = await connection;

    await db.execute(
        `INSERT INTO monitor_events
        (monitor_id, parameter, old_value, new_value)
        VALUES (?, ?, ?, ?)`,
        [
            monitorId,
            parameter,
            oldValue,
            newValue
        ]
    );

    return {
        monitorId,
        parameter,
        oldValue,
        newValue,
        parameterValue
    };
}









export { monitor_events };
export { pushEventToDatabase };
