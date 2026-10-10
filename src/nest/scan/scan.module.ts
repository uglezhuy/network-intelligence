import { Module } from '@nestjs/common';
import { ScanController } from './scan.controller.js';
import { ScanService } from './scan.service.js';

@Module({
    controllers: [ScanController],
    providers: [ScanService],
})
export class ScanModule { }