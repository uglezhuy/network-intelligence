import { BadRequestException, Injectable } from '@nestjs/common';
import { analyzers, analyzersAPICrt } from '../../analyzers.js';
import { saveResultinScan, saveResultinScanAPICrt } from '../../database/results.js';

@Injectable()
export class ScanService {
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

        await saveResultinScan(scan, userId, platform);

        let subdomains: string[] | null = null;
        let subdomainsError: string | null = null;

        try {
            subdomains = await analyzersAPICrt(url.hostname);

            await saveResultinScanAPICrt(
                subdomains,
                url.hostname,
                userId,
                platform,
            );
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