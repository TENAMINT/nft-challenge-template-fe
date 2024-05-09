async function fetchGraphQL(operationsDoc: string, operationName: string, variables: Record<string, string>) {
  const result = await fetch("https://graph.mintbase.xyz/mainnet", {
    method: "POST",
    body: JSON.stringify({
      query: operationsDoc,
      variables: variables,
      operationName: operationName,
    }),
    headers: new Headers({ "content-type": "application/json", "mb-api-key": "anon" }),
  });

  return await result.json();
}
