import Seo from "../../components/common/Seo";
import Section from "../../components/common/Section";
import TermTable from "../../components/sections/TermTable";
import TermCard from "../../components/sections/TermCard";
import CTASection from "../../components/sections/CTASection";
import { useContent } from "../../context/ContentContext";

export default function TuitionDates() {
  const { content } = useContent();
  const { terms, tuitionBreakdown, paymentOptions, scholarships, seoConfig } = content;
  return (
    <>
      <Seo title={seoConfig.tuitionDates.title} description={seoConfig.tuitionDates.description} />

      <Section
        eyebrow="Calendar"
        title="Term Calendar"
        subtitle="Upcoming terms and application deadlines. Dates and status are placeholders until finalized."
      >
        {/* Table on larger screens */}
        <div className="hidden md:block">
          <TermTable terms={terms} />
        </div>
        {/* Stacked cards on mobile */}
        <div className="grid grid-cols-1 gap-4 md:hidden">
          {terms.map((term) => (
            <TermCard key={term.id} term={term} />
          ))}
        </div>
      </Section>

      <Section eyebrow="Investment" title="Tuition" className="bg-white">
        <div className="mx-auto max-w-2xl divide-y divide-slate/10 border border-slate/10 bg-sand/40">
          {tuitionBreakdown.map((item) => (
            <div key={item.id} className="flex justify-between px-5 py-3.5 text-sm">
              <span className="text-slate/70">{item.label}</span>
              <span className="font-medium text-slate">{item.value}</span>
            </div>
          ))}
        </div>
        <div className="mx-auto mt-8 max-w-2xl">
          <h3 className="font-heading font-semibold text-slate">Payment Options</h3>
          <ul className="mt-3 space-y-1.5 text-sm text-slate/70">
            {paymentOptions.map((option) => (
              <li key={option} className="flex items-start gap-2">
                <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-terracotta" aria-hidden="true" />
                {option}
              </li>
            ))}
          </ul>
        </div>
      </Section>

      <Section eyebrow="Affordability" title="Scholarships & Discounts">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          {scholarships.map((item) => (
            <div key={item.id} className="border border-slate/10 bg-white p-6">
              <p className="font-semibold text-slate">{item.title}</p>
              <p className="mt-2 text-sm leading-relaxed text-slate/70">{item.description}</p>
            </div>
          ))}
        </div>
      </Section>

      <CTASection heading="Select Your Term & Apply" />
    </>
  );
}
