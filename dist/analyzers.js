"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.analyzers = analyzers;
const dns_js_1 = require("./analyzers/dns.js");
const http_js_1 = require("./analyzers/http.js");
const ports_js_1 = require("./analyzers/ports.js");
const ip_js_1 = require("./analyzers/ip.js");
const tls_js_1 = require("./analyzers/tls.js");
async function analyzers(target) {
    console.log("Target:", target);
    const url = target.startsWith("http") ? target : `https://${target}`;
    const hostname = new URL(url).hostname;
    console.log("==============DNS info================");
    const dnsInfo = await (0, dns_js_1.getDNS)(hostname);
    if (dnsInfo.ipv4.status === "fulfilled") {
        console.log("IP:", dnsInfo.ipv4.value[0]);
    }
    console.log(dnsInfo);
    console.log("==============HTTP info================");
    const HTTPInfo = await (0, http_js_1.HTTP_Analyzer)(url);
    console.log(HTTPInfo);
    console.log("==============IP info(api.ipapi.is)================");
    let ip = "";
    if (dnsInfo.ipv4.status === "fulfilled") {
        ip = dnsInfo.ipv4.value[0];
    }
    const IPInfo = await (0, ip_js_1.IP_Analyzer)(ip);
    console.log("==============TLS info================");
    const TLSInfo = await (0, tls_js_1.TLS_Analyzer)(hostname);
    console.log(TLSInfo);
    console.log("==============PORT info================");
    const PORTInfo = await (0, ports_js_1.PORT_Analyzer)(hostname);
    console.log(PORTInfo);
    const allResults = {
        target: target,
        hostname: hostname,
        dns: dnsInfo,
        http: HTTPInfo,
        ip: IPInfo,
        tls: TLSInfo,
        ports: PORTInfo,
    };
    console.log(allResults);
}
