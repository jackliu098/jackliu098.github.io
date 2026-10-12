/* ==========================================================================
   SITE CONTENT

   Everything that changes over time lives in this file: links, projects,
   experience, education, coursework, certifications, skills, and writing.
   Edit the text between the quotes, save, and push. No build step.

   Rules of thumb:
     - Every entry sits between { curly braces } and ends with a comma.
     - Text goes inside "double quotes". To use a quote mark inside text,
       write \" instead of ".
     - Lists are shown in the order they appear here, so put the newest first.
     - A section with an empty list [] hides itself on the site.

   The hero introduction and the About paragraphs are in index.html.
   ========================================================================== */

window.SITE = {

  /* ---- Links -------------------------------------------------------------
     Leave a value as "" to hide that link everywhere on the site. */
  links: {
    email: "jjl441@scarletmail.rutgers.edu",
    linkedin: "https://www.linkedin.com/in/jackjliu",
    github: "",                       // e.g. "https://github.com/your-username"
    resume: "assets/resume/Jack-Liu-Resume.pdf",
  },

  /* ---- Career interests (shown under the hero) --------------------------- */
  interests: [
    "Asset management",
    "Equity research",
    "Wealth management",
    "Portfolio management",
    "Investment banking",
    "Financial analysis",
  ],

  /* ---- Now / Next / Pursuing (shown in About) ---------------------------- */
  focus: [
    {
      label: "Now",
      text: "First-year finance student at Rutgers Business School–New Brunswick.",
    },
    {
      label: "Next",
      text: "Writing my first independent equity research report and stock pitch, and publishing them here.",
    },
    {
      label: "Pursuing",
      text: "An early-career path in asset management, equity research, or a related investing role.",
    },
  ],

  /* ---- Projects & research -------------------------------------------------
     Copy this template to add a project. Only `title` and `summary` are
     required; delete any line you don't need.

     {
       title: "Company Name (TICKER): Initiating Coverage",
       category: "Equity research",   // used for the filter buttons
       status: "Completed",           // "Completed", "In progress", or "Planned"
       date: "Mar 2027",
       featured: true,                // true = full-width card
       summary: "One or two sentences on what this is and what you concluded.",
       metrics: [                     // up to four headline numbers
         { value: "$142", label: "Price target" },
       ],
       highlights: [
         "A specific thing you did or found.",
       ],
       tags: ["DCF", "Comparable companies"],
       links: [                       // put the file in assets/projects/
         { label: "Download report (PDF)", href: "assets/projects/your-file.pdf" },
       ],
     },
  -------------------------------------------------------------------------- */
  projects: [
    {
      title: "SpecSight: Business Plan & Financial Analysis",
      category: "Business plan",
      status: "Completed",
      date: "Jan 2026 – Jun 2026",
      featured: true,
      summary:
        "Financial model for a 120+ page business plan for a conceptual smart-eyewear company, covering projections, balance-sheet forecasts, break-even analysis, and competitive positioning.",
      metrics: [
        { value: "~$834K", label: "Year 1 revenue modeled" },
        { value: "~$904K", label: "Break-even sales threshold" },
        { value: "3 years", label: "Projection horizon" },
        { value: "3 × 11", label: "Competitors × criteria compared" },
      ],
      highlights: [
        "Built 12-month and 3-year projections, balance-sheet forecasts, and a break-even analysis.",
        "Modeled about $834K in Year 1 revenue against a break-even sales threshold of about $904K to evaluate profitability, operating requirements, and scalability.",
        "Compared 3 eyewear companies across 11 criteria, including pricing, product features, distribution, customer service, and target markets, to inform SpecSight's market positioning.",
      ],
      tags: ["Financial modeling", "Forecasting", "Break-even analysis", "Competitive analysis"],
      links: [
        // { label: "Download business plan (PDF)", href: "assets/projects/specsight-business-plan.pdf" },
      ],
    },

    /* PLACEHOLDERS: the two cards below describe work that is planned, not
       finished. Replace each with the real project when it exists, or delete
       it if plans change. */
    {
      title: "Equity research report",
      category: "Equity research",
      status: "Planned",
      summary:
        "A full write-up on one public company: the business, its industry, a valuation, and an investment thesis. The report will be linked here once it is finished.",
    },
    {
      title: "Stock pitch",
      category: "Stock pitch",
      status: "Planned",
      summary:
        "A short buy or sell recommendation with a supporting model and the main risks to the thesis.",
    },
  ],

  /* ---- Experience & leadership ---------------------------------------------
     Add a new role by copying one of the { role: ... } blocks into the right
     group, newest first. Add a new group (for example "Campus involvement")
     by copying a whole { group: ..., items: [...] } block.
  -------------------------------------------------------------------------- */
  experience: [
    {
      group: "Professional experience",
      items: [
        {
          role: "Head Waiter, Front of House",
          org: "Mango Mango",
          location: "Morganville, NJ",
          date: "Jun 2026 – Sep 2026",
          bullets: [
            "Promoted to Head Waiter within the first week, coordinating a 5-person front-of-house team that served 400–500 customers during a 13-hour launch-period day and set a single-day sales record of about $15K.",
            "Directed front-of-house workflows across 12 continuously occupied tables, delegating cashier, table-turnover, kitchen-communication, and order-fulfillment responsibilities.",
          ],
        },
      ],
    },
    {
      group: "Leadership & community",
      items: [
        {
          role: "President",
          org: "Toastmasters M76 Club",
          location: "Marlboro, NJ",
          date: "Jun 2024 – Jun 2026",
          bullets: [
            "Led a 7-officer executive team and an organization of about 30 members across 30+ meetings, managing agendas, scheduling, and weekly leadership assignments.",
          ],
        },
        {
          role: "Worship Leader, AV Technician & Youth Mentor",
          org: "Monmouth Community Christian Church – Joywok",
          location: "Holmdel, NJ",
          date: "Jan 2021 – Jun 2026",
          bullets: [
            "Directed weekly worship and technical production for about 30 attendees on average and 100+ at major events, supervising a 3-person AV team.",
            "Trained 5 AV volunteers and mentored 15+ youth in production workflows, stage professionalism, technical setup, and worship leadership.",
          ],
        },
        {
          role: "Monmouth Community Christian Church Representative",
          org: "Thriving Immigrant Congregations Initiative",
          location: "Chicago, IL",
          date: "Jun 2024",
          bullets: [
            "Represented MCCC at a national intergenerational leadership initiative, speaking in workshops and on a large-group panel before about 150 participants on youth-adult engagement.",
          ],
        },
      ],
    },
  ],

  /* ---- Education ---------------------------------------------------------- */
  education: [
    {
      school: "Rutgers Business School–New Brunswick",
      detail: "Rutgers, The State University of New Jersey",
      degree: "Bachelor of Science, Finance",
      location: "New Brunswick, NJ",
      date: "Expected May 2030",
      image: "assets/images/rutgers-business-school.jpg",
      imageAlt: "The Rutgers Business School building lit up at dusk",
      notes: [
        // "GPA: 0.00 / 4.00",
        // "Dean's List, Fall 2026",
      ],
    },
    {
      school: "Marlboro High School",
      degree: "Business Administration Magnet Program",
      location: "Marlboro, NJ",
      date: "Jun 2026",
      notes: [
        "Weighted GPA: 4.91 / 5.00",
        "DECA & FBLA State Qualifier (4×)",
        "NJ Tennis State Champion",
        "AP Scholar with Distinction",
        "National Honor Society",
      ],
    },
  ],

  /* ---- Relevant coursework (hidden while empty) ---------------------------
     e.g. "Introduction to Financial Accounting", "Microeconomics" */
  coursework: [],

  /* ---- Certifications (hidden while empty) ---------------------------------
     Only list certifications you have finished.
     { name: "Bloomberg Market Concepts", issuer: "Bloomberg", date: "Nov 2026",
       href: "https://link-to-certificate" },                                   */
  certifications: [],

  /* ---- Skills & languages -------------------------------------------------- */
  skills: [
    "Microsoft Excel",
    "Financial modeling",
    "Financial analysis",
    "Market research",
    "Competitive analysis",
  ],
  languages: [
    "English (fluent)",
    "Mandarin Chinese (conversational)",
  ],

  /* ---- Writing & insights (whole section hidden while empty) ---------------
     { title: "What I learned building my first DCF", date: "Feb 2027",
       kind: "Reflection",            // short label, e.g. "Market note", "Company analysis"
       summary: "One or two sentences on what the piece covers.",
       href: "assets/writing/first-dcf.pdf" },   // a PDF here, or any web link */
  writing: [],
};
