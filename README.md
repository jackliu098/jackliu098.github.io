# jackjliu.com

Personal site for Jack J. Liu. Plain HTML, CSS, and JavaScript with no build step. It is hosted on Cloudflare, which publishes from the GitHub repository `jackliu098/jackliu098.github.io`.

## Files

```
index.html               The page. The introduction and About paragraphs are written here.
projects/specsight.html  The SpecSight slides, shown one after another.
404.html                 Shown for broken links.
css/styles.css           All styling. Colors and fonts are the variables at the top.
js/content.js            Your content: links, work, experience, coursework, involvement, events, education.
js/main.js               Builds the page from content.js and runs the contact dialog. Rarely needs editing.
worker/                  The contact form's server side. Runs on Cloudflare, not in the browser.
wrangler.jsonc           Tells Cloudflare how to publish the site and run the worker.
.assetsignore            Files in this folder that should not be public on the website.
assets/
  images/                Portrait and the Rutgers photo.
  resume/                Jack-Liu-Resume.pdf and its preview image.
  projects/              SpecSight presentation PDF and slide images. Future project files go here.
  favicon.svg            Browser-tab icon (the JL mark).
  apple-touch-icon.png   Home-screen icon on phones.
favicon.ico              The same icon for browsers that only look for this file.
robots.txt, sitemap.xml  For search engines.
```

## Preview on your computer

From this folder:

```bash
python3 -m http.server 4173
```

Then open http://localhost:4173. Stop it with Ctrl+C. The contact form does not run in this preview, because its server side only runs on Cloudflare; the dialog shows the email and LinkedIn options instead.

## Updating the site

Most content is in `js/content.js`. Each part has a short comment and, where useful, a template to copy.

| To change | Edit |
| --- | --- |
| Email, LinkedIn, GitHub, resume link | `links` in `js/content.js` |
| Selected work | `work` |
| Jobs and leadership | `experience` |
| Current courses | `coursework` |
| Clubs and communities | `involvement` |
| Upcoming events | `events` |
| Schools, GPA, honors | `education` |
| Introduction and About paragraphs | `index.html` |
| Colors and fonts | top of `css/styles.css` |

**Events remove themselves.** Each event has an `ends` date and drops off the page the day after. The site never says you attended. If you want to mention an event afterwards, write a real reflection and add it yourself.

**Use exact status words.** "Registered", "Selected for the volunteer team", "Attend events" and "Member" mean different things. Write the one your evidence supports.

**Replace the resume.** Save the new PDF over `assets/resume/Jack-Liu-Resume.pdf`, keeping the name. Then refresh the preview image so it matches:

```bash
sips -s format png assets/resume/Jack-Liu-Resume.pdf --out assets/resume/Jack-Liu-Resume-preview.png -Z 1650
```

Keep the resume to one page. The Resume section shows that image as a single sheet inside a frame, with nothing to scroll inside it.

**Replace the photo.** Save a square image over `assets/images/jack-liu.jpg`. 800 × 800 pixels is plenty.

**If the page looks half-empty after an edit,** `content.js` has a typo, usually a missing comma or quote. Open the browser console (right-click, Inspect, Console) and it will name the line.

## The SpecSight presentation

`assets/projects/specsight-presentation.pdf` is the original class presentation with two changes only: the slide background is recolored to match the site, and the three advertisement slides are removed. Every other slide is untouched. `assets/projects/specsight/` holds one image per slide for the slides page, plus the cover thumbnail used on the home page.

The full business plan, the original 25-slide file, and the financial model are deliberately not in this folder. This repository is public, so anything saved here can be read and copied by anyone, even if no page links to it.

## The contact form

The "Contact Jack" button opens a dialog. It always offers your email address, a copy button, and LinkedIn. It also shows a message form, but only once the form can really deliver: the site asks `/api/contact` whether it has been set up, and hides the form if not. A message is reported as sent only after the email service accepts it.

The site runs on Cloudflare as a Worker named `jackliu098-github-io`. The code in `worker/` answers `/api/contact`; everything else is served straight from the files in this folder.

To switch the form on:

1. Create an account at [resend.com](https://resend.com) with the email address where you want to receive messages. The free plan was enough for a personal site when this was written; check their pricing page before relying on it.
2. In Resend, create an API key.
3. In the Cloudflare dashboard, open **Workers & Pages**, select `jackliu098-github-io`, then **Settings → Variables and Secrets**, and add both of these with the type **Secret**:
   - `RESEND_API_KEY`: the key from step 2
   - `CONTACT_TO`: the address that should receive messages
4. Publish the site once more (push any change) so the worker picks up the values.
5. Open the live site, select **Contact Jack**, and send yourself a message.

Until you verify your own domain in Resend, its test sender delivers only to the address you signed up with, so use that same address for `CONTACT_TO`. If you later verify `jackjliu.com` in Resend, add `CONTACT_FROM` (for example `Jack Liu website <hello@jackjliu.com>`).

The worker checks every message on the server, rejects obvious bots, and limits repeated sends from one visitor. For stronger protection, add a rate-limiting rule for `/api/contact` in Cloudflare under **Security**.

Never paste the API key into any file in this folder.

## Publishing a change

The folder structure matters: `index.html` looks for `css/styles.css`, `js/content.js`, `js/main.js`, and everything under `assets/`. Keep files in their folders.

1. Open GitHub Desktop. It lists every file you changed.
2. Type a short summary at the bottom left.
3. Select **Commit to main**.
4. Select **Push origin**.

Cloudflare notices the push and republishes the site, usually within a minute. If a change doesn't show up, refresh with Cmd+Shift+R to skip the browser's saved copy.

## How the hosting is set up

- **Code:** GitHub repository `jackliu098/jackliu098.github.io`, branch `main`.
- **Host:** a Cloudflare Worker named `jackliu098-github-io`, connected to that repository. Each push is published using `wrangler.jsonc`: the files in this folder become the website and `worker/` becomes its small server side.
- **Domain:** `jackjliu.com` and `www.jackjliu.com` are attached to that Worker. Cloudflare manages the DNS records and HTTPS.

Because the repository is named `jackliu098.github.io`, GitHub also publishes a copy at https://jackliu098.github.io. The contact form does not work on that copy, since GitHub cannot run the `worker` folder; visitors there get the email and LinkedIn options. To switch the copy off, open the repository's **Settings → Pages** on GitHub.
