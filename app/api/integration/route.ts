import { NextResponse } from 'next/server';

export async function POST(request: Request) {

  let dataString = "";

  // try get body and log it
  try {
    const body = await request.json();
    console.log("Received webhook with body:", body);
    dataString += JSON.stringify(body);
  } catch (error) {
    console.log(error)
  }

  // try get query params and log them
  try {
    const queryParams = new URL(request.url).searchParams;
    console.log("Received webhook with query params:", Object.fromEntries(queryParams.entries()));
    dataString += JSON.stringify(Object.fromEntries(queryParams.entries()));
  } catch (error) {
    console.log(error)
  }

  // try get headers and log them
  try {
    const headers = request.headers;
    console.log("Received webhook with headers:", Object.fromEntries(headers.entries()));
    dataString += JSON.stringify(Object.fromEntries(headers.entries()));
  } catch (error) {
    console.log(error)
  }

  const api_key = request.headers.get("api_key");

  const custom_auth_token = process.env.CUSTOM_AUTH_TOKEN

  if (api_key !== custom_auth_token) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  return NextResponse.json({ "hello": dataString }, { status: 201 });
}
