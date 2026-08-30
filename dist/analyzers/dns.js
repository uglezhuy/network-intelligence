"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDNS = getDNS;
const promises_1 = __importDefault(require("node:dns/promises"));
async function getDNS(domain) {
    const addresses = await Promise.allSettled([
        promises_1.default.resolve4(domain),
        promises_1.default.resolve6(domain),
        promises_1.default.resolveMx(domain),
        promises_1.default.resolveNs(domain),
    ]);
    return {
        ipv4: addresses[0],
        ipv6: addresses[1],
        mx: addresses[2],
        ns: addresses[3],
    };
}
