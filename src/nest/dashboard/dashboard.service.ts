import { Injectable } from '@nestjs/common';
import { MonitorService } from '../monitor/monitor.service';
import { PrismaService } from '../prisma/prisma.service';


@Injectable()
export class DashboardService {
    constructor(
        private readonly monitorService: MonitorService,
        private readonly prisma: PrismaService,
    ) { }

    async getDashboard(userId: string) {
        const monitors = await this.monitorService.getMonitorsByUser(userId);

        const events = [];
        let eventCount = 0;

        for (const monitor of monitors) {
            const monitorEvents = await this.prisma.monitor_events.findMany({
                where: {
                    monitor_id: monitor.id,
                },
                orderBy: {
                    created_at: 'desc',
                },
            });

            eventCount += monitorEvents.length;

            if (monitorEvents.length > 0) {
                events.push({
                    monitorId: monitor.id,
                    target: monitor.target,
                    event: monitorEvents[0]
                });
            }
        }

        const scanCount = await this.prisma.monitor_results.count({
            where: {
                monitors: {
                    telegram_user_id: BigInt(userId),
                },
            },
        });



        return {
            monitors,
            events,
            scanCount,
            eventCount
        };

    }
}