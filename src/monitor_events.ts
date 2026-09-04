import { connection } from "./database/connection.js";

async function monitor_events(monitorId: number) {

    console.log("==============================  СТАТУСА МОНИТОРА =========================================");

    const db = await connection;

    const [resultRows]: any = await db.execute(
        "SELECT data FROM monitor_results WHERE monitor_id = ? ORDER BY id DESC LIMIT 2",
        [monitorId]
    );

    
    const lastResult = resultRows[0].data;
    const previousResult = resultRows[1].data;

    await pustEventToDatabase(
    monitorId,
    "responseTime",
    previousResult.http.responseTime,
    lastResult.http.responseTime,
    1000
);

await pustEventToDatabase(
    monitorId,
    "dnsInfo ip",
    previousResult.dns.ipv4.value[0],
    lastResult.dns.ipv4.value[0],
    0
);

await pustEventToDatabase(
    monitorId,
    "http status",
    previousResult.http.status,
    lastResult.http.status,
    0
);

await pustEventToDatabase(
    monitorId,
    "http server",
    previousResult.http.server,
    lastResult.http.server,
    0
);

await pustEventToDatabase(
    monitorId,
    "http bodySize",
    previousResult.http.bodySize,
    lastResult.http.bodySize,
    1000
);

await pustEventToDatabase(
    monitorId,
    "PORT ports",
    JSON.stringify(previousResult.ports),
    JSON.stringify(lastResult.ports),
    0
);
}




async function pustEventToDatabase(
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
        return;
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
}









export { monitor_events };
export {pustEventToDatabase};