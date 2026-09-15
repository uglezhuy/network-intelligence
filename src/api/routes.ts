import { IncomingMessage, ServerResponse } from "node:http";
import { showMonitorsByTelegramUserId } from "../telegram/selectMonitorsByTelegramUserId.js";

async function handleApiRequest(
    req: IncomingMessage,
    res: ServerResponse
) {

    //////////////////////////////////////////////////////////////////
    res.setHeader("Access-Control-Allow-Origin", "*");

    if (
        req.method === "GET" &&
        req.url?.startsWith("/api/monitors/")
    ) {
        const telegramUserId = Number(
            req.url.split("/api/monitors/")[1]
        );

        if (!Number.isInteger(telegramUserId)) {
            res.writeHead(400, {
                "Content-Type": "application/json"
            });

            res.end(JSON.stringify({
                error: "Некорректный Telegram User ID"
            }));

            return;
        }

        try {
            const monitors =
                await showMonitorsByTelegramUserId(telegramUserId);

            res.writeHead(200, {
                "Content-Type": "application/json"
            });

            res.end(JSON.stringify(monitors));
        } catch (error) {
            console.error("Ошибка API:", error);

            res.writeHead(500, {
                "Content-Type": "application/json"
            });

            res.end(JSON.stringify({
                error: "Ошибка сервера"
            }));
        }

        return;
    }

    res.writeHead(404, {
        "Content-Type": "application/json"
    });

    res.end(JSON.stringify({
        error: "Маршрут не найден"
    }));

    ////////////////////////////////////////////////////////////////////////





















}

export { handleApiRequest };