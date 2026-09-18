import { createServer } from "node:http";
import { handleApiRequest } from "./routes.js";

function startApiServer() {
    const server = createServer(async (req, res) => {
        await handleApiRequest(req, res);
    });

    server.listen(3000, () => {
        console.log("API server started: http://localhost:3000");
    });
}


export { startApiServer };