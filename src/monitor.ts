import { analyzers } from "./analyzers.js";
import { saveResultinMonitors } from "./database/results.js";
import { saveInMonitor_results } from "./database/results.js";
import { checkStateMonitorById } from "./database/results.js";

import {monitor_events} from "./monitor_events.js";

function wait(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function monitor(target: string, min: number) {

    console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!use monitor function");

    const monitorId = await saveResultinMonitors(target, min);

    console.log("Monitor created. ID:", monitorId);

    const results = [];
    let i = 0;

    let StateMonitorById = true;

    while (StateMonitorById) {

    i++;

    try {
        const result = await analyzers(target);

        await saveInMonitor_results(result, monitorId);

        results.push(result);

        console.log("============================ ТЕСТ " + i + "============================");
        console.log(results);
        await monitor_events(monitorId);

    } catch (error) { // чтоб не падал весь монитор доделать обработку ошибки
        console.log("Analyzer error:", error);
    }

    const flag = await checkStateMonitorById(monitorId);

    if (flag == "stopped") {
        StateMonitorById = false;
        console.log("Monitor stopped");
        
        break;
    }

    await wait(min * 60 * 100);
}
}

export { monitor };