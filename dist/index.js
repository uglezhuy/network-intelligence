"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const analyzers_js_1 = require("./analyzers.js");
const monitor_js_1 = require("./monitor.js");
const printResult_js_1 = require("./printResult.js");
async function main() {
    const useFunction = process.argv[2];
    if (useFunction == 'scan') {
        console.log("use scan function");
        const target = process.argv[3];
        if (!target) {
            console.log("Usage: node index.js <domain>");
            process.exit(1);
        }
        const result = await (0, analyzers_js_1.analyzers)(target);
        (0, printResult_js_1.printResult)(result);
    }
    else if (useFunction == 'monitor') {
        console.log("use monitor function");
        const target = process.argv[3];
        if (!target) {
            console.log("Usage: node index.js <domain min>");
            process.exit(1);
        }
        const min = Number(process.argv[4]);
        if (!min) {
            console.log("Usage: node index.js <domain min>");
            process.exit(1);
        }
        await (0, monitor_js_1.monitor)(target, min);
    }
    else {
        console.log("for use scan *node dist/index.js scan google.com* for use monitor *node dist/index.js monitor 5*");
    }
}
main();
