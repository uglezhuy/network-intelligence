import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';


@Injectable()
export class EventsService {
    constructor(
        private readonly prisma: PrismaService,
    ) { }

    async getMonitorEvents(monitorId: number) {
        const events = await this.prisma.monitor_events.findMany({
            where: {
                monitor_id: monitorId,
            },
            orderBy: {
                created_at: 'desc',
            },
        });

        console.log(`Все события монитора ${monitorId}:`, events);

        return events;
    }
}