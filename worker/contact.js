/* ==========================================================================
   Contact form endpoint  ->  /api/contact   (called from worker/index.js)

   GET   reports whether the form has been set up, so the site only shows a
         form that can actually deliver.
   POST  checks the message and hands it to Resend, which emails it to you.
         The site shows "Message sent" only when Resend accepts it.

   Setup (see README): in the Cloudflare dashboard, open the Worker
   "jackliu098-github-io", then Settings > Variables and Secrets, and add:
     RESEND_API_KEY   secret   an API key from resend.com
     CONTACT_TO       secret   the inbox that should receive messages
     CONTACT_FROM     secret   optional; defaults to Resend's test sender

   No key or address is ever written in this file or sent to the browser.
   ========================================================================== */

const LIMITS = { name: 100, email: 200, company: 150, message: 5000 };
const MAX_BODY_BYTES = 12000;
const MIN_FILL_MS = 2500;          // a person cannot fill the form faster than this
const WINDOW_MS = 10 * 60 * 1000;  // per-visitor limit: 5 messages in 10 minutes
const MAX_PER_WINDOW = 5;
const recent = new Map();          // best effort: resets when the function restarts

const json = (body, status) =>
  new Response(JSON.stringify(body), {
    status: status || 200,
    headers: { "Content-Type": "application/json; charset=utf-8", "Cache-Control": "no-store" },
  });

const isConfigured = (env) => Boolean(env && env.RESEND_API_KEY && env.CONTACT_TO);
const clean = (value, max) => String(value == null ? "" : value).replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, "").trim().slice(0, max);
const oneLine = (value) => value.replace(/[\r\n]+/g, " ");

function tooMany(ip) {
  const now = Date.now();
  const times = (recent.get(ip) || []).filter((t) => now - t < WINDOW_MS);
  if (times.length >= MAX_PER_WINDOW) {
    recent.set(ip, times);
    return true;
  }
  times.push(now);
  recent.set(ip, times);
  if (recent.size > 5000) recent.clear();
  return false;
}

export async function handleContact(request, env) {
  if (request.method === "GET" || request.method === "HEAD") return json({ configured: isConfigured(env) });
  if (request.method !== "POST") return json({ ok: false, error: "method_not_allowed" }, 405);
  if (!isConfigured(env)) return json({ ok: false, error: "not_configured" }, 503);

  // Only accept posts that come from this site's own pages.
  const origin = request.headers.get("Origin");
  if (origin && new URL(origin).host !== new URL(request.url).host) {
    return json({ ok: false, error: "forbidden" }, 403);
  }
  if (!(request.headers.get("Content-Type") || "").includes("application/json")) {
    return json({ ok: false, error: "unsupported" }, 415);
  }

  const raw = await request.text();
  if (raw.length > MAX_BODY_BYTES) return json({ ok: false, error: "too_large" }, 413);

  let data;
  try {
    data = JSON.parse(raw);
  } catch (error) {
    return json({ ok: false, error: "bad_request" }, 400);
  }
  if (!data || typeof data !== "object") return json({ ok: false, error: "bad_request" }, 400);

  // Spam checks: the hidden field must be empty and the form cannot be filled instantly.
  if (clean(data.ref_code, 50) || !(Number(data.elapsed) >= MIN_FILL_MS)) {
    return json({ ok: false, error: "rejected" }, 400);
  }

  const name = oneLine(clean(data.name, LIMITS.name));
  const email = oneLine(clean(data.email, LIMITS.email));
  const company = oneLine(clean(data.company, LIMITS.company));
  const message = clean(data.message, LIMITS.message);

  const fields = {};
  if (!name) fields.name = "required";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) fields.email = "invalid";
  if (message.length < 10) fields.message = "too_short";
  if (Object.keys(fields).length) return json({ ok: false, error: "invalid", fields }, 422);

  const ip = request.headers.get("CF-Connecting-IP") || "unknown";
  if (tooMany(ip)) return json({ ok: false, error: "rate_limited" }, 429);

  const text = [
    "From: " + name + " <" + email + ">",
    company ? "Company or organization: " + company : null,
    "",
    message,
    "",
    "Sent from the contact form on " + new URL(request.url).host,
  ]
    .filter((line) => line !== null)
    .join("\n");

  let delivery;
  try {
    delivery = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: "Bearer " + env.RESEND_API_KEY, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: env.CONTACT_FROM || "Website contact form <onboarding@resend.dev>",
        to: [env.CONTACT_TO],
        reply_to: email,
        subject: "Website message from " + name,
        text,
      }),
    });
  } catch (error) {
    return json({ ok: false, error: "delivery_failed" }, 502);
  }

  // Report success only when the email service has accepted the message.
  if (!delivery.ok) return json({ ok: false, error: "delivery_failed" }, 502);
  return json({ ok: true });
}
