import { BadRequestException, Injectable } from '@nestjs/common';
import { analyzers, analyzersAPICrt } from '../../analyzers.js';
import { saveResultinScan, saveResultinScanAPICrt } from '../../database/results.js';

import { PrismaService } from '../prisma/prisma.service.js';

@Injectable()
export class ScanService {
    constructor(
        private readonly prisma: PrismaService,
    ) { }
    async scan(
        target: string,
        userId?: number,
        platform?: string,
    ) {
        if (!target || !target.trim()) {
            throw new BadRequestException('URL/IP отсутствует');
        }

        target = target.trim();

        let url: URL;

        try {
            const hasProtocol = /^https?:\/\//i.test(target);

            url = new URL(
                hasProtocol ? target : `https://${target}`,
            );

            if (!['http:', 'https:'].includes(url.protocol)) {
                throw new Error('Недопустимый протокол');
            }

            if (!url.hostname) {
                throw new Error('Не указан домен');
            }
        } catch {
            throw new BadRequestException(
                'Укажите корректный домен/URL/ip',
            );
        }

        const scan = await analyzers(target);
        // await saveResultinScan(scan, userId, platform);   legacy code before nest
        console.log('Сохраняем через Prisma');
        await this.prisma.scans.create({
            data: {
                target: scan.target,
                data: JSON.parse(JSON.stringify(scan)),
                telegram_user_id: userId ? BigInt(userId) : null,
                platform: platform ?? null,
            },
        });

        let subdomains: string[] | null = null;
        let subdomainsError: string | null = null;
        console.log('Сохраняем поддомены');
        try {


            // await saveResultinScanAPICrt(                     legacy code before nest
            //     subdomains,
            //     url.hostname,
            //     userId,
            //     platform,
            // );

            subdomains = await analyzersAPICrt(url.hostname);

            await this.prisma.scans.create({
                data: {
                    target: url.hostname,
                    data: subdomains,
                    telegram_user_id: userId != null ? BigInt(userId) : null,
                    platform: platform ?? null,
                },
            });

        } catch (error) {
            subdomainsError =
                error instanceof Error
                    ? error.message
                    : String(error);

            console.error(
                'Ошибка сканирования поддоменов:',
                subdomainsError,
            );
        }

        return {
            scan,
            subdomains,
            subdomainsError,
        };
    }
}