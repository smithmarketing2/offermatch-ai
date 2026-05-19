export const runtime = 'nodejs';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const GLOBALCONTROL_BASE_URL = process.env.GLOBALCONTROL_BASE_URL || 'https://api.globalcontrol.io/api/ai';
const GLOBALCONTROL_GENERAL_TAG_ID = process.env.GLOBALCONTROL_GENERAL_TAG_ID || '6a0cce69923e612330486e09';
const GLOBALCONTROL_RESULT_TAG_IDS = {
  'Beginner Digital Products': '6a0ccef5923e612330489d15',
  'Recurring SaaS / AI Tools': '6a0ccef6923e612330489dc9',
  'High-Ticket Coaching / Programs': '6a0ccef6923e612330489e7d',
  'Physical Products': '6a0ccef7923e612330489f31',
  'Finance / Credit Offers': '6a0ccef7923e61233048a099',
  'Content-Friendly Low-Ticket Offers': '6a0ccef8923e61233048a14d'
};

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

function getGlobalControlTagIds(lead) {
  return [
    GLOBALCONTROL_GENERAL_TAG_ID,
    GLOBALCONTROL_RESULT_TAG_IDS[lead.resultTitle]
  ].filter(Boolean);
}

async function sendToGlobalControl(lead) {
  const apiKey = process.env.GLOBALCONTROL_API_KEY;
  if (!apiKey) return { configured: false };

  const tagIds = getGlobalControlTagIds(lead);
  if (!tagIds.length) return { configured: false };

  const response = await fetch(`${GLOBALCONTROL_BASE_URL}/tags/fire-tags`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-API-KEY': apiKey
    },
    body: JSON.stringify({
      email: lead.email,
      tagIds,
      ignoreTagFire: false
    })
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok || data?.type === 'error' || data?.error) {
    throw new Error(`Global Control failed: ${JSON.stringify(data).slice(0, 220)}`);
  }

  return {
    configured: true,
    provider: 'globalcontrol',
    tags: tagIds
  };
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

    const globalControlResult = await sendToGlobalControl(lead);
    if (globalControlResult.configured) providers.push(globalControlResult.provider);

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
        message: 'Lead capture endpoint is live. Add LEAD_CAPTURE_WEBHOOK_URL, VBOUT_API_KEY + VBOUT_LIST_ID, or GLOBALCONTROL_API_KEY to forward leads.'
      });
    }

    return jsonResponse({ ok: true, captured: true, providers });
  } catch (error) {
    console.error('OfferMatch AI lead capture failed', error);
    return jsonResponse({ ok: false, error: 'Lead capture failed. Please try again.' }, 502);
  }
}
