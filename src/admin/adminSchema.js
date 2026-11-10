// Declarative map of every admin-editable content section. Each entry's
// `path` is [topLevelContentKey, ...nestedKeys]. The generic section editor
// reads/writes exactly that slice of the shared content object, so adding a
// new manageable section only requires adding an entry here.
export const ADMIN_SECTIONS = [
  {
    key: "application-settings",
    label: "Application Requirements",
    group: "Apply",
    path: ["applicationSettings"],
    description:
      "The registration note, training period, and weekly schedule shown in the \"Important Dates\" card on the Apply page.",
    page: "/apply",
    pageLabel: "Apply page \u2014 \"Important Dates\" card above the form",
  },
  {
    key: "application-form",
    label: "Application Form Text",
    group: "Apply",
    path: ["applicationForm"],
    description:
      "Section titles, field labels, gender options, and submit/success text on the application form itself.",
    page: "/apply",
    pageLabel: "Apply page \u2014 the application form itself",
  },
  {
    key: "hero",
    label: "Homepage Hero",
    group: "Home",
    path: ["siteContent", "hero"],
    description: "The main heading and subheading shown at the top of the homepage.",
    page: "/",
    pageLabel: "Homepage \u2014 top banner",
  },
  {
    key: "stats",
    label: "Homepage Stats",
    group: "Home",
    path: ["siteContent", "stats"],
    description: "The statistic badges (e.g. placement rate, graduate count) on the homepage.",
    page: "/",
    pageLabel: "Homepage \u2014 stats row, just below the top banner",
  },
  {
    key: "why-choose",
    label: "Why Choose Us",
    group: "Home",
    path: ["siteContent", "whyChoose"],
    description: "The four feature cards explaining why students should choose the academy.",
    page: "/",
    pageLabel: 'Homepage \u2014 "Why TESOL Agadir" feature cards',
  },
  {
    key: "program-overview",
    label: "Program Overview",
    group: "Home",
    path: ["siteContent", "programOverview"],
    description: "The summary and highlight tags shown on the homepage's program section.",
    page: "/",
    pageLabel: 'Homepage \u2014 "Program Overview" section',
  },
  {
    key: "testimonials",
    label: "Testimonials",
    group: "Home",
    path: ["testimonials"],
    description: "Alumni testimonials shown on the homepage.",
    page: "/",
    pageLabel: 'Homepage \u2014 "What Our Graduates Say" section',
  },
  {
    key: "accreditation",
    label: "Accreditation & About",
    group: "About",
    path: ["siteContent", "about"],
    description: "Mission statement, accreditation details, and the campus description.",
    page: "/about",
    pageLabel: "About page \u2014 mission & accreditation section",
  },
  {
    key: "faculty",
    label: "Faculty & Staff",
    group: "About",
    path: ["faculty"],
    description: "Faculty profiles shown on the About page.",
    page: "/about",
    pageLabel: "About page \u2014 Faculty section",
  },
  {
    key: "curriculum-modules",
    label: "Curriculum Modules",
    group: "Program",
    path: ["curriculumModules"],
    description: "The modules and topics shown in the Program page's curriculum accordion.",
    page: "/program",
    pageLabel: "Program page \u2014 curriculum accordion",
  },
  {
    key: "assessment-criteria",
    label: "Assessment Criteria",
    group: "Program",
    path: ["assessmentCriteria"],
    description: "The grading bands (Pass / Merit / Distinction) shown on the Program page.",
    page: "/program",
    pageLabel: "Program page \u2014 Assessment Criteria section",
  },
  {
    key: "schedule-options",
    label: "Schedule Options",
    group: "Program",
    path: ["scheduleOptions"],
    description: "Full-Time / Intensive schedule details and weekly session timetables.",
    page: "/program",
    pageLabel: "Program page \u2014 Schedule Options section",
  },
  {
    key: "syllabus",
    label: "Syllabus Document Link",
    group: "Program",
    path: ["syllabusUrl"],
    description: "The URL used by the Program page's \"Download Complete Syllabus\" button.",
    page: "/program",
    pageLabel: 'Program page \u2014 bottom "Download Complete Syllabus" button',
  },
  {
    key: "practicum",
    label: "Practicum Information",
    group: "Practicum",
    path: ["siteContent", "practicum"],
    description: "The practicum overview, structure steps, and feedback types.",
    page: "/practicum",
    pageLabel: "Practicum page \u2014 entire page",
  },
  {
    key: "tuition-breakdown",
    label: "Tuition Breakdown",
    group: "Tuition & Dates",
    path: ["tuitionBreakdown"],
    description: "Line-item tuition and fee amounts shown on the Tuition & Dates page.",
    page: "/tuition-dates",
    pageLabel: "Tuition & Dates page \u2014 Tuition section",
  },
  {
    key: "payment-options",
    label: "Payment Options",
    group: "Tuition & Dates",
    path: ["paymentOptions"],
    description: "The list of accepted payment methods/plans.",
    page: "/tuition-dates",
    pageLabel: "Tuition & Dates page \u2014 Payment Options list",
  },
  {
    key: "scholarships",
    label: "Scholarships & Discounts",
    group: "Tuition & Dates",
    path: ["scholarships"],
    description: "Scholarship and discount offers shown on the Tuition & Dates page.",
    page: "/tuition-dates",
    pageLabel: "Tuition & Dates page \u2014 Scholarships & Discounts section",
  },
  {
    key: "terms",
    label: "Term Dates & Deadlines",
    group: "Tuition & Dates",
    path: ["terms"],
    description: "Start/end dates and application deadlines for each term, shown site-wide.",
    page: "/tuition-dates",
    pageLabel: "Tuition & Dates page \u2014 Term Calendar table",
  },
  {
    key: "contact-info",
    label: "Contact Information",
    group: "Contact",
    path: ["siteContent", "contact"],
    description: "Phone, WhatsApp, email, address, and opening hours shown site-wide.",
    page: "/contact",
    pageLabel: "Contact page \u2014 contact details list",
  },
  {
    key: "general-info",
    label: "Academy Name & Tagline",
    group: "Website & SEO",
    path: ["siteContent", "general"],
    description: "The academy's name and short tagline shown in the header and footer.",
    page: null,
    pageLabel: "Every page \u2014 site header & footer",
  },
  {
    key: "media",
    label: "Images & Media",
    group: "Website & SEO",
    path: ["media"],
    description: "Hero image, campus image, and favicon URLs used throughout the site.",
    page: "/",
    pageLabel: "Homepage (hero image), About page (campus image), browser tab (favicon)",
  },
  {
    key: "seo",
    label: "SEO / Page Metadata",
    group: "Website & SEO",
    path: ["seoConfig"],
    page: null,
    pageLabel: "Not visible on the page itself \u2014 controls the browser tab title and search engine result snippets for each page",
    description: "Per-page browser titles and meta descriptions used for search engines.",
  },
];

export function findAdminSection(key) {
  return ADMIN_SECTIONS.find((section) => section.key === key);
}

export function getAdminGroups() {
  const groups = [];
  ADMIN_SECTIONS.forEach((section) => {
    let group = groups.find((g) => g.name === section.group);
    if (!group) {
      group = { name: section.group, sections: [] };
      groups.push(group);
    }
    group.sections.push(section);
  });
  return groups;
}
