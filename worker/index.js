/* ==========================================================================
   The site's small server side, run by Cloudflare (not in the browser).

   It answers /api/contact for the contact form and hands every other
   request to the site's ordinary files.
   ========================================================================== */

import { handleContact } from "./contact.js";

export default {
  async fetch(request, env) {
    const { pathname } = new URL(request.url);
    if (pathname === "/api/contact") return handleContact(request, env);
    return env.ASSETS.fetch(request);
  },
};
