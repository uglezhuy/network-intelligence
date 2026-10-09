
import { analyzers } from "./analyzers.js";
import { analyzersAPICrt } from "./analyzers.js";

import { saveResultinMonitors } from "./database/results.js";
import { saveInMonitor_results } from "./database/results.js";
import { checkStateMonitorById } from "./database/results.js";
import { saveInMonitor_resultsAPICrt } from "./database/results.js";

import { monitor_events } from "./monitor_events.js";

import { MaxPrintResultMonitor } from "./maxBot/tgPrintResultMonitor.js";
import { MaxPrintResultScan } from "./maxBot/MaxPrintResultScan.js";

import { tgPrintResultMonitor } from "./telegram/tgPrintResultMonitor.js";
import { tgPrintResultScan } from "./telegram/tgPrintResultScan.js";



function wait(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function monitor(
    target: string,
    min: number,
    minCrtSh: number,
    mode: string,
    sendMonitorNotificationsBot: boolean,
    sendEventNotificationsBot: boolean,

    sendMonitorNotificationsMAX: boolean,
    sendEventNotificationsMAX: boolean,

    includeSubdomains: boolean,

    platform: string = "web",

    telegramUserId?: number,



) {

    let monitorId: number;

    if (telegramUserId) {

        monitorId = await saveResultinMonitors(
            target,
            min,
            minCrtSh,
            mode,
            sendMonitorNotificationsBot,
            sendEventNotificationsBot,

            sendMonitorNotificationsMAX,
            sendEventNotificationsMAX,
            includeSubdomains,
            telegramUserId,
            platform,



        );

    } else {

        monitorId = await saveResultinMonitors(
            target,
            min,
            minCrtSh,
            mode,
            false,
            false,
            false,
            false,
            true,
            undefined,
            platform
        );
    }

    console.log("Monitor created. ID:", monitorId);

    runMonitor(
        monitorId,
        target,
        min,

        mode,

        platform,

        sendMonitorNotificationsBot,
        sendEventNotificationsBot,

        sendMonitorNotificationsMAX,
        sendEventNotificationsMAX,

        telegramUserId
    );
    runSubdomainScan(target, monitorId, minCrtSh);

}

async function runMonitor(
    monitorId: number,
    target: string,
    min: number,

    mode: string,

    platform: string, // tg max web 

    send_monitor_notificationsTG: boolean,
    send_event_notificationsTG: boolean,

    send_monitor_notificationsMAX: boolean,
    send_event_notificationsMAX: boolean,

    telegramUserId?: number
) {
    let StateMonitorById = true;
    let i = 0;

    while (StateMonitorById) {
        i++;

        try {
            const result = await analyzers(target);

            await saveInMonitor_results(result, monitorId);

            console.log(
                "============================ ТЕСТ " +
                i +
                "============================"
            );

            console.log(
                "Monitor ID:",
                monitorId
            );

            console.log(
                "Telegram User ID:",
                telegramUserId
            );

            // /////////////////////for MAX////////////////////////
            if (send_monitor_notificationsMAX && telegramUserId && platform === "max") {
                await MaxPrintResultScan(
                    result,
                    telegramUserId
                );
            }

            ///////////////////////////////////////////////////
            // События проверяются всегда.
            // Уведомления ниже только определяют,
            // нужно ли отправлять найденное событие.

            const tgEvents = await monitor_events(monitorId);

            // /////////////////////for MAX////////////////////////
            if (send_event_notificationsMAX && telegramUserId && platform === "max") {
                if (telegramUserId && tgEvents.length > 0) {
                    await MaxPrintResultMonitor(
                        tgEvents[0],
                        telegramUserId,
                        target
                    );
                }
            }

            ///////////////////////////////////////////////////
            // переделать то что свреху и снизу вроде работает но поидеи рабоать не долдно полюбому что то сверху и снизу от этого комента 

            //////////////////////////////////////// for Telegram ///////////////////////////////////////////////////

            if (send_monitor_notificationsTG && telegramUserId) {
                await tgPrintResultScan(
                    result,
                    telegramUserId
                );
            }

            if (send_event_notificationsTG && telegramUserId) {
                console.log("tgEvents ready");

                if (telegramUserId && tgEvents.length > 0) {
                    await tgPrintResultMonitor(
                        tgEvents[0],
                        telegramUserId,
                        target
                    );

                }
            }

            //////////////////////////////////


        } catch (error) {
            console.log("Analyzer error:", error);
        }

        const flag = await checkStateMonitorById(monitorId);

        if (flag !== "active") {
            StateMonitorById = false;

            console.log("Monitor stopped or deleted");

            break;
        }


        await wait(min * 60 * 1000);
    }
}


async function runSubdomainScan(target: string, monitorId: number, interval: number) {

    let StateMonitorById = true;
    let i = 0;

    while (StateMonitorById) {
        i++;
        console.log(
            "============================ ТЕСТ поддоменов " +
            i +
            "============================"
        );

        console.log(
            "Monitor ID:",
            monitorId
        );
        try {
            const parts = target.split(".");
            const domain = parts.slice(-2).join(".");

            console.log("Запускаем проверку поддоменов:", domain);

            const resultCrtSh = await analyzersAPICrt(domain);

            console.log(
                "Найдено поддоменов:",
                resultCrtSh.length
            );

            await saveInMonitor_resultsAPICrt(
                resultCrtSh,
                monitorId
            );

            console.log("Результат поддоменов сохранён");
        } catch (error) {
            console.error(
                "Ошибка проверки поддоменов:",
                error
            );
        }



        await wait(interval * 60 * 1000);
    }

}

async function startActiveMonitors(activeMonitors: any) {

    for (const monitor of activeMonitors) {
        console.log(
            "востанволенные мониторы или ",
            monitor.id,
            monitor.target,
            monitor.interval_minutes,
            monitor.type,

            monitor.platform,

            monitor.send_monitor_notificationsTG,
            monitor.send_event_notificationsTG,

            monitor.send_monitor_notificationsMAX,
            monitor.send_event_notificationsMAX

        );

        runMonitor(
            monitor.id,
            monitor.target,
            monitor.interval_minutes,

            monitor.type,

            monitor.platform,

            monitor.send_monitor_notificationsTG,
            monitor.send_event_notificationsTG,

            monitor.send_monitor_notificationsMAX,
            monitor.send_event_notificationsMAX,

            monitor.telegram_user_id ?? undefined
        );
        console.log("структура monitor.subdomain_scan_enabled :", monitor.subdomain_scan_enabled);
        if (monitor.subdomain_scan_enabled === 1) {
            console.log("Запускаем проверку поддоменов для монитора:", monitor.id, monitor.target, monitor.subdomain_scan_interval_hours);
            runSubdomainScan(monitor.target, monitor.id, monitor.subdomain_scan_interval_hours);
        }
        else {
            console.log("Проверка поддоменов отключена для монитора:", monitor.id, monitor.target);
        }
        // важно доделать правльноую архитектру линит примерно 5 за минутут если будет 5 мониторов то лимит В С Е :(
        await new Promise(resolve => setTimeout(resolve, 1000));
    }
}


export { monitor };
export { startActiveMonitors };
export { runMonitor };
