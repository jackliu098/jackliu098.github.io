/* ==========================================================================
   SITE CONTENT

   The lists on the site are built from this file: selected work, experience,
   coursework, involvement, upcoming events, and education. Edit the text
   between the quotes, save, and publish. No build step.

   Rules of thumb:
     - Every entry sits between { curly braces } and ends with a comma.
     - Text goes inside "double quotes". To use a quote mark inside text,
       write \" instead of ".
     - Lists are shown in the order they appear here, so put the newest first.
     - An empty list [] hides that part of the page.

   The introduction and the About paragraphs are written in index.html.
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

  /* ---- Contact form --------------------------------------------------------
     The form posts to this address, which is answered by worker/contact.js
     on Cloudflare. The form only appears once that is set up (see README).
     Until then visitors get the email and LinkedIn options. */
  contact: {
    endpoint: "/api/contact",
  },

  /* ---- Selected work --------------------------------------------------------
     Copy this template to add a project. Only add work that is finished
     enough for a visitor to open and read.

     {
       title: "Company Name (TICKER): Initiating Coverage",
       kind: "Equity research report",
       date: "March 2027",
       credit: "",                    // e.g. "With Jane Doe" for team work
       summary: "Two or three sentences on what it is and what you concluded.",
       part: "",                      // for team work: what you personally did
       figures: [                     // optional headline numbers, kept short
         { value: "$142", label: "price target" },
       ],
       image: "assets/projects/your-cover.jpg",   // optional
       imageAlt: "What the image shows",
       links: [
         { label: "Read the report (PDF)", href: "assets/projects/your-file.pdf" },
       ],
     },
  -------------------------------------------------------------------------- */
  work: [
    {
      title: "SpecSight",
      kind: "Academic business plan for a conceptual company",
      date: "January to June 2026",
      credit: "With Christos Goudas",
      summary:
        "A business plan for a smart-eyewear concept, written with a classmate for an Honors Entrepreneurship course. The full plan runs to more than 120 pages and covers the market, three competitors, pricing, operations, and financial projections, including startup funding, a 12-month and three-year forecast, and a break-even analysis.",
      part:
        "I led the project as CEO, built most of the financial projections, and wrote most of the presentation.",
      figuresNote: "Modeled, not actual",
      figures: [
        { value: "$834,400", label: "Year 1 sales in the forecast" },
        { value: "$903,962", label: "break-even sales level" },
      ],
      image: "assets/projects/specsight/cover-thumb.jpg",
      imageAlt: "Cover slide of the SpecSight presentation: round glasses with colored lenses above the name SpecSight",
      links: [
        { label: "View presentation", note: "22 slides", href: "projects/specsight.html" },
        { label: "Download presentation", note: "PDF, 2.1 MB", href: "assets/projects/specsight-presentation.pdf", download: true },
      ],
    },
  ],

  /* ---- Experience & leadership ---------------------------------------------
     One or two sentences per role. Say who a result belongs to: you, your
     team, or the organization. */
  experience: [
    {
      role: "Head Waiter, Front of House",
      org: "Mango Mango",
      location: "Morganville, NJ",
      date: "Jun – Sep 2026",
      text:
        "Promoted to head waiter in my first week. I coordinated a five-person front-of-house team that served 400 to 500 customers on a 13-hour launch-period day, when the restaurant set a single-day sales record of about $15,000.",
    },
    {
      role: "President",
      org: "Toastmasters M76 Club",
      location: "Marlboro, NJ",
      date: "Jun 2024 – Jun 2026",
      text:
        "Led a seven-officer executive team and a club of about 30 members through more than 30 meetings, managing agendas, scheduling, and weekly leadership assignments.",
    },
    {
      role: "Worship Leader, AV Technician & Youth Mentor",
      org: "Monmouth Community Christian Church – Joywok",
      location: "Holmdel, NJ",
      date: "Jan 2021 – Jun 2026",
      text:
        "Directed weekly worship and technical production for about 30 attendees, and more than 100 at major events, supervising a three-person AV team. Trained five AV volunteers and mentored more than 15 younger students.",
    },
    {
      role: "Church Representative",
      org: "Thriving Immigrant Congregations Initiative",
      location: "Chicago, IL",
      date: "Jun 2024",
      text:
        "Represented my church at a national intergenerational leadership initiative, speaking in workshops and on a large-group panel before about 150 participants.",
    },
  ],

  /* ---- Coursework -----------------------------------------------------------
     Official course titles only. No grades, professors, or meeting times. */
  coursework: {
    term: "Fall 2026",
    courses: [
      "Introduction to Microeconomics",
      "Introduction to Marketing",
      "Introduction to Supply Chain Management",
      "Finance for Personal and Professional Success",
      "The Structure of Information",
    ],
  },

  /* ---- Involvement ----------------------------------------------------------
     Describe what you actually do. Attending is not the same as membership,
     and applying is not the same as being accepted. */
  involvement: [
    {
      name: "InterVarsity and Epic Christian Fellowship",
      text: "I take part in fellowship, Bible studies, and small- and large-group gatherings with both, and attended InterVarsity's Selah retreat at Lake Champion.",
    },
    {
      name: "Scholars of Finance",
      text: "I attend events and networking sessions when my schedule allows.",
    },
    {
      name: "Ascend",
      text: "I have attended its workshops and networking sessions.",
    },
  ],

  // A sentence shown under the list. It states a plan, not a position you hold.
  involvementNote: "I plan to take on a larger role in both Scholars of Finance and Ascend.",

  /* ---- Upcoming events ------------------------------------------------------
     Each event disappears from the site by itself the day after `ends`
     (written year-month-day). `status` must match the evidence you have:
     "Interested", "Registered", "Selected as a volunteer", and so on.
     `why` is one or two sentences, in your words, on why it interests you.
     After an event, either delete it or move it elsewhere with a real
     reflection in your own words. */
  events: [
    {
      name: "Mastering the Art of Networking: A Career Conference & Etiquette Dinner",
      when: "Tuesday, November 17, 2026",
      where: "Busch Student Center, Rutgers University, Piscataway",
      status: "Registered",
      why: "I want to meet people working in finance, hear what they are doing, and get feedback from more experienced professionals on how I can grow. It is also the evening before the Venture Summit, so it is a good place to practice introducing myself.",
      ends: "2026-11-17",
      href: "",
    },
    {
      name: "The New York Venture Summit",
      when: "November 18 and 19, 2026",
      where: "New York City, presented by youngStartup Ventures",
      status: "Selected for the volunteer team",
      why: "I'll be volunteering, and I hope to meet founders and investors and start relationships I can keep building. As a first-year student, I want to take opportunities like this as early as I can.",
      ends: "2026-11-19",
      href: "https://www.youngstartup.com/",
    },
  ],

  /* ---- Education ------------------------------------------------------------ */
  education: [
    {
      school: "Rutgers Business School–New Brunswick",
      line: "Bachelor of Science in Finance",
      date: "Expected May 2030",
      detail: "",                     // e.g. "GPA 0.00 / 4.00; Dean's List, Fall 2026"
    },
    {
      school: "Marlboro High School",
      line: "Business Administration Magnet Program",
      date: "June 2026",
      detail: "Weighted GPA 4.91 / 5.00. AP Scholar with Distinction, DECA and FBLA state qualifier (4×), NJ tennis state champion, National Honor Society.",
    },
  ],
};
