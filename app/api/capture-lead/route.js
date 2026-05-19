export const runtime = 'nodejs';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function jsonResponse(body, status = 200) {
  return Response.json(body, {
    status,
    headers: {
      'Cache-Control': 'no-store'
    }
  });
}

function sanitizeText(value, maxLength = 240) {
  if (typeof value !== 'string') return '';
  return value.trim().slice(0, maxLength);
}

function normalizePayload(payload) {
  const answers = payload?.answers && typeof payload.answers === 'object' ? payload.answers : {};
  const result = payload?.result && typeof payload.result === 'object' ? payload.result : {};

  return {
    email: sanitizeText(payload?.email, 320).toLowerCase(),
    source: 'OfferMatch AI',
    page: sanitizeText(payload?.page, 500),
    resultTitle: sanitizeText(result.title),
    resultLabel: sanitizeText(result.label),
    resultBadge: sanitizeText(result.badge),
    answers: Object.fromEntries(
      Object.entries(answers).map(([key, value]) => [sanitizeText(key, 80), sanitizeText(value, 240)])
    ),
    capturedAt: new Date().toISOString()
  };
}

async function sendToWebhook(lead) {
  const webhookUrl = process.env.LEAD_CAPTURE_WEBHOOK_URL;
  if (!webhookUrl) return { configured: false };

  const response = await fetch(webhookUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(process.env.LEAD_CAPTURE_WEBHOOK_SECRET
        ? { Authorization: `Bearer ${process.env.LEAD_CAPTURE_WEBHOOK_SECRET}` }
        : {})
    },
    body: JSON.stringify(lead)
  });

  if (!response.ok) {
    const text = await response.text().catch(() => '');
    throw new Error(`Webhook failed with ${response.status}: ${text.slice(0, 180)}`);
  }

  return { configured: true, provider: 'webhook' };
}

async function sendToVbout(lead) {
  const apiKey = process.env.VBOUT_API_KEY;
  const listId = process.env.VBOUT_LIST_ID;
  if (!apiKey || !listId) return { configured: false };

  const params = new URLSearchParams({
    key: apiKey,
    email: lead.email,
    listid: listId,
    status: 'active',
    source: lead.source,
    custom_source: lead.source,
    custom_result: lead.resultTitle,
    custom_result_label: lead.resultLabel,
    custom_answers: JSON.stringify(lead.answers)
  });

  const response = await fetch(`https://api.vbout.com/1/emailmarketing/addcontact.json?${params.toString()}`, {
    method: 'POST'
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok || data?.status === 'error' || data?.error) {
    throw new Error(`VBOUT failed: ${JSON.stringify(data).slice(0, 220)}`);
  }

  return { configured: true, provider: 'vbout' };
}

export async function POST(request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return jsonResponse({ ok: false, error: 'Invalid JSON payload.' }, 400);
  }

  const lead = normalizePayload(body);

  if (!EMAIL_PATTERN.test(lead.email)) {
    return jsonResponse({ ok: false, error: 'Please enter a valid email address.' }, 400);
  }

  try {
    const providers = [];
    const webhookResult = await sendToWebhook(lead);
    if (webhookResult.configured) providers.push(webhookResult.provider);

    const vboutResult = await sendToVbout(lead);
    if (vboutResult.configured) providers.push(vboutResult.provider);

    if (!providers.length) {
      console.info('OfferMatch AI lead captured but no provider is configured', {
        email: lead.email,
        resultTitle: lead.resultTitle,
        resultLabel: lead.resultLabel,
        capturedAt: lead.capturedAt
      });

      return jsonResponse({
        ok: true,
        captured: false,
        message: 'Lead capture endpoint is live. Add LEAD_CAPTURE_WEBHOOK_URL or VBOUT_API_KEY + VBOUT_LIST_ID to forward leads.'
      });
    }

    return jsonResponse({ ok: true, captured: true, providers });
  } catch (error) {
    console.error('OfferMatch AI lead capture failed', error);
    return jsonResponse({ ok: false, error: 'Lead capture failed. Please try again.' }, 502);
  }
}
