import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { PrismaMariaDb } from '@prisma/adapter-mariadb';
import { PrismaClient } from '../../generated/prisma/client.js';

@Injectable()
export class PrismaService
    extends PrismaClient
    implements OnModuleInit, OnModuleDestroy {

    constructor() {
        const adapter = new PrismaMariaDb({
            host: process.env.DB_HOST ?? 'localhost',
            port: Number(process.env.DB_PORT ?? 8889),
            user: process.env.DB_USER ?? 'root',
            password: process.env.DB_PASSWORD ?? 'root',
            database: process.env.DB_NAME ?? 'network_intelligence',
            connectionLimit: 5,
        });

        super({ adapter });
    }

    async onModuleInit() {
        await this.$connect();
    }

    async onModuleDestroy() {
        await this.$disconnect();
    }
}