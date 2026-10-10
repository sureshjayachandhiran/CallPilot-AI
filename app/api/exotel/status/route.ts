import { NextRequest, NextResponse } from "next/server";
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Starter callback: logs minimal metadata only. Validate provider callback authenticity
// and persist/idempotently process events before production.
export async function POST(req: NextRequest) {
  try {
    const form = await req.formData();
    const data: Record<string,string> = {};
    form.forEach((v,k) => { data[k] = String(v).slice(0, 300); });
    console.info("Exotel status", JSON.stringify({
      callSid: data.CallSid || data.Sid || "unknown",
      status: data.Status || "unknown",
      receivedAt: new Date().toISOString()
    }));
    return NextResponse.json({ received: true });
  } catch {
    return NextResponse.json({ received: false }, { status: 400 });
  }
}
