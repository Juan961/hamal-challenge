import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  let errorHeaders: string | null = null;
  const country = new URL(request.url).searchParams.get('country') ?? '';

  try {
    const headers = request.headers;
    console.log("Received integration with headers:", Object.fromEntries(headers.entries()));
  } catch (error) {
    errorHeaders = "Error parsing headers";
    console.error(error)
  }

  const api_key = request.headers.get("api_key");

  const custom_auth_token = process.env.CUSTOM_AUTH_TOKEN

  if (api_key !== custom_auth_token) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  if (errorHeaders) {
    const errorResponse = {
      result: "error",
      message: "error",
      errors: JSON.stringify({
        headers: errorHeaders
      })
    }
    return NextResponse.json(errorResponse, { status: 400 });
  }

  console.log("Integration data received and authenticated successfully.");

  const listLength = Math.floor(Math.random() * 10) + 1; // Random length between 1 and 10

  const list = [];

  for (let i = 0; i < listLength; i++) {
    const title = `${i + 1} ${country}`.trim().slice(0, 30);

    list.push({
      id: `${i + 1}`,
      title,
    });
  }

  const response = JSON.stringify(list)

  return NextResponse.json(response, { status: 200 });
}
