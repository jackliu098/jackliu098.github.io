/* ==========================================================================
   Site behavior: builds the page from js/content.js, then wires up the
   navigation, theme toggle, scroll reveals, and résumé preview.

   You should not need to edit this file to update content.
   ========================================================================== */

(function () {
  "use strict";

  if (!window.SITE) {
    console.error("js/content.js did not load. Check it for a missing comma, quote, or bracket.");
  }

  const SITE = window.SITE || {};
  const links = SITE.links || {};
  const root = document.documentElement;
  const $ = (selector, scope) => (scope || document).querySelector(selector);
  const $$ = (selector, scope) => Array.from((scope || document).querySelectorAll(selector));

  /* ---------- Helpers ---------- */

  // el("a", { class: "x", href: "#", text: "Label" }, [children])
  function el(tag, attrs, children) {
    const node = document.createElement(tag);
    Object.entries(attrs || {}).forEach(([key, value]) => {
      if (value === null || value === undefined || value === false || value === "") return;
      if (key === "class") node.className = value;
      else if (key === "text") node.textContent = value;
      else node.setAttribute(key, value === true ? "" : value);
    });
    (children || []).forEach((child) => {
      if (child) node.appendChild(child);
    });
    return node;
  }

  const isExternal = (href) => /^https?:\/\//i.test(href);
  const isDocument = (href) => /\.(pdf|xlsx?|pptx?|docx?)([?#].*)?$/i.test(href);

  // Outside links and documents open in a new tab; in-page links do not.
  function anchor(href, label, className) {
    const a = el("a", { href: href, class: className, text: label });
    if (isExternal(href) || isDocument(href)) {
      a.target = "_blank";
      a.rel = "noopener noreferrer";
    }
    return a;
  }

  function list(items, className) {
    return el("ul", { class: className }, (items || []).map((item) => el("li", { text: item })));
  }

  function fill(id, items) {
    const target = document.getElementById(id);
    if (target) (items || []).forEach((item) => target.appendChild(el("li", { text: item })));
  }

  const hasItems = (value) => Array.isArray(value) && value.length > 0;

  /* ---------- Links (email, LinkedIn, GitHub, résumé) ---------- */

  function applyLinks() {
    const pretty = (url) => url.replace(/^https?:\/\/(www\.)?/i, "").replace(/\/$/, "");

    $$("[data-link]").forEach((node) => {
      const key = node.dataset.link;
      const value = links[key];
      if (!value) {
        node.hidden = true;
        return;
      }
      node.href = key === "email" ? "mailto:" + value : value;
      if (node.hasAttribute("data-link-text")) {
        node.textContent = key === "email" ? value : pretty(value);
      }
    });

    $$("[data-link-wrap]").forEach((node) => {
      node.hidden = !links[node.dataset.linkWrap];
    });
  }

  /* ---------- Simple lists ---------- */

  function renderLists() {
    fill("interests", SITE.interests);
    fill("skills-list", SITE.skills);
    fill("languages-list", SITE.languages);
    fill("coursework-list", SITE.coursework);

    const focus = $("#focus");
    if (focus) {
      (SITE.focus || []).forEach((item) => {
        focus.appendChild(
          el("div", {}, [el("dt", { text: item.label }), el("dd", { text: item.text })])
        );
      });
    }

    const certs = $("#certifications-list");
    if (certs) {
      (SITE.certifications || []).forEach((cert) => {
        const name = cert.href
          ? anchor(cert.href, cert.name, "cert-name")
          : el("span", { class: "cert-name", text: cert.name });
        const meta = [cert.issuer, cert.date].filter(Boolean).join(" · ");
        certs.appendChild(el("li", {}, [name, el("span", { class: "cert-meta", text: meta })]));
      });
    }

    // Hide any block whose list is empty; show it once it has entries.
    $$("[data-section]").forEach((node) => {
      node.hidden = !hasItems(SITE[node.dataset.section]);
    });
    $$("[data-nav]").forEach((node) => {
      node.hidden = !hasItems(SITE[node.dataset.nav]);
    });
  }

  /* ---------- Projects ---------- */

  function projectCard(project) {
    const status = project.status || "";
    const slug = status.toLowerCase().trim().replace(/\s+/g, "-");
    const classes = ["card", "project", "reveal"];
    if (project.featured) classes.push("is-featured");
    if (slug === "planned") classes.push("is-planned");

    const card = el("article", { class: classes.join(" ") });
    card.dataset.category = project.category || "";

    card.appendChild(
      el("p", { class: "card-meta" }, [
        project.category && el("span", { class: "category", text: project.category }),
        status && el("span", { class: "status status--" + slug, text: status }),
        project.date && el("span", { class: "date", text: project.date }),
      ])
    );
    card.appendChild(el("h3", { text: project.title }));
    if (project.summary) card.appendChild(el("p", { class: "project-summary", text: project.summary }));

    if (hasItems(project.metrics)) {
      card.appendChild(
        el("dl", { class: "metrics" }, project.metrics.map((metric) =>
          el("div", {}, [el("dt", { text: metric.value }), el("dd", { text: metric.label })])
        ))
      );
    }
    if (hasItems(project.highlights)) card.appendChild(list(project.highlights, "bullets"));
    if (hasItems(project.tags)) card.appendChild(list(project.tags, "chips"));
    if (hasItems(project.links)) {
      card.appendChild(
        el("p", { class: "doc-links" }, project.links.map((item) => anchor(item.href, item.label, "doc-link")))
      );
    }
    return card;
  }

  function renderProjects() {
    const grid = $("#project-grid");
    const projects = SITE.projects || [];
    if (!grid) return;

    projects.forEach((project) => grid.appendChild(projectCard(project)));

    // Filter buttons appear once there are enough projects to need them.
    const categories = Array.from(new Set(projects.map((p) => p.category).filter(Boolean)));
    const bar = $("#project-filters");
    if (!bar || projects.length < 4 || categories.length < 2) return;

    const buttons = ["All"].concat(categories).map((name, index) => {
      const button = el("button", { class: "filter-btn", type: "button", text: name });
      button.setAttribute("aria-pressed", index === 0 ? "true" : "false");
      button.addEventListener("click", () => {
        buttons.forEach((other) => other.setAttribute("aria-pressed", other === button ? "true" : "false"));
        $$(".project", grid).forEach((card) => {
          card.hidden = name !== "All" && card.dataset.category !== name;
        });
      });
      bar.appendChild(button);
      return button;
    });
    bar.hidden = false;
  }

  /* ---------- Experience ---------- */

  function renderExperience() {
    const target = $("#experience-list");
    if (!target) return;

    (SITE.experience || []).forEach((group) => {
      const section = el("section", { class: "xp-group reveal" }, [
        el("h3", { class: "label-heading", text: group.group }),
      ]);
      (group.items || []).forEach((item) => {
        section.appendChild(
          el("article", { class: "xp" }, [
            el("p", { class: "xp-date", text: item.date }),
            el("div", {}, [
              el("h4", { text: item.role }),
              el("p", { class: "xp-org", text: [item.org, item.location].filter(Boolean).join(" · ") }),
              hasItems(item.bullets) && list(item.bullets, "bullets"),
            ]),
          ])
        );
      });
      target.appendChild(section);
    });
  }

  /* ---------- Education ---------- */

  function renderEducation() {
    const target = $("#education-list");
    if (!target) return;

    (SITE.education || []).forEach((school) => {
      const card = el("article", { class: "card edu reveal" });
      if (school.image) {
        const image = el("img", {
          class: "edu-image",
          src: school.image,
          loading: "lazy",
          decoding: "async",
          width: 1200,
          height: 300,
        });
        image.alt = school.imageAlt || "";
        card.appendChild(image);
      }
      card.appendChild(
        el("div", { class: "edu-body" }, [
          el("div", {}, [
            el("h4", { text: school.school }),
            el("p", { class: "edu-degree", text: school.degree }),
            el("p", { class: "edu-detail", text: school.detail }),
          ]),
          el("p", { class: "edu-aside" }, [
            el("span", { text: school.date }),
            school.date && school.location && el("br"),
            el("span", { text: school.location }),
          ]),
          hasItems(school.notes) && list(school.notes, "chips"),
        ])
      );
      target.appendChild(card);
    });
  }

  /* ---------- Writing ---------- */

  function renderWriting() {
    const target = $("#writing-list");
    if (!target) return;

    (SITE.writing || []).forEach((post) => {
      const title = el("h3", {}, [post.href ? anchor(post.href, post.title) : document.createTextNode(post.title)]);
      target.appendChild(
        el("li", { class: "reveal" }, [
          el("p", { class: "writing-meta" }, [
            post.kind && el("span", { class: "kind", text: post.kind }),
            post.date && el("span", { text: post.date }),
          ]),
          title,
          post.summary && el("p", { text: post.summary }),
        ])
      );
    });
  }

  /* ---------- Résumé preview ----------
     Embeds the PDF on screens wide enough to read it, and only once the
     section is near the viewport, so phones and first paint stay fast. */

  function initResumePreview() {
    const holder = $("#resume-preview");
    const section = $("#resume");
    if (!holder || !section || !links.resume) return;
    if (!window.matchMedia("(min-width: 761px)").matches || !("IntersectionObserver" in window)) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries.some((entry) => entry.isIntersecting)) return;
        observer.disconnect();
        const fallback = el("p", {}, [anchor(links.resume, "Open the résumé (PDF)")]);
        holder.appendChild(
          el(
            "object",
            {
              class: "resume-frame",
              data: links.resume + "#toolbar=0&view=FitH",
              type: "application/pdf",
              "aria-label": "Résumé preview",
            },
            [fallback]
          )
        );
        holder.hidden = false;
      },
      { rootMargin: "400px 0px" }
    );
    observer.observe(section);
  }

  /* ---------- Theme toggle ---------- */

  function initTheme() {
    const button = $(".theme-toggle");
    const themeColor = $('meta[name="theme-color"]');

    function apply(theme) {
      root.setAttribute("data-theme", theme);
      if (themeColor) themeColor.setAttribute("content", theme === "dark" ? "#0b1320" : "#f8f6f1");
      if (button) {
        button.setAttribute("aria-label", theme === "dark" ? "Switch to light theme" : "Switch to dark theme");
      }
    }

    apply(root.getAttribute("data-theme") === "dark" ? "dark" : "light");

    if (button) {
      button.addEventListener("click", () => {
        const next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
        apply(next);
        try {
          localStorage.setItem("theme", next);
        } catch (error) {
          /* storage unavailable: the choice lasts for this visit only */
        }
      });
    }

    // Follow the system setting until the visitor picks a theme themselves.
    const system = window.matchMedia("(prefers-color-scheme: dark)");
    const onSystemChange = (event) => {
      let saved = null;
      try {
        saved = localStorage.getItem("theme");
      } catch (error) {
        /* ignore */
      }
      if (!saved) apply(event.matches ? "dark" : "light");
    };
    if (system.addEventListener) system.addEventListener("change", onSystemChange);
  }

  /* ---------- Navigation ---------- */

  function initNav() {
    const header = $(".site-header");
    const toggle = $(".nav-toggle");
    const menu = $("#nav-menu");

    const onScroll = () => header && header.classList.toggle("is-scrolled", window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    function setOpen(open) {
      if (!toggle || !menu) return;
      menu.classList.toggle("is-open", open);
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
      toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    }

    if (toggle && menu) {
      toggle.addEventListener("click", () => setOpen(toggle.getAttribute("aria-expanded") !== "true"));
      menu.addEventListener("click", (event) => {
        if (event.target.closest("a")) setOpen(false);
      });
      document.addEventListener("keydown", (event) => {
        if (event.key === "Escape" && toggle.getAttribute("aria-expanded") === "true") {
          setOpen(false);
          toggle.focus();
        }
      });
      document.addEventListener("click", (event) => {
        if (header && !header.contains(event.target)) setOpen(false);
      });
      window.matchMedia("(min-width: 821px)").addEventListener("change", () => setOpen(false));
    }

    // Mark the link for the section currently on screen.
    if (!("IntersectionObserver" in window) || !menu) return;
    const navLinks = $$('a[href^="#"]', menu);
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          navLinks.forEach((a) => {
            if (a.getAttribute("href") === "#" + entry.target.id) a.setAttribute("aria-current", "true");
            else a.removeAttribute("aria-current");
          });
        });
      },
      { rootMargin: "-40% 0px -55% 0px" }
    );
    $$("main section[id]").forEach((section) => observer.observe(section));
  }

  /* ---------- Scroll reveal ---------- */

  function initReveal() {
    const items = $$(".reveal");
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced || !("IntersectionObserver" in window)) {
      items.forEach((item) => item.classList.add("is-visible"));
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        });
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.05 }
    );
    items.forEach((item) => observer.observe(item));
  }

  /* ---------- Start ---------- */

  // Each step is isolated so a mistake in one content entry cannot blank the page.
  [applyLinks, renderLists, renderProjects, renderExperience, renderEducation, renderWriting].forEach((step) => {
    try {
      step();
    } catch (error) {
      console.error("Problem rendering content (" + step.name + "):", error);
    }
  });

  const year = $("#year");
  if (year) year.textContent = new Date().getFullYear();

  initTheme();
  initNav();
  initResumePreview();
  initReveal();
})();
