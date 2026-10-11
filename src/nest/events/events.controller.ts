import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { EventsService } from './events.service.js';

@Controller()
export class EventsController {
    constructor(
        private readonly eventsService: EventsService,
    ) { }

    // Получение всех событий монитора
    @Get('eaventsResolts/:monitorId')
    getMonitorEvents(
        @Param('monitorId', ParseIntPipe) monitorId: number,
    ) {
        return this.eventsService.getMonitorEvents(monitorId);
    }
}