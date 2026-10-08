import { IncomingMessage, ServerResponse } from "node:http";
import { showMonitorsByUser } from "../showMonitorsByUser";

import { analyzers } from "../analyzers";
import { analyzersAPICrt } from "../analyzers";

import { getDashboardByUser } from "../getDashboardByUser";

import { saveResultinScan } from "../database/results";
import { saveResultinScanAPICrt } from "../database/results";
import { getScanCountByUser } from "../database/results";


import { stopMonitorID } from "../stopMonitor"
import { startMonitorID } from "../startMonitorID"
import { deleteMonitorID } from "../deleteMonitor"
import { MonitorFullResultByID } from "../MonitorFullResultByID";
import { EaventsFullResultByID } from "../EaventsFullResultByID";
import { MonitorHistoryByID } from "../graphics/MonitorHistoryByID";
import { monitor } from "../monitor"


async function handleApiRequest(
    req: IncomingMessage,
    res: ServerResponse
) {



    const TEST_USER_ID = 503362430; //временный тг айди  для тестов




    console.log("REQUEST:", req.method, req.url);

    res.setHeader("Access-Control-Allow-Origin", "*");

    res.setHeader(
        "Access-Control-Allow-Methods",
        "GET, POST, OPTIONS"
    );

    res.setHeader(
        "Access-Control-Allow-Headers",
        "Content-Type"
    );

    if (req.method === "OPTIONS") {
        res.writeHead(204);
        res.end();
        return;
    }






    // /api/monitorHistory/ //////////////////////////////////////////////////////////////////////////////
    if (
        req.method === "GET" &&
        req.url?.startsWith("/api/monitorHistory/")
    ) {
        console.log("ROUTE: /api/monitorHistory/");

        const afterBase = req.url.split("/api/monitorHistory/")[1];

        if (!afterBase) {
            res.writeHead(400, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ error: "Некорректный id монитора" }));
            return;
        }

        const [monitorId, query] = afterBase.split("?");
        const params = new URLSearchParams(query ?? "");
        const period = params.get("period");

        console.log("Monitor ID:", monitorId);
        console.log("period:", period);

        try {
            const history = await MonitorHistoryByID(Number(monitorId), period);

            res.writeHead(200, { "Content-Type": "application/json" });
            res.end(JSON.stringify(history));
        } catch (error) {
            console.error("Ошибка API:", error);
            res.writeHead(500, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ error: "Ошибка сервера" }));
        }
        return;
    }







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















    // /api/scanCount/ //////////////////////////////////////////////////////////////////////////////
    if (
        req.method === "GET" &&
        req.url?.startsWith("/api/scanCount/")
    ) {
        console.log("ROUTE: /api/scanCount/");

        const telegramUserId = Number(
            req.url.split("/api/scanCount/")[1]
        );

        if (!Number.isInteger(telegramUserId)) {
            res.writeHead(400, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ error: "Некорректный Telegram User ID" }));
            return;
        }

        try {
            const count = await getScanCountByUser(telegramUserId);
            res.writeHead(200, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ scanCount: count }));
        } catch (error) {
            console.error("Ошибка API:", error);
            res.writeHead(500, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ error: "Ошибка сервера" }));
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

        const params =
            req.url.split("/api/scan/")[1].split("/");

        const target = params[0];
        const TEST_USER_ID = params[1];
        const TEST_PLATFORM = params[2];

        console.log("Target:", target);
        console.log("User ID:", TEST_USER_ID);
        console.log("Platform:", TEST_PLATFORM);

        if (!target || !TEST_USER_ID || !TEST_PLATFORM) {
            res.writeHead(400, {
                "Content-Type": "application/json"
            });

            res.end(JSON.stringify({
                error: "Необходимо передать target, userId и platform"
            }));

            return;
        }

        try {
            console.log("Запускаем analyzers:", target);

            const scanResult =
                await analyzers(target);

            console.log("Сканирование завершено");

            await saveResultinScan(
                scanResult,
                Number(TEST_USER_ID),
                TEST_PLATFORM

            );


            /////////////////////////////////
            // для раьоыт апи чтоб без https и http  и без слешей в конце
            const url = target.startsWith("http")
                ? target
                : `https://${target}`;

            const hostname = new URL(url).hostname;



            let scanResultAPICrt: any = null;
            try {
                scanResultAPICrt =
                    await analyzersAPICrt(hostname);

                //////////////////////

                console.log("Сканирование crt.sh завершено");

                await saveResultinScanAPICrt(
                    scanResultAPICrt,
                    target,
                    Number(TEST_USER_ID),
                    TEST_PLATFORM
                );
            } catch (error) {
                console.error("Ошибка crt.sh:", error);
            }


            console.log("Результат сохранен в базе данных");

            res.writeHead(200, {
                "Content-Type": "application/json"
            });

            res.end(JSON.stringify({
                scan: scanResult,
                subdomains: scanResultAPICrt
            }));

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


    // /api/monitorsResolts/ //////////////////////////////////////////////////////////////////////////////


    if (req.method === "GET" && req.url?.startsWith("/api/monitorsResolts/")) {
        console.log("ROUTE: /api/monitorsResolts/");

        const target = req.url.split("/api/monitorsResolts/")[1];

        console.log("Target:", target);

        if (!target) {
            res.writeHead(400, {
                "Content-Type": "application/json"
            });

            res.end(JSON.stringify({
                error: "Некорректный id монитора"
            }));

            return;
        }
        try {
            console.log("Запускаем вывод всех мониторов по id:", target);

            const FullMonitorsResultByID = await MonitorFullResultByID(target);




            res.writeHead(200, {
                "Content-Type": "application/json"
            });

            res.end(JSON.stringify(FullMonitorsResultByID));



        }
        catch (error) {
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



    // /api/eaventsResolts/ //////////////////////////////////////////////////////////////////////////////






    //http://localhost:3000/api/monitorHistory/176?days=1


    if (req.method === "GET" && req.url?.startsWith("/api/eaventsResolts/")) {
        console.log("ROUTE: /api/eaventsResolts/");

        const target = req.url.split("/api/eaventsResolts/")[1];

        console.log("Target:", target);

        if (!target) {
            res.writeHead(400, {
                "Content-Type": "application/json"
            });

            res.end(JSON.stringify({
                error: "Некорректный id монитораСобытий"
            }));

            return;
        }
        try {
            console.log("Запускаем вывод всех СобытийМониторов по id:", target);

            const FullEaventsResultByID = await EaventsFullResultByID(Number(target));



            res.writeHead(200, {
                "Content-Type": "application/json"
            });

            res.end(JSON.stringify(FullEaventsResultByID));



        }
        catch (error) {
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













    //////////////////////addMonitor
    if (req.url === "/api/addMonitor" && req.method === "POST") {
        console.log("ROUTE: /api/addMonitor");

        let body = "";

        req.on("data", (chunk) => {
            body += chunk;
        });

        req.on("end", async () => {
            try {
                const data = JSON.parse(body);

                const target = data.target;
                const min = data.interval_minutes;
                const minCrtSh = data.minCrtSh;

                const sendMonitorNotificationsBot =
                    data.send_monitor_notificationsTG ?? false;

                const sendEventNotificationsBot =
                    data.send_event_notificationsTG ?? false;

                const sendMonitorNotificationsMAX =
                    data.send_monitor_notificationsMAX ?? false;

                const sendEventNotificationsMAX =
                    data.send_event_notificationsMAX ?? false;

                console.log("URL:", target);
                console.log("MIN:", min);
                console.log("MINCRTSH:", minCrtSh);

                console.log(
                    "TG:",
                    sendMonitorNotificationsBot,
                    sendEventNotificationsBot
                );

                console.log(
                    "MAX:",
                    sendMonitorNotificationsMAX,
                    sendEventNotificationsMAX
                );

                if (!target) {
                    res.writeHead(400, {
                        "Content-Type": "application/json",
                    });

                    res.end(
                        JSON.stringify({
                            error: "Некорректный URL",
                        })
                    );

                    return;
                }

                console.log("Добавление монитора:", target);

                await monitor(
                    target,
                    Number(min),
                    minCrtSh,
                    "monitors",
                    sendMonitorNotificationsBot,
                    sendEventNotificationsBot,
                    sendMonitorNotificationsMAX,
                    sendEventNotificationsMAX,
                    TEST_USER_ID,
                    "web"
                );

                res.writeHead(200, {
                    "Content-Type": "application/json",
                });

                res.end(
                    JSON.stringify({
                        message: "Монитор добавлен",
                    })
                );
            } catch (error) {
                console.error("Ошибка API:", error);

                res.writeHead(500, {
                    "Content-Type": "application/json",
                });

                res.end(
                    JSON.stringify({
                        error: "Ошибка сервера",
                    })
                );
            }
        });

        return;
    }









    ///////////////////////eavents
    if (
        req.method === "GET" &&
        req.url?.startsWith("/api/eavents/")
    ) {
        console.log("ROUTE: /api/eavents/");

        const target =
            req.url.split("/api/eavents/")[1];

        console.log("id monitor for eavents:", target);

        if (!target) {
            res.writeHead(400, {
                "Content-Type": "application/json"
            });

            res.end(JSON.stringify({
                error: "Некорректный id монитора"
            }));

            return;
        }

        try {
            console.log("Запускаем analyzers:", target);

            const scanResult =
                await analyzers(target);

            console.log("Сканирование завершено");
            await saveResultinScan(scanResult, TEST_USER_ID);
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








    // /api/dashboard/ //////////////////////////////////////////////////////////////

    if (
        req.method === "GET" &&
        req.url?.startsWith("/api/dashboard/")
    ) {
        console.log("ROUTE: /api/dashboard/");

        const userId = Number(
            req.url.split("/api/dashboard/")[1]
        );

        console.log("Dashboard User ID:", userId);

        if (!Number.isInteger(userId)) {
            res.writeHead(400, {
                "Content-Type": "application/json"
            });

            res.end(JSON.stringify({
                error: "Некорректный User ID"
            }));

            return;
        }

        try {
            const dashboard =
                await getDashboardByUser(userId);

            res.writeHead(200, {
                "Content-Type": "application/json"
            });

            res.end(JSON.stringify(dashboard));

        } catch (error) {
            console.error("Ошибка Dashboard API:", error);

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


            await startMonitorID(Number(target));

            console.log("Запуск завершено");

            res.writeHead(200, {
                "Content-Type": "application/json"
            });



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



    //удаление //////////////////////////////////////////////////////////////////////////////
    if (
        req.method === "GET" &&
        req.url?.startsWith("/api/deleteMonitor/")
    ) {
        console.log("ROUTE: /api/deleteMonitor/");

        const target =
            req.url.split("/api/deleteMonitor/")[1];

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
            console.log("Запускаем deleteMonitorID:", target);


            await deleteMonitorID(target);

            console.log("Удаление завершено");

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
