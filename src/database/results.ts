import { connection } from "./connection.js";

async function saveResult(result: any) {

    const db = await connection;

    await db.execute(
        "INSERT INTO scans (target, data) VALUES (?, ?)",
        [
            result.target,
            JSON.stringify(result)
        ]
    );
}

export { saveResult };