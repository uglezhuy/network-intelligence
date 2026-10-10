import { Controller, Get, Param } from '@nestjs/common';
import { ScanService } from './scan.service.js';

@Controller('scan')
export class ScanController {
    constructor(
        private readonly scanService: ScanService,
    ) { }

    @Get(':target/:userId/:platform')
    scanWithUser(
        @Param('target') target: string,
        @Param('userId') userId: string,
        @Param('platform') platform: string,
    ) {
        return this.scanService.scan(
            target,
            Number(userId),
            platform,
        );
    }

    @Get(':target')
    scan(@Param('target') target: string) {
        return this.scanService.scan(target);
    }
}