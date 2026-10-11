import { Controller, Get, Param, BadRequestException } from '@nestjs/common';
import { PrismaService } from './prisma.service.js';

@Controller()
export class PrismaController {
    constructor(
        private readonly prisma: PrismaService,
    ) { }

    @Get('prisma-check')
    async check() {
        const scansCount = await this.prisma.scans.count();

        return {
            status: 'ok',
            database: 'connected',
            scansCount,
        };
    }


}