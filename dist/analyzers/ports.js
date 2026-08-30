"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PORT_Analyzer = PORT_Analyzer;
const node_net_1 = __importDefault(require("node:net"));
async function PORT_Analyzer(hostname) {
    const ports = [21, 22, 25, 53, 80, 443, 8080];
    const results = await Promise.all(ports.map((port) => {
        return new Promise((resolve) => {
            const socket = node_net_1.default.createConnection({
                host: hostname,
                port: port,
            });
            socket.setTimeout(3000);
            socket.on("connect", () => {
                resolve({
                    port: port,
                    status: "open",
                });
                socket.destroy();
            });
            socket.on("timeout", () => {
                resolve({
                    port: port,
                    status: "timeout",
                });
                socket.destroy();
            });
            socket.on("error", (error) => {
                resolve({
                    port: port,
                    status: "closed",
                    error: error,
                });
            });
        });
    }));
    return results;
}
