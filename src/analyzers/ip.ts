async function IP_Analyzer(ip: string) {
  try { // упор в 30 в день потом сделать сою или найдти другой апи 
    const response = await fetch(`https://api.ipapi.is/?q=${ip}`);
    const data = await response.json();

    return data;
  } catch (error) {
    return {
      error: "IP analyzer unavailable"
    };
  }
}

export { IP_Analyzer };