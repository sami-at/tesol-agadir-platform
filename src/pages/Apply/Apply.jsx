import Seo from "../../components/common/Seo";
import Section from "../../components/common/Section";
import Icon from "../../components/common/Icon";
import ApplicationForm from "../../components/forms/ApplicationForm";
import { useContent } from "../../context/ContentContext";

const PROGRAM_HIGHLIGHTS = [
  {
    id: "practice",
    icon: "users",
    title: "Hands-On Teaching Practice",
    description: "Learn methodologies that work in real, modern classrooms — not just theory.",
  },
  {
    id: "recognition",
    icon: "globe",
    title: "Internationally Recognized",
    description: "Graduate with a certification that strengthens your resume anywhere in the world.",
  },
  {
    id: "crmef",
    icon: "graduationCap",
    title: "CRMEF Exam Readiness",
    description: "Build the strong foundation you need to excel in Morocco's CRMEF entrance exams.",
  },
  {
    id: "community",
    icon: "shield",
    title: "A Supportive Community",
    description: "Join a network of passionate future educators and mentors who want you to succeed.",
  },
];

export default function Apply() {
  const { content } = useContent();
  const { seoConfig, applicationSettings, siteContent, terms } = content;
  const { registrationNote, trainingPeriod, schedule } = applicationSettings;
  const { contact } = siteContent;
  const fallTerm = terms?.find((term) => term.id === "fall");
  const mapsHref = contact?.address
    ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(contact.address)}`
    : undefined;

  return (
    <>
      <Seo title={seoConfig.apply.title} description={seoConfig.apply.description} />

      <section className="bg-gradient-to-br from-oceanic to-oceanic-dark text-white">
        <div className="mx-auto max-w-3xl px-4 py-8 text-center sm:px-6 md:py-12">
          <p className="text-xs font-semibold uppercase tracking-[0.15em] text-white/70">
            {fallTerm?.name ?? "Registration"} · Now Enrolling
          </p>
          <h1 className="mt-1.5 font-heading text-2xl font-semibold sm:mt-2 sm:text-3xl md:text-4xl">
            Teach English. Inspire the World.
          </h1>
          <p className="mx-auto mt-3 hidden max-w-xl leading-relaxed text-white/80 sm:block">
            Become a certified English teacher and open the door to exciting career opportunities
            in Morocco and beyond — earn your internationally recognized TESOL certification in
            just 12 weeks.
          </p>
          <div className="mt-4 flex flex-wrap items-center justify-center gap-x-6 gap-y-1.5 text-xs text-white/85 sm:mt-5 sm:gap-x-8 sm:text-sm">
            <span className="flex items-center gap-1.5 sm:gap-2">
              <Icon name="clock" className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              12-Week Program
            </span>
            <span className="flex items-center gap-1.5 sm:gap-2">
              <Icon name="graduationCap" className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              Internationally Recognized
            </span>
            <span className="flex items-center gap-1.5 sm:gap-2">
              <Icon name="users" className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              Hands-On Teaching Practice
            </span>
          </div>

          <div className="mx-auto mt-4 grid max-w-xs grid-cols-1 gap-2 border-t border-white/15 pt-4 text-left text-xs text-white/90 sm:mt-5 sm:flex sm:max-w-none sm:flex-wrap sm:items-center sm:justify-center sm:gap-x-6 sm:gap-y-1.5 sm:pt-5 sm:text-center sm:text-sm">
            {mapsHref && (
              <a
                href={mapsHref}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 hover:text-white sm:gap-1.5"
              >
                <Icon name="mapPin" className="h-3.5 w-3.5 shrink-0 sm:h-4 sm:w-4" />
                <span>{contact?.address}</span>
              </a>
            )}
            {contact?.whatsapp && (
              <a
                href={`https://wa.me/${contact.whatsapp.replace(/[^\d]/g, "")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 hover:text-white sm:gap-1.5"
              >
                <Icon name="phone" className="h-3.5 w-3.5 shrink-0 sm:h-4 sm:w-4" />
                <span>WhatsApp: {contact.whatsapp}</span>
              </a>
            )}
            {contact?.phone && (
              <a
                href={`tel:${contact.phone.replace(/\s+/g, "")}`}
                className="flex items-center gap-2 hover:text-white sm:gap-1.5"
              >
                <Icon name="phone" className="h-3.5 w-3.5 shrink-0 sm:h-4 sm:w-4" />
                <span>
                  {contact.contactPerson ? `${contact.contactPerson}: ` : ""}
                  {contact.phone}
                </span>
              </a>
            )}
            {contact?.email && (
              <a
                href={`mailto:${contact.email}`}
                className="flex items-center gap-2 hover:text-white sm:gap-1.5"
              >
                <Icon name="mail" className="h-3.5 w-3.5 shrink-0 sm:h-4 sm:w-4" />
                <span>{contact.email}</span>
              </a>
            )}
            {contact?.facebook && (
              <span className="flex items-center gap-2 sm:gap-1.5">
                <Icon name="globe" className="h-3.5 w-3.5 shrink-0 sm:h-4 sm:w-4" />
                <span>{contact.facebook}</span>
              </span>
            )}
          </div>
        </div>
      </section>

      <section className="bg-white py-6 md:py-8">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <p className="mb-3 text-center text-xs font-semibold uppercase tracking-[0.15em] text-terracotta sm:text-left">
            Why Join Us
          </p>
          <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
            {PROGRAM_HIGHLIGHTS.map((item) => (
              <div
                key={item.id}
                className="flex items-start gap-2 sm:gap-2.5 sm:border sm:border-slate/10 sm:bg-white sm:p-3"
              >
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center text-oceanic sm:mt-0 sm:h-8 sm:w-8 sm:rounded sm:bg-oceanic/8">
                  <Icon name={item.icon} className="h-4 w-4" />
                </span>
                <div className="min-w-0">
                  <p className="text-sm font-semibold leading-snug text-slate">{item.title}</p>
                  <p className="mt-0.5 hidden text-xs leading-snug text-slate/60 sm:block">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Section
        eyebrow="Registration"
        title="Apply for the Program"
        subtitle={
          <span className="hidden sm:inline">
            Complete the form below to begin your application. Our admissions team reviews every
            submission individually.
          </span>
        }
        className="!py-8 md:!py-14"
        headingClassName="!mb-4 md:!mb-8"
        containerClassName="max-w-5xl"
      >
        <div className="flex flex-col gap-8 lg:flex-row lg:items-start">
          <aside className="order-1 w-full lg:order-2 lg:w-[340px] lg:shrink-0">
            <div className="border border-oceanic/20 bg-oceanic/5 p-3 sm:p-4">
              <div className="flex items-center gap-2">
                <Icon name="clock" className="h-4 w-4 shrink-0 text-oceanic" />
                <p className="font-heading text-sm font-semibold text-oceanic">
                  Important Dates & Schedule
                </p>
              </div>
              {registrationNote && (
                <p className="mt-1.5 text-xs leading-snug text-slate/80 sm:mt-2 sm:text-sm sm:leading-relaxed">
                  {registrationNote}
                </p>
              )}
              {fallTerm && (
                <dl className="mt-2 space-y-1 border-t border-oceanic/15 pt-2 text-xs text-slate/80 sm:mt-3 sm:space-y-1.5 sm:pt-3 sm:text-sm">
                  <div className="flex justify-between gap-3">
                    <dt className="text-slate/55">Training Period</dt>
                    <dd className="text-right font-medium">{trainingPeriod}</dd>
                  </div>
                  <div className="flex justify-between gap-3">
                    <dt className="text-slate/55">Schedule</dt>
                    <dd className="text-right font-medium">{schedule}</dd>
                  </div>
                </dl>
              )}
            </div>
          </aside>

          <div className="order-2 min-w-0 flex-1 lg:order-1">
            <ApplicationForm />

            <div className="mt-6 border border-slate/10 bg-white p-4">
              <p className="font-heading text-sm font-semibold text-slate">What Happens Next</p>
              <ol className="mt-3 grid grid-cols-1 gap-3 text-sm text-slate/70 sm:grid-cols-3">
                {[
                  "Submit your application using the form.",
                  "Our admissions team reviews it individually.",
                  "We follow up by phone or email with next steps.",
                ].map((step, index) => (
                  <li key={step} className="flex items-start gap-3">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-oceanic/10 font-heading text-[0.7rem] font-semibold text-oceanic">
                      {index + 1}
                    </span>
                    <span className="leading-relaxed">{step}</span>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </div>
      </Section>
    </>
  );
}


