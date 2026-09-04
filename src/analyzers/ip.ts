import { readFile } from "node:fs/promises";           // все через гпт доаразбраться как и что 
import path from "node:path";

type GeoRecord = {
    start_ip: string;
    end_ip: string;
    continent: string;
    country_code: string;
    country: string;
    state: string;
    city: string;
    zip: string;
    timezone: string;
    latitude: string;
    longitude: string;
    accuracy: string;
    source: string;
};

let database: GeoRecord[] | null = null;


function ipToNumber(ip: string): number {
    const parts = ip.split(".").map(Number);

    if (
        parts.length !== 4 ||
        parts.some(part => !Number.isInteger(part) || part < 0 || part > 255)
    ) {
        throw new Error(`Invalid IPv4 address: ${ip}`);
    }

    return (
        ((parts[0] << 24) >>> 0) +
        (parts[1] << 16) +
        (parts[2] << 8) +
        parts[3]
    ) >>> 0;
}


async function loadDatabase(): Promise<GeoRecord[]> {

    if (database !== null) {
        return database;
    }

    // Гео-база — сторонние открытые данные от ipapi.is (атрибуция: data/ipapi/README.md)
    const filePath = path.resolve(
        process.cwd(),
        "data/ipapi/geolocationDatabaseIPv4.csv"
    );

    const csv = await readFile(filePath, "utf-8");

    const lines = csv
        .split("\n")
        .map(line => line.trim())
        .filter(line => line.length > 0);

    const records: GeoRecord[] = [];

    // пропускаем первую строку — заголовок
    for (let i = 1; i < lines.length; i++) {

        const columns = lines[i].split(",");

        if (columns.length < 14) {
            continue;
        }

        records.push({
            start_ip: columns[1],
            end_ip: columns[2],
            continent: columns[3],
            country_code: columns[4],
            country: columns[5],
            state: columns[6],
            city: columns[7],
            zip: columns[8],
            timezone: columns[9],
            latitude: columns[10],
            longitude: columns[11],
            accuracy: columns[12],
            source: columns[13]
        });
    }

    database = records;

    console.log(`IP database loaded: ${records.length} records`);

    return records;
}


async function IP_Analyzer(ip: string) {

    try {

        const ipNumber = ipToNumber(ip);

        const records = await loadDatabase();

        const record = records.find(row => {

            const start = ipToNumber(row.start_ip);
            const end = ipToNumber(row.end_ip);

            return ipNumber >= start && ipNumber <= end;
        });

        if (!record) {

            return {
                error: "IP not found in local database",
                ip
            };
        }

        return {
            ip,
            continent: record.continent,
            country_code: record.country_code,
            country: record.country,
            state: record.state,
            city: record.city,
            zip: record.zip,
            timezone: record.timezone,
            latitude: Number(record.latitude),
            longitude: Number(record.longitude),
            accuracy: Number(record.accuracy),
            source: record.source
        };

    } catch (error) {

        return {
            error: "IP analyzer unavailable",
            ip,
            details: error instanceof Error
                ? error.message
                : String(error)
        };
    }
}


export { IP_Analyzer };