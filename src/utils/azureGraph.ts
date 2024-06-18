export async function outlookGraphAPI(accessToken: string, urlPart: string) {
  var headers = new Headers();
  var bearer = "Bearer " + accessToken;
  headers.append("Authorization", bearer);
  var options = {
    method: "GET",
    headers: headers,
  };
  var graphEndpoint = `https://graph.microsoft.com/v1.0/me/${urlPart}`;

  const fetchData = await fetch(graphEndpoint, options);
  const fetchJsonData = await fetchData.json();
  return fetchJsonData;
}
