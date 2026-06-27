import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    
    console.log('KEY:', process.env.ANTHROPIC_API_KEY?.slice(0, 10));
    
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY!,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();
    console.log('ANTHROPIC RESPONSE:', JSON.stringify(data));
    return NextResponse.json(data);
  } catch (error) {
    console.log('ERROR:', error);
    return NextResponse.json(
      { error: 'Failed to connect to AI' },
      { status: 500 }
    );
  }
}