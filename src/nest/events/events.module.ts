import { Module } from '@nestjs/common';

import { EventsController } from './events.controller';
import { EventsService } from './events.service';
import { PrismaModule } from '../prisma/prisma.module.js';


@Module({
    imports: [PrismaModule],
    controllers: [EventsController],
    providers: [EventsService],
})
export class EventsModule { }