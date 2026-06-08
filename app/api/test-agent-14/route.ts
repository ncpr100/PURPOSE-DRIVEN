import { executeAgent } from "@/lib/agents/executor";
import { NextResponse } from "next/server";
export async function GET() {
  try {
    const result = await executeAgent(14);
    return NextResponse.json({ success: true, data: result });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
