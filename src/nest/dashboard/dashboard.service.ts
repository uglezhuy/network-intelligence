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

        const averageResponseTimeResult = await this.prisma.$queryRaw<
            { averageResponseTime: number | null }[]
        >`
    SELECT AVG(
        CAST(
            JSON_UNQUOTE(
                JSON_EXTRACT(mr.data, '$.http.responseTime')
            ) AS DECIMAL(10, 2)
        )
    ) AS averageResponseTime
    FROM monitor_results mr
    INNER JOIN monitors m ON m.id = mr.monitor_id
    WHERE m.telegram_user_id = ${BigInt(userId)}
      AND mr.result_type = 'monitor'
      AND JSON_EXTRACT(mr.data, '$.http.responseTime') IS NOT NULL
`;

        const averageResponseTime =
            averageResponseTimeResult[0]?.averageResponseTime ?? null;





        const smollInfoMonitors = await this.prisma.$queryRaw<any[]>`
    SELECT
        m.id AS monitorId,
        m.target,
        m.status,
        m.interval_minutes,

        ROUND(
            100.0 * SUM(
                CASE
                    WHEN CAST(
                        JSON_UNQUOTE(
                            JSON_EXTRACT(mr.data, '$.http.status')
                        ) AS UNSIGNED
                    ) BETWEEN 200 AND 399
                    THEN 1
                    ELSE 0
                END
            ) / NULLIF(COUNT(mr.id), 0),
            1
        ) AS availability,

        ROUND(
            AVG(
                CAST(
                    JSON_UNQUOTE(
                        JSON_EXTRACT(mr.data, '$.http.responseTime')
                    ) AS DECIMAL(10, 2)
                )
            ),
            0
        ) AS averageResponseTime,

        (
            SELECT mr2.created_at
            FROM monitor_results mr2
            WHERE mr2.monitor_id = m.id
              AND mr2.result_type = 'monitor'
            ORDER BY mr2.created_at DESC
            LIMIT 1
        ) AS lastCheckedAt

    FROM monitors m

    LEFT JOIN monitor_results mr
        ON mr.monitor_id = m.id
        AND mr.result_type = 'monitor'
        AND mr.created_at >= NOW() - INTERVAL 24 HOUR

    WHERE m.telegram_user_id = ${BigInt(userId)}

    GROUP BY
        m.id,
        m.target,
        m.status,
        m.interval_minutes
`;











        return {
            monitors,
            events,
            scanCount,
            eventCount,
            averageResponseTime,
            smollInfoMonitors
        };

    }
}