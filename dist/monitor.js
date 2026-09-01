"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.monitor = monitor;
const analyzers_js_1 = require("./analyzers.js");
const results_js_1 = require("./database/results.js");
const results_js_2 = require("./database/results.js");
const results_js_3 = require("./database/results.js");
function wait(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
async function monitor(target, min) {
    console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!use monitor function");
    const monitorId = await (0, results_js_1.saveResultinMonitors)(target, min);
    console.log("Monitor created. ID:", monitorId);
    const results = [];
    let i = 0;
    let StateMonitorById = true;
    while (StateMonitorById) {
        i++;
        const result = await (0, analyzers_js_1.analyzers)(target);
        await (0, results_js_2.saveInMonitor_results)(result, monitorId);
        results.push(result);
        console.log("============================ ТЕСТ " + i + "============================");
        console.log(results);
        const flag = await (0, results_js_3.checkStateMonitorById)(monitorId);
        if (flag == "stopped") {
            StateMonitorById = false;
            console.log("Monitor stopped");
            break;
        }
        await wait(min * 60 * 100);
    }
}
