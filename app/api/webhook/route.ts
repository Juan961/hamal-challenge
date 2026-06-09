import { NextResponse } from 'next/server';

export async function POST(request: Request) {

  let body: Record<string, unknown> | null = null;

  let errorBody: string | null = null;
  let errorQueryParams: string | null = null;
  let errorHeaders: string | null = null;

  try {
    body = await request.json();
    console.log("Received webhook with body:", body);
  } catch (error) {
    errorBody = "Error parsing JSON body";
    console.error(error)
  }

  try {
    const queryParams = new URL(request.url).searchParams;
    console.log("Received webhook with query params:", Object.fromEntries(queryParams.entries()));
  } catch (error) {
    errorQueryParams = "Error parsing query parameters";
    console.error(error)
  }

  try {
    const headers = request.headers;
    console.log("Received webhook with headers:", Object.fromEntries(headers.entries()));
  } catch (error) {
    errorHeaders = "Error parsing headers";
    console.error(error)
  }

  const api_key = request.headers.get("api_key");

  const custom_auth_token = process.env.CUSTOM_AUTH_TOKEN

  if (api_key !== custom_auth_token) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  console.log("Webhook received");

  const response = {
    errorBody,
    errorQueryParams,
    errorHeaders,
    body,
    queryParams: Object.fromEntries(new URL(request.url).searchParams.entries()),
    headers: Object.fromEntries(request.headers.entries()),
  }

  return NextResponse.json(response, { status: 200 });
}
