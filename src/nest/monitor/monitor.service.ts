import {
    BadRequestException,
    Injectable,
    InternalServerErrorException,
    NotImplementedException,
} from '@nestjs/common';


import { runMonitor } from '../../monitor.js';
import { PrismaService } from '../prisma/prisma.service.js';



type MonitorDto = {
    target: string;
    interval_minutes: number;
    minCrtSh: number;

    telegram_user_id: string | number;
    platform: string;

    send_monitor_notificationsTG: boolean;
    send_event_notificationsTG: boolean;

    send_monitor_notificationsMAX: boolean;
    send_event_notificationsMAX: boolean;

    includeSubdomains: boolean;
};
@Injectable()
export class MonitorService {
    constructor(
        private readonly prisma: PrismaService,
    ) { }

    // Получение мониторов пользователя
    async getMonitorsByUser(userId: string) {
        const telegramUserId = Number(userId);

        if (!Number.isSafeInteger(telegramUserId)) {
            throw new BadRequestException(
                'Некорректный User ID',
            );
        }

        try {
            const monitorsByUser =
                await this.prisma.monitors.findMany({
                    where: {
                        telegram_user_id: BigInt(telegramUserId),
                    },
                });

            return monitorsByUser.map((monitor) => ({
                ...monitor,
                telegram_user_id:
                    monitor.telegram_user_id?.toString() ?? null,
            }));
        } catch (error) {
            console.error(
                'Ошибка получения мониторов:',
                error,
            );

            throw new InternalServerErrorException(
                'Ошибка сервера при получении мониторов',
            );
        }
    }

    // Остановка монитора
    async stopMonitor(monitorId: string) {
        const id = Number(monitorId);

        if (!Number.isSafeInteger(id) || id <= 0) {
            throw new BadRequestException(
                'Некорректный ID монитора',
            );
        }

        try {
            const result =
                await this.prisma.monitors.updateMany({
                    where: {
                        id,
                        status: 'active',
                    },
                    data: {
                        status: 'stopped',
                    },
                });

            if (result.count === 0) {
                throw new BadRequestException(
                    'Активный монитор не найден',
                );
            }

            return {
                message: 'Монитор остановлен',
                monitorId: id,
            };
        } catch (error) {
            if (error instanceof BadRequestException) {
                throw error;
            }

            console.error(
                'Ошибка остановки монитора:',
                error,
            );

            throw new InternalServerErrorException(
                'Ошибка сервера при остановке монитора',
            );
        }
    }

    // Запуск монитора
    async startMonitor(monitorId: string) {
        const id = Number(monitorId);

        if (!Number.isSafeInteger(id) || id <= 0) {
            throw new BadRequestException(
                'Некорректный ID монитора',
            );
        }

        try {

            const result = await this.prisma.monitors.updateMany({
                where: {
                    id,
                    status: 'stopped',
                },
                data: {
                    status: 'active',
                },
            });

            if (result.count === 0) {
                const monitor = await this.prisma.monitors.findUnique({
                    where: { id },
                });

                if (!monitor) {
                    throw new BadRequestException(
                        'Монитор не найден',
                    );
                }

                throw new BadRequestException(
                    'Монитор уже запущен',
                );
            }

            const monitor = await this.prisma.monitors.findUnique({
                where: { id },
            });

            if (!monitor) {
                throw new BadRequestException(
                    'Монитор не найден',
                );
            }

            console.log(
                'Запускаем монитор:',
                monitor.id,
                monitor.target,
                monitor.interval_minutes.toString(),
                monitor.type,
            );

            // 3. Запускаем цикл проверок
            runMonitor(
                monitor.id,
                monitor.target,
                Number(monitor.interval_minutes),
                monitor.type ?? '',
                monitor.platform ?? '',

                monitor.send_monitor_notificationsTG,
                monitor.send_event_notificationsTG,

                monitor.send_monitor_notificationsMAX,
                monitor.send_event_notificationsMAX,

                monitor.telegram_user_id === null
                    ? undefined
                    : Number(monitor.telegram_user_id),
            );

            // ответ клиенту
            return {
                message: 'Монитор запущен',
                monitorId: id,
            };
        } catch (error) {
            if (error instanceof BadRequestException) {
                throw error;
            }

            console.error(
                'Ошибка запуска монитора:',
                error,
            );

            throw new InternalServerErrorException(
                'Ошибка сервера при запуске монитора',
            );
        }
    }

    // Удаление монитора
    async deleteMonitor(monitorId: string) {
        const id = Number(monitorId);

        if (!Number.isSafeInteger(id) || id <= 0) {
            throw new BadRequestException(
                'Некорректный ID монитора',
            );
        }

        try {
            const monitor = await this.prisma.monitors.findUnique({
                where: { id },
            });

            if (!monitor) {
                throw new BadRequestException(
                    'Монитор не найден',
                );
            }

            await this.prisma.monitors.delete({
                where: { id },
            });

            return {
                message: 'Монитор удалён',
                monitorId: id,
            };
        } catch (error) {
            if (error instanceof BadRequestException) {
                throw error;
            }

            console.error('Ошибка удаления монитора:', error);

            throw new InternalServerErrorException(
                'Ошибка сервера при удалении монитора',
            );
        }
    }





    // добавлене монитра 
    // Добавление монитора

    async addMonitor(data: MonitorDto) {
        try {
            const monitor = await this.prisma.monitors.create({
                data: {
                    target: data.target,
                    interval_minutes: data.interval_minutes,
                    subdomain_scan_interval_hours: data.minCrtSh,

                    status: 'active',
                    type: 'monitors',
                    platform: data.platform,
                    telegram_user_id: BigInt(data.telegram_user_id),

                    send_monitor_notificationsTG:
                        data.send_monitor_notificationsTG,

                    send_event_notificationsTG:
                        data.send_event_notificationsTG,

                    send_monitor_notificationsMAX:
                        data.send_monitor_notificationsMAX,

                    send_event_notificationsMAX:
                        data.send_event_notificationsMAX,

                    subdomain_scan_enabled:
                        data.includeSubdomains,
                },
            });

            // Запускаем мониторинг после создания записи
            runMonitor(
                monitor.id,
                monitor.target,
                Number(monitor.interval_minutes),
                monitor.type ?? '',
                monitor.platform ?? '',
                monitor.send_monitor_notificationsTG,
                monitor.send_event_notificationsTG,
                monitor.send_monitor_notificationsMAX,
                monitor.send_event_notificationsMAX,
                monitor.telegram_user_id === null
                    ? undefined
                    : Number(monitor.telegram_user_id),
            );

            return {
                message: 'Монитор добавлен',
                monitorId: monitor.id,
            };
        } catch (error) {
            console.error('Ошибка добавления монитора:', error);

            throw new InternalServerErrorException(
                'Ошибка сервера при добавлении монитора',
            );
        }
    }









    // вывод результтатов монироринга по id 
    async getMonitorResult(monitorId: number) {
        const monitorResult = await this.prisma.monitor_results.findMany({
            where: {
                monitor_id: monitorId,
            },
            orderBy: {
                created_at: 'desc',
            },
        });

        return monitorResult;
    }


    // отображения истри сканов идя грифков 
    async getMonitorHistory(monitorId: number, period?: string) {
        const hoursByPeriod: Record<string, number> = {
            '1h': 1,
            '6h': 6,
            '24h': 24,
            '7d': 24 * 7,
            '30d': 24 * 30,
        };

        const hours = period ? hoursByPeriod[period] : undefined;

        const monitorHistory = await this.prisma.monitor_results.findMany({
            where: {
                monitor_id: monitorId,
                ...(hours !== undefined && {
                    created_at: {
                        gte: new Date(Date.now() - hours * 60 * 60 * 1000),
                    },
                }),
            },
            orderBy: {
                created_at: 'asc',
            },
        });

        return monitorHistory.map((row) => {
            const data =
                typeof row.data === 'string'
                    ? JSON.parse(row.data)
                    : row.data;

            return {
                id: row.id,
                time: row.created_at,
                status: data?.http?.status ?? null,
                responseTime: data?.http?.responseTime ?? null,
                bodySizeKB: data?.http?.bodySizeKB ?? null,
                fullDattaOnlyForTesting: data,
            };
        });
    }














}