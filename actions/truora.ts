"use server"

export const generateWebToken = async (accountId: string, flowId: string) => {
  const params = new URLSearchParams({
    key_type: 'web',
    grant: 'digital-identity',
    api_key_version: '1',
    country: 'ALL',
    flow_id: flowId,
    account_id: accountId,
    redirect_url: "https://jj-hamal-challenge.vercel.app/"
  });

  const response = await fetch('https://api.account.truorastaging.com/v1/api-keys', {
    method: 'POST',
    headers: {
      'Truora-API-Key': process.env.TRUORA_API_KEY || "",
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: params.toString(),
  });

  const data = await response.json();

  return data.api_key;
};
