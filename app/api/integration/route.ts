import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const body = await request.json();

  const api_key = request.headers.get("api_key");

  const custom_auth_token = process.env.CUSTOM_AUTH_TOKEN

  if (api_key !== custom_auth_token) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  return NextResponse.json({ received: body }, { status: 201 });
}
