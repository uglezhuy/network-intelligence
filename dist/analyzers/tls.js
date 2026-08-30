"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TLS_Analyzer = TLS_Analyzer;
const node_tls_1 = __importDefault(require("node:tls"));
async function TLS_Analyzer(hostname) {
    const socket = node_tls_1.default.connect({
        host: hostname,
        port: 443,
        servername: hostname,
    });
    return new Promise((resolve, reject) => {
        socket.on("secureConnect", (data) => {
            const Protocol = socket.getProtocol();
            const getCertificate = socket.getPeerCertificate();
            resolve({ Protocol: Protocol, getCertificate: getCertificate });
            socket.destroy();
        });
        socket.on("error", (error) => {
            reject(error);
        });
    });
}
