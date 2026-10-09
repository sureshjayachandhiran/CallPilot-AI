# CallPilot AI — outbound calling dashboard starter

A GitHub/Vercel-ready Next.js prototype for campaign management, CSV contact imports, scripts, call-history UI and compliance planning.

## Important scope note

This repository is a **dashboard prototype, not a production dialer**. It does not place telephone calls. Campaigns are saved as drafts and the UI deliberately blocks live calling until you implement a provider adapter. Real outbound calling requires an approved telecom account and provider-specific server-side integration. Do not use this to make unsolicited calls.

Data is stored in the current browser's localStorage. It is not shared across users or devices. The Supabase variables in `.env.example` are reserved for a future persistent database adapter and are not wired into this UI.

## Run locally

1. Install Node.js 20 or newer.
2. Extract this repository.
3. Copy `.env.example` to `.env.local`.
4. Run:

   ```bash
   npm install
   npm run dev
   ```

5. Open `http://localhost:3000`.

Build check:

```bash
npm run build
```

## Push to GitHub

Create an empty GitHub repository, then from this project folder:

```bash
git init
git add .
git commit -m "Initial CallPilot AI dashboard"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/YOUR-REPOSITORY.git
git push -u origin main
```

Replace the URL with your own repository URL.

## Deploy to Vercel

1. Sign in to Vercel and choose **Add New → Project**.
2. Import the GitHub repository.
3. Keep the framework preset as Next.js.
4. Deploy. No provider secrets are needed for the dashboard-only demo.
5. Future environment variables can be added under **Project → Settings → Environment Variables**; redeploy after changing them.

## CSV format

Use a header row, for example:

```csv
name,phone,city,type,language,consent,consent_source
Demo Contact,+919000000000,Bengaluru,B2B,English,false,
```

Accepted phone headers: `phone`, `phone_number`, `mobile`, `mobile_number`.
Accepted consent headers: `consent`, `marketing_consent`, `opt_in`.

Consent values such as `yes`, `true`, `1`, `consented`, `opted-in` are imported as marked yes. This is only an import flag and **does not verify lawful consent**. The operator must retain evidence and validate permissions and preferences independently. Demo phone numbers are fictional.

## Suggested next engineering steps

1. Add Supabase persistence and authentication / role-based access.
2. Implement an Exotel-compatible provider adapter only after provider approval. Use the official current API documentation and never guess endpoints or credentials.
3. Validate webhook signatures and enforce idempotency.
4. Implement a real-time or turn-based voice workflow supported by the chosen provider and AI vendor.
5. Add server-side consent checks, suppression lists, call-window limits, concurrency limits and an emergency stop.
6. Test with your own numbers and a small set of eligible, consented contacts before any live pilot.

## Environment variables

See `.env.example`. Never commit `.env.local`, API keys, service-role keys or telecom tokens. The included `.gitignore` excludes `.env` files.

## Stack

- Next.js 14 / React 18 / TypeScript
- Lucide icons
- Papa Parse for CSV import/export
- Optional future Supabase integration
- Vercel-compatible frontend
