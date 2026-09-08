


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
}





export { alert };