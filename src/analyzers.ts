import { getDNS } from "./analyzers/dns.js";
import { HTTP_Analyzer } from "./analyzers/http.js";
import { PORT_Analyzer } from "./analyzers/ports.js";
import { IP_Analyzer } from "./analyzers/ip.js";
import { TLS_Analyzer } from "./analyzers/tls.js";


async function analyzers(target: string) {
    

    console.log("Target:", target);

  const url = target.startsWith("http") ? target : `https://${target}`;
  const hostname = new URL(url).hostname;

  console.log("==============DNS info================");
  const dnsInfo = await getDNS(hostname);
  if (dnsInfo.ipv4.status === "fulfilled")
 {console.log("IP:", dnsInfo.ipv4.value[0]); }
  console.log(dnsInfo);

  console.log("==============HTTP info================");
  const HTTPInfo = await HTTP_Analyzer(url);
  console.log(HTTPInfo);

  console.log("==============IP info(api.ipapi.is)================");
  let ip = ""; 
  if (dnsInfo.ipv4.status === "fulfilled") 
  {ip = dnsInfo.ipv4.value[0];}
  const IPInfo = await IP_Analyzer(ip);

  console.log("==============TLS info================");
  const TLSInfo = await TLS_Analyzer(hostname);
  console.log(TLSInfo);

  console.log("==============PORT info================");
  const PORTInfo = await PORT_Analyzer(hostname);
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



export {analyzers}