function printResult(result: any) {
  console.log("Target:", result.target);


  console.log("==============DNS info================");

  if (result.dns.ipv4.status === "fulfilled") { console.log("IP:", result.dns.ipv4.value[0]); }
  console.log(result.dns);

  console.log("==============HTTP info================");
  console.log(result.http);

  console.log("==============IP info(api.ipapi.is)================");
  console.log(result.ip);

  console.log("==============TLS info================");
  console.log(result.tls);

  console.log("==============PORT info================");
  console.log(result.ports);
}
export { printResult };