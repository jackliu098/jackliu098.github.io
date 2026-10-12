# jackjliu.com

Personal site for Jack Liu. Plain HTML, CSS, and JavaScript: no framework, no build step, no paid services. It is hosted on Cloudflare Pages, which publishes from the GitHub repository `jackliu098/jackliu098.github.io`.

## Files

```
index.html              The page. Hero intro and About paragraphs are written here.
404.html                Shown for broken links.
css/styles.css          All styling. Colors and fonts are the variables at the top.
js/content.js           Your content: links, projects, experience, education, skills, writing.
js/main.js              Builds the page from content.js. You shouldn't need to edit it.
assets/
  images/               Profile photo and the Rutgers banner.
  resume/               Jack-Liu-Resume.pdf
  projects/             Put project PDFs, decks, and models here.
  favicon.svg           Browser-tab icon.
  apple-touch-icon.png  Home-screen icon on phones.
robots.txt, sitemap.xml For search engines.
```

## Preview on your computer

From this folder:

```bash
python3 -m http.server 4173
```

Then open http://localhost:4173. Stop it with Ctrl+C.

## Updating the site

Almost everything is in `js/content.js`. Each section there has a short comment and a copy-and-paste template. Edit, save, refresh the browser, then publish (see below).

| To change | Edit |
| --- | --- |
| Email, LinkedIn, GitHub, résumé link | `links` in `js/content.js` |
| Career interests under the hero | `interests` |
| Now / Next / Pursuing | `focus` |
| Projects and research | `projects` |
| Jobs, clubs, leadership | `experience` |
| Schools, GPA, honors | `education` |
| Coursework, certifications | `coursework`, `certifications` |
| Skills and languages | `skills`, `languages` |
| Articles and market notes | `writing` |
| Hero intro and About paragraphs | `index.html` |
| Colors and fonts | top of `css/styles.css` |

Things that start hidden and appear when you fill them in: the GitHub link, Relevant coursework, Certifications, and the whole Writing & Insights section (including its menu link). Project filter buttons appear once there are four or more projects in at least two categories.

**Add a project.** Copy the template at the top of the `projects` list in `content.js`, fill it in, and put it first in the list. For a downloadable file, save it in `assets/projects/` and point a link at it:

```js
links: [
  { label: "Download report (PDF)", href: "assets/projects/nvda-initiation.pdf" },
],
```

Use lowercase file names with hyphens and no spaces.

**Add a job or leadership role.** Copy a `{ role: ... }` block into the right group in `experience`, newest first.

**Replace the résumé.** Export the new PDF and save it over `assets/resume/Jack-Liu-Resume.pdf` with the same name. The download buttons and the on-page preview update on their own.

**Replace the photo.** Save a square image over `assets/images/jack-liu.jpg`. 800 × 800 pixels is plenty.

**If the page looks half-empty after an edit,** `content.js` has a typo, usually a missing comma or quote. Open the browser console (right-click, Inspect, Console) and it will name the line.

## Before going live

- [ ] Rewrite the "why finance" paragraph in `index.html` in your own words. It is marked with a `DRAFT` comment.
- [ ] The résumé PDF shows your phone number. For a public site, consider exporting a copy without it.
- [ ] Replace or delete the two "Planned" project cards in `content.js` when your plans firm up.
- [ ] Add your GitHub URL to `links.github` if you want it shown.
- [ ] Confirm you are comfortable using the Rutgers building photo. If it came from a Rutgers page, check their usage terms or swap in a photo you took.

## Publishing a change

The folder structure matters: `index.html` looks for `css/styles.css`, `js/content.js`, `js/main.js`, and everything under `assets/`. Keep files in their folders.

1. Open GitHub Desktop. It lists every file you changed.
2. Type a short summary at the bottom left, for example "Add NVDA research report".
3. Select **Commit to main**.
4. Select **Push origin**.

Cloudflare notices the push and republishes the site, usually within a minute. If a change doesn't show up, refresh with Cmd+Shift+R to skip the browser's saved copy.

## How the hosting is set up

- **Code:** GitHub repository `jackliu098/jackliu098.github.io`, branch `main`.
- **Host:** a Cloudflare Pages project connected to that repository. No framework preset, no build command, default output directory.
- **Domain:** `jackjliu.com` and `www.jackjliu.com` are attached under the project's **Custom domains** in the Cloudflare dashboard (**Workers & Pages**, then the project). Cloudflare manages the DNS records and HTTPS.

Because the repository is named `jackliu098.github.io`, GitHub also publishes a copy at https://jackliu098.github.io. It is harmless: the page tells search engines that jackjliu.com is the real address. To switch it off, open the repository's **Settings → Pages** on GitHub.
