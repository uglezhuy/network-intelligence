
import tls from "node:tls";

async function TLS_Analyzer(hostname:string) {
  const socket = tls.connect({
    host: hostname,
    port: 443,
    servername: hostname,
  });

  return new Promise((resolve, reject) => {
    socket.on("secureConnect", (data) => {
      const Protocol = socket.getProtocol();
      const getCertificate = socket.getPeerCertificate();

      resolve({ Protocol: Protocol, getCertificate: getCertificate });

      socket.destroy();
    });
    socket.on("error", (error:Error) => {
      reject(error);
    });
  });
}
export { TLS_Analyzer };