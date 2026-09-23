import { startBot } from "./telegram/bot.js";
import { startApiServer } from "./api/startApiServer.js";
import { CheckActiveMonitors } from "./CheckActiveMonitors.js";
import { startActiveMonitors } from "./monitor.js";
import { startBotMax } from "./maxBot/botMax.js";



async function startAPIMonitorsBots() {

    console.log("startAPIMonitorsBots started");


    //////////////////////////API///////////////////////
    startApiServer();
    ///////////////////////////////////////////////////


    ////////////////////////startActiveMonitors///////////////////////
    const activeMonitors = await CheckActiveMonitors();

    startActiveMonitors(activeMonitors);// пробема в том  что токо при первом запуске оживают  моинторы,  нужно както сдалть помимо for еще доабвить while напрмер через определеное время 
    /////////////////////////////////////////////////////
    //////////////////////////TG///////////////////////
    startBot();
    ///////////////////////////////////////////////////

    //////////////////////////MAX///////////////////////
    startBotMax();
    ///////////////////////////////////////////////////






}


startAPIMonitorsBots();

export { startAPIMonitorsBots };