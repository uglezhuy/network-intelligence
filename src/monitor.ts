import { analyzers } from "./analyzers.js";
import { saveResultinMonitors } from "./database/results.js";
import { saveInMonitor_results } from "./database/results.js";
import { checkStateMonitorById } from "./database/results.js";

import { monitor_events } from "./monitor_events.js";
import { tgPrintResultScan } from "./telegram/tgPrintResultMonitor.js";
import { connection } from "./database/connection.js";




function wait(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function monitor(

    target: string,

    min: number,

    telegramUserId?: number

) {

    let monitorId: number;

    if (telegramUserId) {

        monitorId = await saveResultinMonitors(

            target,

            min,

            telegramUserId

        );

    } else {

        monitorId = await saveResultinMonitors(

            target,

            min

        );

    }

    console.log("Monitor created. ID:", monitorId);

    runMonitor(

        monitorId,

        target,

        min,

        telegramUserId

    );

}
async function runMonitor(
    monitorId: number,
    target: string,
    min: number,
    telegramUserId?: number
) {
    let StateMonitorById = true;
    let i = 0;

    while (StateMonitorById) {
        i++;

        try {
            const result = await analyzers(target);

            await saveInMonitor_results(result, monitorId);

            console.log(
                "============================ ТЕСТ " +
                i +
                "============================"
            );

            console.log(
                "Monitor ID:",
                monitorId
            );

            console.log(
                "Telegram User ID:",
                telegramUserId
            );

            const tgEvents = await monitor_events(monitorId);

            if (telegramUserId && tgEvents.length > 0) {
                await tgPrintResultScan(
                    tgEvents[0],
                    telegramUserId
                );
            }

        } catch (error) {
            console.log("Analyzer error:", error);
        }

        const flag = await checkStateMonitorById(monitorId);

        if (flag === "stopped") {
            StateMonitorById = false;

            console.log("Monitor stopped");

            break;
        }

        await wait(min * 60 * 100);
    }
}
async function startActiveMonitors(activeMonitors: any) {

    for (const monitor of activeMonitors) {
        console.log(
            "востанволенные мониторы",
            monitor.id,
            monitor.target
        );

        runMonitor(
            monitor.id,
            monitor.target,
            monitor.interval_minutes,
            monitor.telegram_user_id ?? undefined
        );

    }
}








export { monitor };
export { startActiveMonitors };