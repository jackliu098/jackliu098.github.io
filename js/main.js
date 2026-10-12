/* ==========================================================================
   Site behavior: builds the lists from js/content.js, then wires up the
   navigation, theme toggle, resume preview, and contact dialog.

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
  const BASE = root.dataset.base || ""; // "../" on pages that live one folder down
  const $ = (selector, scope) => (scope || document).querySelector(selector);
  const $$ = (selector, scope) => Array.from((scope || document).querySelectorAll(selector));

  /* ---------- Helpers ---------- */

  // el("a", { class: "x", href: "#", text: "Label" }, [children or strings])
  function el(tag, attrs, children) {
    const node = document.createElement(tag);
    Object.entries(attrs || {}).forEach(([key, value]) => {
      if (value === null || value === undefined || value === false || value === "") return;
      if (key === "class") node.className = value;
      else if (key === "text") node.textContent = value;
      else node.setAttribute(key, value === true ? "" : value);
    });
    (children || []).forEach((child) => {
      if (child) node.appendChild(typeof child === "string" ? document.createTextNode(child) : child);
    });
    return node;
  }

  const isExternal = (href) => /^https?:\/\//i.test(href);
  const isDocument = (href) => /\.(pdf|xlsx?|pptx?|docx?)([?#].*)?$/i.test(href);
  const local = (href) => (/^(https?:|mailto:|#|\/)/i.test(href) ? href : BASE + href);
  const hasItems = (value) => Array.isArray(value) && value.length > 0;
  const pretty = (url) => url.replace(/^https?:\/\/(www\.)?/i, "").replace(/\/$/, "");

  // Outside links and documents open in a new tab; pages on this site do not.
  function anchor(href, label, className) {
    const a = el("a", { href: local(href), class: className, text: label });
    if (isExternal(href) || isDocument(href)) {
      a.target = "_blank";
      a.rel = "noopener noreferrer";
    }
    return a;
  }

  function show(part, visible) {
    $$('[data-part="' + part + '"]').forEach((node) => {
      node.hidden = !visible;
    });
  }

  /* ---------- Links (email, LinkedIn, GitHub, resume) ---------- */

  function applyLinks() {
    $$("[data-link]").forEach((node) => {
      const key = node.dataset.link;
      const value = links[key];
      if (!value) {
        node.hidden = true;
        return;
      }
      node.href = key === "email" ? "mailto:" + value : local(value);
      if (node.hasAttribute("data-link-text")) {
        node.textContent = key === "email" ? value : pretty(value);
      }
    });

    $$("[data-link-wrap]").forEach((node) => {
      node.hidden = !links[node.dataset.linkWrap];
    });
  }

  /* ---------- Selected work ---------- */

  function renderWork() {
    const target = $("#work-list");
    if (!target) return;

    (SITE.work || []).forEach((item) => {
      const primary = hasItems(item.links) ? item.links[0] : null;
      const article = el("article", { class: "work" });

      if (item.image) {
        const image = el("img", { src: local(item.image), width: 880, height: 495, decoding: "async" });
        image.alt = item.imageAlt || "";
        article.appendChild(
          primary ? el("a", { class: "work-media", href: local(primary.href) }, [image]) : el("div", { class: "work-media" }, [image])
        );
      }

      const body = el("div", {});
      body.appendChild(el("h3", {}, [primary ? el("a", { href: local(primary.href), text: item.title }) : item.title]));
      body.appendChild(el("p", { class: "meta", text: [item.kind, item.date, item.credit].filter(Boolean).join(" · ") }));
      if (item.summary) body.appendChild(el("p", { class: "work-summary", text: item.summary }));
      if (item.part) body.appendChild(el("p", { class: "work-part" }, [el("strong", { text: "My part: " }), item.part]));

      if (hasItems(item.figures)) {
        body.appendChild(
          el("dl", { class: "figures" }, item.figures.map((figure) =>
            el("div", {}, [el("dt", { text: figure.value }), el("dd", { text: figure.label })])
          ))
        );
        if (item.figuresNote) body.appendChild(el("p", { class: "figures-note", text: item.figuresNote }));
      }

      if (hasItems(item.links)) {
        const actions = el("p", { class: "actions" });
        item.links.forEach((link, index) => {
          const a = anchor(link.href, link.label, index === 0 ? "btn btn-secondary" : "text-link");
          if (link.download) {
            a.setAttribute("download", "");
            a.removeAttribute("target");
          }
          if (link.note) a.appendChild(el("span", { class: index === 0 ? "btn-note" : "link-note", text: "(" + link.note + ")" }));
          actions.appendChild(a);
        });
        body.appendChild(actions);
      }

      article.appendChild(body);
      target.appendChild(article);
    });

    const section = $("#work");
    if (section) section.hidden = !hasItems(SITE.work);
  }

  /* ---------- Experience ---------- */

  function renderExperience() {
    const target = $("#experience-list");
    if (!target) return;

    (SITE.experience || []).forEach((item) => {
      target.appendChild(
        el("article", { class: "xp" }, [
          el("p", { class: "meta xp-date", text: item.date }),
          el("div", {}, [
            el("h3", { class: "row-title", text: item.role }),
            el("p", { class: "meta", text: [item.org, item.location].filter(Boolean).join(" · ") }),
            item.text && el("p", { class: "row-text", text: item.text }),
          ]),
        ])
      );
    });

    const section = $("#experience");
    if (section) section.hidden = !hasItems(SITE.experience);
  }

  /* ---------- At Rutgers: coursework, involvement, upcoming events ---------- */

  function renderRutgers() {
    const coursework = SITE.coursework || {};
    const courseList = $("#coursework-list");
    if (courseList && hasItems(coursework.courses)) {
      const label = $("#coursework-label");
      if (label && coursework.term) label.textContent = coursework.term + " coursework";
      coursework.courses.forEach((course) => courseList.appendChild(el("li", { text: course })));
    }
    show("coursework", hasItems(coursework.courses));

    const involvement = $("#involvement-list");
    if (involvement) {
      (SITE.involvement || []).forEach((item) => {
        involvement.appendChild(
          el("div", {}, [el("p", { class: "row-title", text: item.name }), el("p", { class: "meta", text: item.text })])
        );
      });
    }
    if (involvement && hasItems(SITE.involvement) && SITE.involvementNote) {
      involvement.appendChild(el("p", { class: "meta", text: SITE.involvementNote }));
    }
    show("involvement", hasItems(SITE.involvement));

    // An event drops off the page the day after it ends. Nothing is claimed about attendance.
    const today = new Date();
    const upcoming = (SITE.events || []).filter((event) => {
      if (!event.ends) return true;
      const end = new Date(event.ends + "T23:59:59");
      return isNaN(end) || end >= today;
    });
    const events = $("#events-list");
    if (events) {
      upcoming.forEach((event) => {
        const title = event.href ? anchor(event.href, event.name) : document.createTextNode(event.name);
        events.appendChild(
          el("div", {}, [
            el("p", { class: "row-title" }, [title]),
            el("p", { class: "meta" }, [
              [event.when, event.where].filter(Boolean).join(" · "),
              event.status && " · ",
              event.status && el("span", { class: "status", text: event.status }),
            ]),
            event.why && el("p", { class: "row-text", text: event.why }),
          ])
        );
      });
    }
    show("events", upcoming.length > 0);
  }

  /* ---------- Education ---------- */

  function renderEducation() {
    const target = $("#education-list");
    if (!target) return;

    (SITE.education || []).forEach((school) => {
      target.appendChild(
        el("div", {}, [
          el("div", { class: "edu-head" }, [
            el("p", { class: "row-title", text: school.school }),
            el("p", { class: "meta", text: school.date }),
          ]),
          el("p", { class: "meta", text: [school.line, school.detail].filter(Boolean).join(". ") }),
        ])
      );
    });
    show("education", hasItems(SITE.education));
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
    if (system.addEventListener) {
      system.addEventListener("change", (event) => {
        let saved = null;
        try {
          saved = localStorage.getItem("theme");
        } catch (error) {
          /* ignore */
        }
        if (!saved) apply(event.matches ? "dark" : "light");
      });
    }
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
    if (!navLinks.length) return;
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

  /* ---------- Contact button and dialog ---------- */

  function initContact() {
    const email = links.email;
    if (!email && !links.linkedin) return;

    const endpoint = (SITE.contact || {}).endpoint || "";
    const supportsDialog = typeof HTMLDialogElement === "function";
    const state = { probed: false, formReady: false, sending: false, openedAt: 0, sent: false };
    let dialog = null;
    let ui = null;

    function copyEmail(button, statusNode) {
      const done = (message, label) => {
        if (statusNode) statusNode.textContent = message;
        if (label) {
          const original = button.dataset.label || button.textContent;
          button.dataset.label = original;
          button.textContent = label;
          setTimeout(() => {
            button.textContent = original;
          }, 2500);
        }
      };
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(email).then(
          () => done("Email address copied.", "Copied"),
          () => done("Copying did not work. The address is " + email + ".")
        );
      } else {
        done("Copying is not available here. The address is " + email + ".");
      }
    }

    // "Copy" next to the email address in the Contact section
    $$("[data-copy-email]").forEach((button) => {
      if (!email) return;
      button.hidden = false;
      button.addEventListener("click", () => copyEmail(button, $("#copy-status")));
    });

    if (!supportsDialog) return; // older browsers keep the plain links in the Contact section

    // Ask the server once whether the message form has been set up.
    function probe() {
      if (state.probed || !endpoint) return;
      state.probed = true;
      fetch(local(endpoint), { headers: { Accept: "application/json" } })
        .then((response) => (response.ok ? response.json() : null))
        .then((data) => {
          state.formReady = Boolean(data && data.configured === true);
          if (ui) syncView();
        })
        .catch(() => {
          /* no function on this host: the email and LinkedIn options stay */
        });
    }

    function field(id, label, control, optional) {
      const error = el("p", { class: "field-error", id: id + "-error", hidden: true });
      control.id = id;
      control.setAttribute("aria-describedby", id + "-error");
      return {
        control,
        error,
        node: el("div", { class: "field" }, [
          el("label", { for: id }, [label, optional && el("span", { text: " (optional)" })]),
          control,
          error,
        ]),
      };
    }

    function build() {
      const title = el("h2", { id: "contact-dialog-title", tabindex: "-1", text: "Contact Jack" });
      const close = el("button", { class: "icon-btn", type: "button", "aria-label": "Close" });
      close.innerHTML =
        '<svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg>';

      const intro = el("p", {});

      const name = field("cf-name", "Name", el("input", { name: "name", type: "text", autocomplete: "name", maxlength: "100", required: true }));
      const from = field("cf-email", "Email", el("input", { name: "email", type: "email", autocomplete: "email", maxlength: "200", required: true, inputmode: "email" }));
      const company = field("cf-company", "Company or organization", el("input", { name: "company", type: "text", autocomplete: "organization", maxlength: "150" }), true);
      const message = field("cf-message", "Message", el("textarea", { name: "message", rows: "5", maxlength: "5000", required: true }));

      // Spam trap: hidden from people and assistive technology; bots tend to fill it.
      const trap = el("div", { class: "field-trap", "aria-hidden": "true" }, [
        el("label", { for: "cf-ref" }, ["Leave this field empty"]),
        el("input", { id: "cf-ref", name: "ref_code", type: "text", tabindex: "-1", autocomplete: "off" }),
      ]);

      const status = el("p", { class: "form-status", role: "status", "aria-live": "polite" });
      const alert = el("p", { class: "form-status is-error", role: "alert", hidden: true });
      const submit = el("button", { class: "btn btn-primary", type: "submit", text: "Send message" });
      const form = el("form", { novalidate: true, hidden: true }, [name.node, from.node, company.node, message.node, trap, status, alert, submit]);

      const sentTitle = el("h3", { class: "row-title", tabindex: "-1", text: "Message sent" });
      const sentText = el("p", { class: "row-text" });
      const again = el("button", { class: "text-btn", type: "button", text: "Write another message" });
      const sent = el("div", { hidden: true }, [sentTitle, sentText, again]);

      const copy = el("button", { class: "text-btn", type: "button", text: "Copy email" });
      const copyStatus = el("p", { class: "sr-status", role: "status", "aria-live": "polite" });
      const alt = el("div", { class: "dialog-alt" }, [
        el("p", { class: "label", text: "Or reach me directly" }),
        el("p", { class: "actions" }, [
          email && el("a", { class: "text-link", href: "mailto:" + email, text: email }),
          email && copy,
          links.linkedin && anchor(links.linkedin, "LinkedIn", "text-link"),
        ]),
        copyStatus,
      ]);

      dialog = el("dialog", { class: "contact-dialog", "aria-labelledby": "contact-dialog-title" }, [
        el("div", { class: "dialog-head" }, [title, close]),
        el("div", { class: "dialog-body" }, [intro, form, sent, alt]),
      ]);
      document.body.appendChild(dialog);

      ui = { title, intro, form, status, alert, submit, sent, sentTitle, sentText, alt, fields: { name, from, company, message }, trap: $("input", trap) };

      close.addEventListener("click", () => dialog.close());
      dialog.addEventListener("click", (event) => {
        if (event.target === dialog) dialog.close(); // a click on the dimmed backdrop
      });
      copy.addEventListener("click", () => copyEmail(copy, copyStatus));
      again.addEventListener("click", () => {
        state.sent = false;
        form.reset();
        syncView();
        name.control.focus();
      });
      Object.values(ui.fields).forEach((item) => {
        item.control.addEventListener("input", () => setError(item, ""));
      });
      form.addEventListener("submit", onSubmit);
    }

    function setError(item, message) {
      item.error.textContent = message;
      item.error.hidden = !message;
      if (message) item.control.setAttribute("aria-invalid", "true");
      else item.control.removeAttribute("aria-invalid");
    }

    function syncView() {
      const showForm = state.formReady && !state.sent;
      ui.form.hidden = !showForm;
      ui.sent.hidden = !state.sent;
      ui.alt.querySelector(".label").textContent = state.formReady ? "Or reach me directly" : "Reach me directly";
      ui.intro.textContent = state.sent
        ? ""
        : state.formReady
          ? "Send a note and it will go straight to my inbox."
          : "Email is the best way to reach me right now.";
      ui.intro.hidden = state.sent;
    }

    function validate() {
      const { name, from, message } = ui.fields;
      const problems = [];
      const check = (item, text) => {
        setError(item, text);
        if (text) problems.push(item);
      };
      check(name, name.control.value.trim() ? "" : "Enter your name.");
      const address = from.control.value.trim();
      check(
        from,
        !address
          ? "Enter your email address so I can reply."
          : /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(address)
            ? ""
            : "Enter an email address in the format name@example.com."
      );
      const text = message.control.value.trim();
      check(message, !text ? "Write a message." : text.length < 10 ? "Add a little more detail (at least 10 characters)." : "");
      return problems;
    }

    function setSending(sending) {
      state.sending = sending;
      ui.submit.setAttribute("aria-disabled", sending ? "true" : "false");
      ui.submit.textContent = sending ? "Sending…" : "Send message";
      ui.form.setAttribute("aria-busy", sending ? "true" : "false");
    }

    function onSubmit(event) {
      event.preventDefault();
      if (state.sending) return; // one request at a time

      ui.alert.hidden = true;
      ui.alert.textContent = "";
      const problems = validate();
      if (problems.length) {
        ui.status.textContent = problems.length === 1 ? "One field needs attention." : problems.length + " fields need attention.";
        problems[0].control.focus();
        return;
      }

      const { name, from, company, message } = ui.fields;
      const payload = {
        name: name.control.value.trim(),
        email: from.control.value.trim(),
        company: company.control.value.trim(),
        message: message.control.value.trim(),
        ref_code: ui.trap.value,
        elapsed: Date.now() - state.openedAt,
      };

      setSending(true);
      ui.status.textContent = "Sending your message…";
      const controller = "AbortController" in window ? new AbortController() : null;
      const timer = controller && setTimeout(() => controller.abort(), 20000);

      fetch(local(endpoint), {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(payload),
        signal: controller ? controller.signal : undefined,
      })
        .then((response) => response.json().catch(() => null).then((data) => ({ ok: response.ok, data })))
        .then(({ ok, data }) => {
          // Success is shown only when the server confirms the message was accepted for delivery.
          if (!ok || !data || data.ok !== true) throw new Error((data && data.error) || "not accepted");
          state.sent = true;
          ui.status.textContent = "";
          ui.sentText.textContent = "Thank you, " + payload.name.split(/\s+/)[0] + ". Your message has been sent.";
          syncView();
          ui.sentTitle.focus();
        })
        .catch(() => {
          // Nothing is cleared, so the visitor can retry or copy their text into an email.
          ui.status.textContent = "";
          ui.alert.textContent =
            "Your message was not sent. Nothing you wrote has been lost. Try again, or email me at " + (email || "the address below") + ".";
          ui.alert.hidden = false;
        })
        .then(() => {
          if (timer) clearTimeout(timer);
          setSending(false);
        });
    }

    function open() {
      probe();
      if (!dialog) build();
      if (dialog.open) return;
      state.openedAt = Date.now();
      syncView();
      dialog.showModal();
      ui.title.focus();
    }

    // The floating button, plus any "Contact Jack" control already on the page
    const fab = el("button", { class: "contact-fab", type: "button", "aria-haspopup": "dialog" });
    fab.innerHTML =
      '<svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true"><rect x="3" y="5" width="18" height="14" rx="1.5"/><path d="M3.5 6.5l8.5 6.5 8.5-6.5"/></svg><span>Contact Jack</span>';
    document.body.appendChild(fab);
    document.body.classList.add("has-fab");

    [fab].concat($$("[data-contact-open]")).forEach((trigger) => {
      trigger.hidden = false;
      trigger.addEventListener("click", (event) => {
        event.preventDefault();
        open();
      });
      ["pointerenter", "focus", "touchstart"].forEach((type) => trigger.addEventListener(type, probe, { passive: true, once: true }));
    });

    // The Contact section has its own button, so the floating one steps aside there.
    const section = $("#contact");
    if (section && "IntersectionObserver" in window) {
      new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (document.activeElement !== fab) fab.hidden = entry.isIntersecting;
          });
        },
        { rootMargin: "0px 0px -20% 0px" }
      ).observe(section);
    }
  }

  /* ---------- Start ---------- */

  // Each step is isolated so a mistake in one content entry cannot blank the page.
  [applyLinks, renderWork, renderExperience, renderRutgers, renderEducation].forEach((step) => {
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
  initContact();
})();
