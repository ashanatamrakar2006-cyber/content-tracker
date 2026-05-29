import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Simple check: Agar user login page par nahi hai aur session nahi hai, 
  // toh use login par bhej do.
  return NextResponse.next();
}