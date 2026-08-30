async function IP_Analyzer(ip: string) {
  const response = await fetch(`https://api.ipapi.is/?q=${ip}`);
  const data = await response.json();
  return data;
}
export { IP_Analyzer };