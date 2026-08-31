import {analyzers} from "./analyzers.js"
import {monitor} from "./monitor.js"
import {printResult} from "./printResult.js"
import {saveResult} from "./database/results.js"


async function  main()
{



    const useFunction = process.argv[2];
    if (useFunction=='scan') {

      console.log("use scan function");
      
      const target = process.argv[3];
      if (!target) {
      console.log("Usage: node index.js <domain>");
      process.exit(1);
      
    }
    const result = await analyzers(target);
    saveResult(result); 
    printResult(result);  }


    else if (useFunction=='monitor') {
      console.log("use monitor function");


      const target = process.argv[3];

      if (!target) {
      console.log("Usage: node index.js <domain min>");
      process.exit(1);
      }
      const min = Number(process.argv[4]);
      if (!min) {
      console.log("Usage: node index.js <domain min>");
       process.exit(1);}
      
      

      await monitor(target, min);      
    }



    else {
      console.log("for use scan *node dist/index.js scan google.com* for use monitor *node dist/index.js monitor 5*");
    }
    




  
}

main();