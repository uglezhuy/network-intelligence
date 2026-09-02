import { analyzers } from "./analyzers.js";
import { monitor } from "./monitor.js";
import { printResult } from "./printResult.js";
import { saveResultinScan } from "./database/results.js";
import { stopMonitorID } from "./stopMonitor.js";
import { stopMonitorAll } from "./stopMonitor.js";




async function main() {

    const useFunction = process.argv[2];


    // SCAN
    

    if (useFunction == "scan") {

        console.log("use scan function");

        const target = process.argv[3];

        if (!target) {
            console.log("Usage: node dist/index.js scan <domain>");
            process.exit(1);
        }

        const result = await analyzers(target);

        await saveResultinScan(result);

        printResult(result);
    }


    // MONITOR

    else if (useFunction == "monitor") {

        console.log("use monitor function");

        const target = process.argv[3];


        // monitor stop <id>
        if (target == "stop") {

            const monitorId = process.argv[4];
            
            if (monitorId=='all') {
            await stopMonitorAll();return; }
            
            await stopMonitorID(monitorId);
            return;
        }


        // monitor <domain> <minutes>
        if (!target) {
            console.log("Usage: node dist/index.js monitor <domain> <minutes>");
            process.exit(1);
        }

        const min = Number(process.argv[4]);

        if (!min || min <= 0) {
            console.log("Usage: node dist/index.js monitor <domain> <minutes>");
            process.exit(1);
        }

        await monitor(target, min);
    }
    
    // UNKNOWN COMMAND

    else {
        console.log("Usage:");
        console.log("node dist/index.js scan <domain>");
        console.log("node dist/index.js monitor <domain> <minutes>");
        console.log("node dist/index.js monitor stop <monitorId>");
        console.log("node dist/index.js stop <monitorId>");

    }
}


main();