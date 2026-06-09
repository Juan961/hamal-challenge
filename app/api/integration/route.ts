import { NextResponse } from 'next/server';

const jokesDevelopers = [
  "Why do developers prefer dark mode? Because light attracts bugs!",
  "What's a developer's favorite hangout place? Foo Bar!",
  "Why did the developer go to the doctor? Because they had a syntax error!",
  "Why do programmers always mix up Christmas and Halloween? Because Oct 31 == Dec 25!",
  "Why do Java developers wear glasses? Because they don't see sharp!"
];

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

  if (errorBody || errorQueryParams || errorHeaders) {
    const errorResponse = {
      result: "error",
      message: "No jokes for you, there was an error processing the webhook data",
      errors: {
        body: errorBody,
        queryParams: errorQueryParams,
        headers: errorHeaders
      }
    }
    return NextResponse.json(errorResponse, { status: 400 });
  }

  console.log("Integration data received and authenticated successfully. " + JSON.stringify(body));

  const response = {
    result: "success",
    message: jokesDevelopers[Math.floor(Math.random() * jokesDevelopers.length)],
    errors: null
  }

  return NextResponse.json(response, { status: 201 });
}
