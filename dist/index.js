"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const analyzers_js_1 = require("./analyzers.js");
const monitor_js_1 = require("./monitor.js");
const printResult_js_1 = require("./printResult.js");
const results_js_1 = require("./database/results.js");
const stopMonitor_js_1 = require("./stopMonitor.js");
const stopMonitor_js_2 = require("./stopMonitor.js");
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
        const result = await (0, analyzers_js_1.analyzers)(target);
        await (0, results_js_1.saveResultinScan)(result);
        (0, printResult_js_1.printResult)(result);
    }
    // MONITOR
    else if (useFunction == "monitor") {
        console.log("use monitor function");
        const target = process.argv[3];
        // monitor stop <id>
        if (target == "stop") {
            const monitorId = process.argv[4];
            if (monitorId == 'all') {
                await (0, stopMonitor_js_2.stopMonitorAll)();
                return;
            }
            await (0, stopMonitor_js_1.stopMonitorID)(monitorId);
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
        await (0, monitor_js_1.monitor)(target, min);
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
