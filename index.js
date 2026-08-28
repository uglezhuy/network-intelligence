const dns = require("node:dns/promises");

console.log("Network Intelligence");

const target = process.argv[2];

if (!target) {
  console.log("Usage: node index.js <domain>");
  process.exit(1);
}

console.log("Target:", target);

async function getIP(domain) {
  const addresses = await Promise.allSettled([
    dns.resolve4(domain),
    dns.resolve6(domain),
    dns.resolveMx(domain),
    dns.resolveNs(domain),
  ]);
  // тут уже это делать надо?

  const result = {
    ipv4: addresses[0],
    ipv6: addresses[1],
    mx: addresses[2],
    ns: addresses[3],
  };
  return result;
}

async function main() {
  const result = await getIP(target);

  if (result.ipv4.status === "fulfilled") {
    console.log("IPv4:", result.ipv4.value);
  } else {
    console.log("No IPv4 found");
  }

  if (result.ipv6.status === "fulfilled") {
    console.log("IPv6:", result.ipv6.value);
  } else {
    console.log("No IPv6 found");
  }

  if (result.mx.status === "fulfilled") {
    console.log("MX:", result.mx.value);
  } else {
    console.log("No MX found");
  }

  if (result.ns.status === "fulfilled") {
    console.log("NS:", result.ns.value);
  } else {
    console.log("No NS found");
  }
}

main();
