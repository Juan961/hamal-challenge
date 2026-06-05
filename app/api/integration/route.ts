import { NextResponse } from 'next/server';

export async function POST(request: Request) {

  let body: Record<string, unknown> | null = null;

  // try get body and log it
  try {
    body = await request.json();
    console.log("Received webhook with body:", body);
  } catch (error) {
    console.log(error)
  }

  // try get query params and log them
  try {
    const queryParams = new URL(request.url).searchParams;
    console.log("Received webhook with query params:", Object.fromEntries(queryParams.entries()));
  } catch (error) {
    console.log(error)
  }

  // try get headers and log them
  try {
    const headers = request.headers;
    console.log("Received webhook with headers:", Object.fromEntries(headers.entries()));
  } catch (error) {
    console.log(error)
  }

  const api_key = request.headers.get("api_key");

  const custom_auth_token = process.env.CUSTOM_AUTH_TOKEN

  if (api_key !== custom_auth_token) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const type = body?.type;

  if (!type) {
    return NextResponse.json({ error: 'Bad Request: Missing type in body' }, { status: 400 });
  }

  let response: Record<'1' | '2', string | null> = {
    "1": null,
    "2": null,
  }

  if (type === "1") {
    response = {
      "1": "https://example.com/image.jpg",
      "2": null,
    }
  } else if (type === "2") {
    response = {
      "1": null,
      "2": "https://example.com/document.pdf",
    }
  } else {
    response = {
      "1": null,
      "2": null,
    }
  }

  return NextResponse.json(response, { status: 201 });
}
