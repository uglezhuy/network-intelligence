import {analyzers} from "./analyzers.js"

function wait(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function monitor(target: string,min: number) {
console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!use monitor function");


    const results = [];
    let i = 0;
    while (true) {
        i++;
        const result = await analyzers(target);

        await wait(min * 60 * 100); // при 1 каждые 6 секунд 

        results.push(result);
        console.log("============================ ТЕСТ "+i+"============================");
        console.log(results);


        // по аналогии saveResult ()  при обычном scan токо в дргую таблицу и со строгой схемой}
    

    }
}

export {monitor};