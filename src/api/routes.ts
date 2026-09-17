import { IncomingMessage, ServerResponse } from "node:http";
import { showMonitorsByUser } from "../showMonitorsByUser";
import { analyzers } from "../analyzers.js";
import { saveResultinScan } from "../database/results.js";
import { stopMonitorID } from "../stopMonitor.js"
import { startMonitorID } from "../startMonitor"



async function handleApiRequest(
    req: IncomingMessage,
    res: ServerResponse
) {



    const TEST_TELEGRAM_USER_ID = 503362430; //временный тг айди  для тестов




    console.log("REQUEST:", req.method, req.url);

    res.setHeader("Access-Control-Allow-Origin", "*");

    // /api/monitors//////////////////////////////////////////////////////////////////////////////
    if (
        req.method === "GET" &&
        req.url?.startsWith("/api/monitorsUser/")
    ) {
        console.log("ROUTE: /api/monitorsUser/");

        const telegramUserId = Number(
            req.url.split("/api/monitorsUser/")[1]
        );

        console.log("Telegram User ID:", telegramUserId);

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
                await showMonitorsByUser(telegramUserId);

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

    // /api/scan/ //////////////////////////////////////////////////////////////////////////////
    console.log("Проверяем scan route");
    console.log("Method:", req.method);
    console.log("URL:", req.url);
    console.log(
        "startsWith /api/scan/:",
        req.url?.startsWith("/api/scan/")
    );

    if (
        req.method === "GET" &&
        req.url?.startsWith("/api/scan/")
    ) {
        console.log("ROUTE: /api/scan/");

        const target =
            req.url.split("/api/scan/")[1];

        console.log("Target:", target);

        if (!target) {
            res.writeHead(400, {
                "Content-Type": "application/json"
            });

            res.end(JSON.stringify({
                error: "Некорректный URL"
            }));

            return;
        }

        try {
            console.log("Запускаем analyzers:", target);

            const scanResult =
                await analyzers(target);

            console.log("Сканирование завершено");
            await saveResultinScan(scanResult, TEST_TELEGRAM_USER_ID);
            console.log("Результат сохранен в базе данных");
            res.writeHead(200, {
                "Content-Type": "application/json"
            });

            res.end(JSON.stringify(scanResult));
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








    //остановка //////////////////////////////////////////////////////////////////////////////
    if (
        req.method === "GET" &&
        req.url?.startsWith("/api/stopMonitor/")
    ) {
        console.log("ROUTE: /api/stopMonitor/");

        const target =
            req.url.split("/api/stopMonitor/")[1];

        console.log("Target:", target);

        if (!target) {
            res.writeHead(400, {
                "Content-Type": "application/json"
            });

            res.end(JSON.stringify({
                error: "Некорректный URL"
            }));

            return;
        }

        try {
            console.log("Запускаем stopMonitorID:", target);


            await stopMonitorID(target);

            console.log("Отсановка завершено");

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
    ///////////////////////////////////////////////////////////////////////////////



    //запуск //////////////////////////////////////////////////////////////////////////////
    if (
        req.method === "GET" &&
        req.url?.startsWith("/api/startMonitor/")
    ) {
        console.log("ROUTE: /api/startMonitor/");

        const target =
            req.url.split("/api/startMonitor/")[1];

        console.log("Target:", target);

        if (!target) {
            res.writeHead(400, {
                "Content-Type": "application/json"
            });

            res.end(JSON.stringify({
                error: "Некорректный URL"
            }));

            return;
        }

        try {
            console.log("Запускаем startMonitorID:", target);


            await startMonitorID(target);

            console.log("Запуск завершено");

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
    ///////////////////////////////////////////////////////////////////////////////



































    // неизвестный маршрут ///////////////////////////////////////////////////////////////////////////////////
    console.log("ROUTE NOT FOUND");

    res.writeHead(404, {
        "Content-Type": "application/json"
    });

    res.end(JSON.stringify({
        error: "Маршрут не найден"
    }));
}

export { handleApiRequest };