import { NextResponse } from 'next/server';

/**
 * Decodes a JWT without verifying its signature.
 * Returns the decoded header and payload, or null if the value isn't a JWT.
 */
function decodeJwt(token: string): { header: unknown; payload: unknown } | null {
  const parts = token.trim().split('.');
  if (parts.length !== 3) {
    return null;
  }

  const decodeSegment = (segment: string): unknown =>
    JSON.parse(Buffer.from(segment, 'base64url').toString('utf8'));

  return {
    header: decodeSegment(parts[0]),
    payload: decodeSegment(parts[1]),
  };
}

export async function POST(request: Request) {

  let body: Record<string, unknown> | string | null = null;
  let decodedJwt: { header: unknown; payload: unknown } | null = null;

  let errorBody: string | null = null;
  let errorQueryParams: string | null = null;
  let errorHeaders: string | null = null;

  try {
    // The webhook delivers the body as a raw JWT string, so read it as text
    // first and only fall back to JSON parsing if it isn't a JWT.
    const raw = await request.text();

    decodedJwt = decodeJwt(raw);
    if (decodedJwt) {
      body = raw;
      console.log("Received webhook with decoded JWT:", JSON.stringify(decodedJwt, null, 2));
    } else {
      body = JSON.parse(raw);
      console.log("Received webhook with body:", body);
    }
  } catch (error) {
    errorBody = "Error parsing body";
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
    decodedJwt,
    queryParams: Object.fromEntries(new URL(request.url).searchParams.entries()),
    headers: Object.fromEntries(request.headers.entries()),
  }

  return NextResponse.json(response, { status: 200 });
}
