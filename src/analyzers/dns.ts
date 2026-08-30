import dns from "node:dns/promises";


async function getDNS(domain: string) {
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

export { getDNS };