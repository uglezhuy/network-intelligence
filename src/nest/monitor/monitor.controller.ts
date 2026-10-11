import { Controller, Get, Param, Patch, Delete, Post, Body, Query } from '@nestjs/common'; import { MonitorService } from './monitor.service';
@Controller()
export class MonitorController {
    constructor(
        private readonly monitorService: MonitorService,
    ) { }

    // список моинтров пользователя
    @Get('monitorsUser/:userId')

    getMonitorsByUser(
        @Param('userId') userId: string,
    ) {
        return this.monitorService.getMonitorsByUser(userId);
    }

    // остановка монитора
    @Patch('stopMonitor/:monitorId')
    stopMonitor(
        @Param('monitorId') monitorId: string,
    ) {
        return this.monitorService.stopMonitor(monitorId);
    }

    // запуск монитора
    @Patch('startMonitor/:monitorId')
    startMonitor(
        @Param('monitorId') monitorId: string,
    ) {
        return this.monitorService.startMonitor(monitorId);
    }

    // удаление монитора
    @Delete('deleteMonitor/:monitorId')
    deleteMonitor(
        @Param('monitorId') monitorId: string,
    ) {
        return this.monitorService.deleteMonitor(monitorId);
    }
    //  добаление нового монитра
    @Post('addMonitor')
    addMonitor(@Body() data: {
        target: string;
        interval_minutes: number;
        minCrtSh: number;

        telegram_user_id: number;
        platform: string;

        send_monitor_notificationsTG: boolean;
        send_event_notificationsTG: boolean;
        send_monitor_notificationsMAX: boolean;
        send_event_notificationsMAX: boolean;
        includeSubdomains: boolean;
    }) {
        return this.monitorService.addMonitor(data);
    }



    // вывод результтатов монироринга по id 
    @Get('monitorResult/:monitorId')
    getMonitorResult(
        @Param('monitorId') monitorId: string,
    ) {
        return this.monitorService.getMonitorResult(Number(monitorId));
    }


    // отображения истри сканов идя грифков 
    @Get('monitorHistory/:monitorId')
    getMonitorHistory(
        @Param('monitorId') monitorId: string,
        @Query('period') period: string,
    ) {
        return this.monitorService.getMonitorHistory(
            Number(monitorId),
            period,
        );
    }







}