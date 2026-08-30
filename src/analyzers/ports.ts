import net from "node:net";

async function PORT_Analyzer(hostname:string) {
  const ports = [21, 22, 25, 53, 80, 443, 8080];

  const results = await Promise.all(
    ports.map((port) => {
      return new Promise((resolve) => {
        const socket = net.createConnection({
          host: hostname,
          port: port,
        });

        socket.setTimeout(3000);

        socket.on("connect", () => {
          resolve({
            port: port,
            status: "open",
          });

          socket.destroy();
        });

        socket.on("timeout", () => {
          resolve({
            port: port,
            status: "timeout",
          });

          socket.destroy();
        });

        socket.on("error", (error:Error) => {
          resolve({
            port: port,
            status: "closed",
            error: error,
          });
        });
      });
    }),
  );
  return results;
}
export { PORT_Analyzer };