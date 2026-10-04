import { getDNS } from "./analyzers/dns.js";
import { HTTP_Analyzer } from "./analyzers/http.js";
import { PORT_Analyzer } from "./analyzers/ports.js";
import { IP_Analyzer } from "./analyzers/ip.js";
import { TLS_Analyzer } from "./analyzers/tls.js";


async function analyzers(target: string) {

  const url = target.startsWith("http") ? target : `https://${target}`;
  const hostname = new URL(url).hostname;

  //console.log("==============DNS info================");
  const dnsInfo = await getDNS(hostname);

  //console.log("==============HTTP info================");
  const HTTPInfo = await HTTP_Analyzer(url);

  //console.log("==============IP info(api.ipapi.is)================");
  let ip = "";
  if (dnsInfo.ipv4.status === "fulfilled") { ip = dnsInfo.ipv4.value[0]; }
  const IPInfo = await IP_Analyzer(ip);

  //console.log("==============TLS info================");
  const TLSInfo = await TLS_Analyzer(hostname);


  //console.log("==============PORT info================");
  const PORTInfo = await PORT_Analyzer(hostname);


  const result = {
    target: target,
    hostname: hostname,
    dns: dnsInfo,
    http: HTTPInfo,
    ip: IPInfo,
    tls: TLSInfo,
    ports: PORTInfo,
  };

  return result;
}

// https://crt.sh/?q=%25.${target}&output=json   строня api лимиит примерно 5 запросов в минуту 
async function analyzersAPICrt(target: string) {
  const response = await fetch(
    `https://crt.sh/?q=%25.${target}&output=json`
  );

  console.log("crt.sh status:", response.status);
  console.log(
    "crt.sh content-type:",
    response.headers.get("content-type")
  );

  const text = await response.text();

  console.log(
    "crt.sh response:",
    text.slice(0, 500)
  );

  if (!response.ok) {
    throw new Error(
      `crt.sh error: ${response.status} ${response.statusText}`
    );
  }

  const certificates = JSON.parse(text);

  const subdomains = new Set<string>();

  for (const certificate of certificates) {
    const names = certificate.name_value?.split("\n") || [];

    for (const name of names) {
      const hostname = name
        .trim()
        .toLowerCase()
        .replace(/^\*\./, "");

      if (
        hostname &&
        hostname.endsWith(`.${target}`) &&
        hostname !== target
      ) {
        subdomains.add(hostname);
      }
    }
  }

  return [...subdomains].sort();
}



export { analyzers, analyzersAPICrt };