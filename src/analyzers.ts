import { getDNS } from "./analyzers/dns.js";
import { HTTP_Analyzer } from "./analyzers/http.js";
import { PORT_Analyzer } from "./analyzers/ports.js";
import { IP_Analyzer } from "./analyzers/ip.js";
import { TLS_Analyzer } from "./analyzers/tls.js";


function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }

  return String(error);
}

function getAnalyzerResult<T>(
  name: string,
  result: PromiseSettledResult<T>
): T | { error: string } {
  if (result.status === "fulfilled") {
    return result.value;
  }

  const message = getErrorMessage(result.reason);

  console.error(`Ошибка анализатора ${name}:`, message);

  return {
    error: message,
  };
}

async function analyzers(target: string) {
  const url = target.startsWith("http")
    ? target
    : `https://${target}`;

  const hostname = new URL(url).hostname;

  // DNS
  let dnsInfo: Awaited<ReturnType<typeof getDNS>> | { error: string };

  try {
    dnsInfo = await getDNS(hostname);
  } catch (error) {
    const message = getErrorMessage(error);

    console.error("Ошибка анализатора DNS:", message);

    dnsInfo = { error: message };
  }

  //
  let ip = "";

  if ("ipv4" in dnsInfo && dnsInfo.ipv4.status === "fulfilled") {
    ip = dnsInfo.ipv4.value[0];
  }


  const [
    httpResult,
    ipResult,
    tlsResult,
    portsResult,
  ] = await Promise.allSettled([
    HTTP_Analyzer(url),
    IP_Analyzer(ip),
    TLS_Analyzer(hostname),
    PORT_Analyzer(hostname),
  ]);


  const result = {
    target: target,
    hostname: hostname,
    dns: dnsInfo,
    http: getAnalyzerResult("HTTP", httpResult),
    ip: getAnalyzerResult("IP", ipResult),
    tls: getAnalyzerResult("TLS", tlsResult),
    ports: getAnalyzerResult("PORT", portsResult),
  };

  return result;
}

// https://api.ctlogs.dev  строня api лимиит примерно 5 запросов в минуту 
//РАнее был https://crt.sh/?q=%25.${target}&output=json.
// Поиск поддоменов через Certificate Transparency API (ctlogs.dev)
async function analyzersAPICrt(target: string): Promise<string[]> {
  const domain = target
    .trim()
    .toLowerCase()
    .replace(/\.$/, "");

  const subdomains = new Set<string>();

  let cursor = "";

  // Без API-ключа доступны первые 10 страниц по 100 записей.
  for (let page = 0; page < 10; page++) {
    const url = new URL(
      `/v1/subdomains/${encodeURIComponent(domain)}`,
      "https://api.ctlogs.dev"
    );

    if (cursor) {
      url.searchParams.set("after", cursor);
    }

    const response = await fetch(url);

    if (response.status === 429) {
      throw new Error(
        "ctlogs.dev: превышен лимит запросов (429)"
      );
    }

    if (response.status === 503) {
      throw new Error(
        "ctlogs.dev: сервис временно перегружен (503)"
      );
    }

    if (!response.ok) {
      throw new Error(
        `ctlogs.dev error: ${response.status} ${response.statusText}`
      );
    }

    const data = await response.json() as {
      rows: Array<{ match?: string }>;
      has_next: boolean;
      next_cursor: string;
      duration_ms?: number;
    };

    console.log(
      `ctlogs.dev: страница ${page + 1}, ` +
      `записей ${data.rows.length}, ` +
      `время ${data.duration_ms ?? "неизвестно"} мс`
    );

    for (const row of data.rows) {
      const hostname = row.match
        ?.trim()
        .toLowerCase()
        .replace(/^\*\./, "")
        .replace(/\.$/, "");

      if (
        hostname &&
        hostname.endsWith(`.${domain}`) &&
        hostname !== domain
      ) {
        subdomains.add(hostname);
      }
    }

    if (!data.has_next) {
      break;
    }

    cursor = data.next_cursor;

    if (!cursor) {
      break;
    }
  }

  return [...subdomains].sort();
}



export { analyzers, analyzersAPICrt };