import { alertTg } from "./alertTg.js";

async function alert(
    monitorId: number,
    parameter: string,
    oldValue: number | string,
    newValue: number | string,
    parameterValue: number
) {
    console.log("!!!!!!!!!!!!!!!!!!!!!!!ALERT!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");

    console.log("Monitor:", monitorId);
    console.log("Parameter:", parameter);
    console.log("Old:", oldValue);
    console.log("New:", newValue);
    console.log("!!!!!!!!!!!!!!!!!!!!!!! EAND ALERT!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");


    await alertTg(
        monitorId,
        parameter,
        oldValue,
        newValue,
        parameterValue
    );




}

















export { alert };