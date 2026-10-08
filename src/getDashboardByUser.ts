import { showMonitorsByUser } from "./showMonitorsByUser";
import { EaventsFullResultByID } from "./EaventsFullResultByID";
import { getScanCountByUser } from "./database/results";

async function getDashboardByUser(userId: number) {
    const monitors = await showMonitorsByUser(userId);

    const events = [];
    let eventCount = 0;

    for (const monitor of monitors) {
        const monitorEvents =
            await EaventsFullResultByID(monitor.id);

        eventCount += monitorEvents.length;

        if (monitorEvents.length > 0) {
            events.push({
                monitorId: monitor.id,
                target: monitor.target,
                event: monitorEvents[0]
            });
        }
    }

    const scanCount =
        await getScanCountByUser(userId);

    return {
        monitors,
        events,
        scanCount,
        eventCount
    };
}

export { getDashboardByUser };