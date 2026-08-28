const dns = require("node:dns/promises");

const tls = require("node:tls");

console.log("Network Intelligence");

const target = process.argv[2];

if (!target) {
  console.log("Usage: node index.js <domain>");
  process.exit(1);
}

console.log("Target:", target);

async function getDNS(domain) {
  const addresses = await Promise.allSettled([
    dns.resolve4(domain),

    dns.resolve6(domain),

    dns.resolveMx(domain),

    dns.resolveNs(domain),
  ]);

  return {
    ipv4: addresses[0],

    ipv6: addresses[1],

    mx: addresses[2],

    ns: addresses[3],
  };
}

// if (result.ipv4.status === "fulfilled") {
//   console.log("IPv4:", result.ipv4.value);
// } else {
//   console.log("No IPv4 found");
// }

// if (result.ipv6.status === "fulfilled") {
//   console.log("IPv6:", result.ipv6.value);
// } else {
//   console.log("No IPv6 found");
// }

// if (result.mx.status === "fulfilled") {
//   console.log("MX:", result.mx.value);
// } else {
//   console.log("No MX found");
// }

// if (result.ns.status === "fulfilled") {
//   console.log("NS:", result.ns.value);
// } else {
//   console.log("No NS found");
// }

async function HTTP_Analyzer(target) {
  const start = Date.now();
  const response = await fetch(target);
  const responseTime = Date.now() - start;

  console.log("Response time:", responseTime, "ms");
  const url = new URL(target);

  const protocol = url.protocol.replace(":", "").toUpperCase();

  const contentType = response.headers.get("content-type");
  const server = response.headers.get("server");
  const contentEncoding = response.headers.get("content-encoding");
  const contentLength = response.headers.get("content-length");

  const hsts = response.headers.get("strict-transport-security");
  const xFrameOptions = response.headers.get("x-frame-options");
  const csp = response.headers.get("content-security-policy");
  const xssProtection = response.headers.get("x-xss-protection");

  const body = await response.text();

  //  title страницы
  const titleMatch = body.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
  const title = titleMatch ? titleMatch[1].trim() : "Unknown";

  // Размер тела в KB
  const bodySize = new TextEncoder().encode(body).length;
  const bodySizeKB = (bodySize / 1024).toFixed(1);

  return {
    finalUrl: response.url,
    status: response.status,
    proto: protocol,
    contentType: contentType,
    server: server,
    contentEncoding: contentEncoding,
    contentLength: contentLength,
    hsts: hsts,
    xFrameOptions: xFrameOptions,
    csp: csp,
    xssProtection: xssProtection,
    title: title,
    bodySize: bodySize,
    bodySizeKB: bodySizeKB,
  };
}

async function IP_Analyzer(ip) {
  const response = await fetch(`https://api.ipapi.is/?q=${ip}`);
  const data = await response.json();
  return data;
}

async function TLS_Analyzer(hostname) {
  const socket = tls.connect({ host: hostname, port: 443 });

  return new Promise((resolve) => {
    socket.on("secureConnect", (data) => {
      const Protocol = socket.getProtocol();
      const getCertificate = socket.getPeerCertificate();

      resolve({ Protocol: Protocol, getCertificate: getCertificate });

      socket.destroy();
    });
  });
}

async function main() {
  const url = target.startsWith("http") ? target : `https://${target}`;

  const hostname = new URL(url).hostname;

  console.log("==============DNS info================");
  const dnsInfo = await getDNS(hostname);
  console.log("IP:", dnsInfo.ipv4.value[0]);
  console.log(dnsInfo);

  console.log("==============HTTP info================");

  const HTTPInfo = await HTTP_Analyzer(url);
  console.log(HTTPInfo);

  console.log("==============IP info================");

  const IPInfo = await IP_Analyzer(dnsInfo.ipv4.value[0]);
  console.log(IPInfo);

  console.log("==============TLS info================");
  const TLSInfo = await TLS_Analyzer(hostname);
  console.log(TLSInfo);
}

main();
