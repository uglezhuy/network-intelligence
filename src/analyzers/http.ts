async function HTTP_Analyzer(target: string) {
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
    responseTime: responseTime,
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
export { HTTP_Analyzer };