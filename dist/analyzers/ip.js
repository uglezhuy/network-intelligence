"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IP_Analyzer = IP_Analyzer;
async function IP_Analyzer(ip) {
    const response = await fetch(`https://api.ipapi.is/?q=${ip}`);
    const data = await response.json();
    return data;
}
