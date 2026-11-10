// Seed content for the database. This is the single source of truth for
// "factory defaults" — every value here is either real academy copy already
// approved, or an explicit placeholder ("TBD", "", null). The admin
// dashboard edits a *copy* of this data persisted via the backend API;
// nothing here should ever be invented/fabricated.
import { siteContent } from "./siteContent.js";
import { terms, tuitionBreakdown, paymentOptions, scholarships } from "./terms.js";
import { curriculumModules, assessmentCriteria, scheduleOptions } from "./curriculum.js";
import { faculty } from "./faculty.js";
import { testimonials } from "./testimonials.js";
import { seoConfig } from "./seo.js";

export const defaultContent = {
  siteContent,
  terms,
  tuitionBreakdown,
  paymentOptions,
  scholarships,
  curriculumModules,
  assessmentCriteria,
  scheduleOptions,
  faculty,
  testimonials,
  seoConfig,
  // Editable media references (URLs). Empty string = no real asset supplied yet.
  media: {
    heroImage: "",
    campusImage: "",
    faviconUrl: "",
  },
  syllabusUrl: "/syllabus-placeholder.txt",
  applicationSettings: {
    // Shown as an info banner on the Apply page above the form.
    registrationNote:
      "Online Registration: September 20–27. In-Person Registration & Orientation: Sunday, September 27 (Registration 15:30, Orientation 16:00–17:30). Training starts Sunday, October 4.",
    // Shown in the "Important Dates & Schedule" card's table, below the registration note.
    trainingPeriod: "October 4, 2026 – December 20, 2026",
    schedule: "Full-Time — Sundays, 13:00–17:30",
  },
  // Static text shown on/around the Apply page's application form itself.
  applicationForm: {
    sections: [
      { title: "Personal Information", subtitle: "Tell us who you are and how to reach you." },
      {
        title: "Educational Background",
        subtitle: "Optional — a degree is not a requirement to apply.",
      },
      {
        title: "Teaching Background",
        subtitle: "Optional — share any relevant teaching experience.",
      },
      { title: "Questions", subtitle: "Anything you'd like to ask before you apply?" },
    ],
    fieldLabels: {
      firstName: "First Name",
      lastName: "Last Name",
      email: "Email Address",
      gender: "Gender",
      phone: "Phone Number",
      city: "City of Residence",
      degreeInfo: "Degree / Major / University / Graduation Date",
      degreeInfoPlaceholder: "A degree is NOT a requirement.",
      teachingBackground: "Institution / Position / Start Date / End Date",
      questions:
        "If you have any questions, please leave your questions here. Our team will react to you soon by email",
    },
    genderOptions: [
      { value: "female", label: "Female" },
      { value: "male", label: "Male" },
    ],
    confidentialityNote: "Your information is kept confidential and used only for admissions purposes.",
    submitButtonLabel: "Submit Application Now",
    successTitle: "Application Received!",
    successMessage:
      "Thank you! Our admissions team will review your application and contact you shortly by phone or email.",
  },
};
