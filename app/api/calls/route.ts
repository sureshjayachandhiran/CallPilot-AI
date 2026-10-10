import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const error = (message: string, status = 400) =>
  NextResponse.json({ ok: false, error: message }, { status });

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const phone = body?.phone;
    if (typeof phone !== "string" || !/^\\+[1-9]\\d{7,14}$/.test(phone))
      return error("Use E.164 format, e.g. +919876543210.");
    if (body?.consentConfirmed !== true)
      return error("Call blocked: confirm this contact is eligible and has required consent.");
    if (process.env.EXOTEL_ENABLED !== "true")
      return error("Outbound calls are disabled. Enable only after provider approval.", 403);

    const { EXOTEL_ACCOUNT_SID: sid, EXOTEL_API_KEY: key, EXOTEL_API_TOKEN: token,
      EXOTEL_CALLER_ID: callerId } = process.env;
    const region = (process.env.EXOTEL_REGION || "india").toLowerCase();
    const flowUrl = process.env.EXOTEL_FLOW_URL;
    const streamUrl = process.env.EXOTEL_STREAM_URL;
    if (!sid || !key || !token || !callerId)
      return error("Missing Exotel credentials in server environment.", 500);
    if (!flowUrl && !streamUrl)
      return error("Set EXOTEL_FLOW_URL for an existing Exotel Flow or EXOTEL_STREAM_URL for a public AI WebSocket.", 500);
    if (streamUrl && !streamUrl.startsWith("wss://"))
      return error("EXOTEL_STREAM_URL must start with wss://.");
    if (flowUrl && !/^https?:\\/\\//i.test(flowUrl))
      return error("EXOTEL_FLOW_URL must be an http(s) URL.");

    const host = region === "singapore" ? "https://api.exotel.com" : "https://api.in.exotel.com";
    const endpoint = `${host}/v1/Accounts/${encodeURIComponent(sid)}/Calls/connect`;
    const form = new URLSearchParams();
    form.set("From", phone);
    form.set("CallerId", callerId);
    form.set("TimeLimit", String(Math.min(600, Math.max(30, Number(body?.timeLimit) || 180))));
    form.set("TimeOut", "30");
    form.set("StatusCallback", `${process.env.APP_BASE_URL || new URL(req.url).origin}/api/exotel/status`);
    form.set("StatusCallbackEvents[]", "terminal");
    form.set("CustomField", String(body?.purpose || "manual test").slice(0, 128));
    if (streamUrl) {
      form.set("StreamUrl", streamUrl);
      form.set("StreamType", "bidirectional");
    } else {
      form.set("Url", flowUrl!);
    }

    const auth = Buffer.from(`${key}:${token}`).toString("base64");
    const response = await fetch(endpoint, {
      method: "POST",
      headers: { Authorization: `Basic ${auth}`, "Content-Type": "application/x-www-form-urlencoded", Accept: "application/json" },
      body: form.toString(), cache: "no-store", signal: AbortSignal.timeout(20000)
    });
    const raw = await response.text();
    let payload: any;
    try { payload = JSON.parse(raw); } catch { payload = { message: raw.slice(0, 300) }; }
    if (!response.ok) {
      console.error("Exotel rejected call", response.status, JSON.stringify(payload).slice(0, 800));
      return NextResponse.json({ ok: false, error: "Exotel rejected the call. Verify account approval, caller ID, Flow/Stream URL and credentials.", providerStatus: response.status }, { status: 502 });
    }
    const call = payload?.Call || payload?.call || payload;
    return NextResponse.json({
      ok: true, callSid: call?.Sid || call?.sid || null,
      status: call?.Status || call?.status || "submitted",
      message: "Exotel accepted the request; this does not guarantee the recipient answered."
    }, { status: 202 });
  } catch (e) {
    console.error("Outbound call request failed", e);
    return error("Unable to submit call. Check server logs.", 500);
  }
}
