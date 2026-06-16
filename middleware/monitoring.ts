import { NextRequest, NextResponse } from 'next/server';

export async function monitoringMiddleware(request: NextRequest, response: NextResponse) {
  return response;
}
