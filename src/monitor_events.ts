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
        lastResult.http.responseTime,
        previousResult.http.responseTime
    );

    await pustEventToDatabase(
        monitorId,
        "ip",
        lastResult.dns.ipv4.value[0],
        previousResult.dns.ipv4.value[0],
        );
}




async function pustEventToDatabase(
    monitorId: number,
    event: string,
    data0: number | string,
    data1: number | string
)
{
    const difference =
    typeof data0 === "number" && typeof data1 === "number"
        ? data0 - data1
        : data0 !== data1 ? "IP changed" : "no change";

    console.log("Event:", event);
    console.log("data0:", data0, "ms");
    console.log("data1:", data1, "ms");
    console.log("Difference:", difference);

    if (event === "responseTime" && Math.abs(Number(data0) - Number(data1)) > 100) {

    const db = await connection;

    await db.execute(
        "INSERT INTO monitor_events (monitor_id, parameter, old_value, new_value) VALUES (?, ?, ?, ?)",
        [
            monitorId,
            event,
            data1,
            data0
        ]
    );
}


if (event === "ip" && data0 !== data1) {

    const db = await connection;

    await db.execute(
        "INSERT INTO monitor_events (monitor_id, parameter, old_value, new_value) VALUES (?, ?, ?, ?)",
        [
            monitorId,
            event,
            data1,
            data0
        ]
    );
}
}






export { monitor_events };
export {pustEventToDatabase};