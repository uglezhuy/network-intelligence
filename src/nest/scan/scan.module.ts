import { Module } from '@nestjs/common';
import { ScanController } from './scan.controller.js';
import { ScanService } from './scan.service.js';
import { PrismaModule } from '../prisma/prisma.module.js';

@Module({
    imports: [PrismaModule],
    controllers: [ScanController],
    providers: [ScanService],
})
export class ScanModule { }