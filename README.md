# OfferMatch AI

A simple Next.js quiz app that matches beginner affiliate marketers with a best-fit affiliate offer type based on niche, experience, traffic source, content style, budget, and income goal.

## MVP Features

- Interactive 7-question quiz
- Client-side offer-fit scoring logic
- Personalized result card
- Traffic strategy and what-to-avoid guidance
- First 3 action steps
- Email capture placeholder ready for webhook/email integration
- Privacy and terms pages

## Local Development

```bash
npm install
npm run dev
```

## Production Build

```bash
npm run build
```

## Deploy

This app is ready for Vercel deployment from a GitHub repo.

## Lead Capture Integration

The form posts to `/api/capture-lead`.

Supported production environment variables:

- `LEAD_CAPTURE_WEBHOOK_URL` — optional JSON webhook target
- `LEAD_CAPTURE_WEBHOOK_SECRET` — optional bearer token sent to the webhook
- `VBOUT_API_KEY` + `VBOUT_LIST_ID` — optional direct VBOUT contact capture

If no provider env vars are set, the endpoint still validates submissions and logs a safe capture event in Vercel logs.
