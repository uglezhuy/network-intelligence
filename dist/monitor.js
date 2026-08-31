"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.monitor = monitor;
const analyzers_js_1 = require("./analyzers.js");
function wait(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
async function monitor(target, min) {
    console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!use monitor function");
    const results = [];
    let i = 0;
    while (true) {
        i++;
        const result = await (0, analyzers_js_1.analyzers)(target);
        await wait(min * 60 * 100); // при 1 каждые 6 секунд 
        results.push(result);
        console.log("============================ ТЕСТ " + i + "============================");
        console.log(results);
    }
}
