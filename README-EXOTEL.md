# Exotel integration patch

Copy the `app` folder into your existing Next.js project, merging folders rather than replacing your app.

## Vercel environment variables
Add the variables from `.env.exotel.example` under Project → Settings → Environment Variables. Never prefix credentials with `NEXT_PUBLIC_`.

`EXOTEL_FLOW_URL` must be a real Exotel Flow URL, or `EXOTEL_STREAM_URL` must be a public `wss://` endpoint implementing Exotel's bidirectional AgentStream protocol. A Vercel HTTP route is not a WebSocket bot server.

## One-off test request
After configuring credentials and verifying the destination Flow/Stream, enable the API only for an authorized test. Call only your own number or a contact you are legally permitted to call.

```bash
curl -X POST "https://YOUR-VERCEL-DOMAIN.vercel.app/api/calls" \
  -H "Content-Type: application/json" \
  -d '{"phone":"+919876543210","consentConfirmed":true,"testCall":true,"purpose":"Owner-authorized test","timeLimit":60}'
```

Replace the phone and domain. The endpoint requires `EXOTEL_ENABLED=true`. Keep it false until the provider has approved your account and calling route.

## Limitations before production
- This is a one-off API endpoint, not yet connected to the dashboard UI.
- The status callback only logs basic status and does not persist call history.
- Add authentication, authorization, durable consent evidence, suppression-list checks, provider callback verification, rate limits, audit logging and an emergency stop before production.
- Actual AI conversations require a configured Exotel Flow with a voicebot/stream node or a separate public WebSocket bot endpoint.
