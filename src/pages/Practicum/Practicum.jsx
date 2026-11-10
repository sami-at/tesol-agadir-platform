import Seo from "../../components/common/Seo";
import Section from "../../components/common/Section";
import CTASection from "../../components/sections/CTASection";
import { useContent } from "../../context/ContentContext";

export default function Practicum() {
  const { content } = useContent();
  const { practicum } = content.siteContent;
  const { seoConfig } = content;

  return (
    <>
      <Seo title={seoConfig.practicum.title} description={seoConfig.practicum.description} />

      <Section eyebrow="Hands-On Training" title="Practicum Overview">
        <p className="mx-auto max-w-2xl text-center leading-relaxed text-slate/70">
          {practicum.overview}
        </p>
      </Section>

      <Section eyebrow="How It Works" title="Practicum Structure" className="bg-white">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
          {practicum.structure.map((item, index) => (
            <div key={item.id} className="border border-slate/10 bg-sand/40 p-6">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-oceanic/10 font-heading text-sm font-semibold text-oceanic">
                {index + 1}
              </span>
              <p className="mt-4 font-semibold text-slate">{item.label}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section eyebrow="Alumni Insight" title="Feedback">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          {practicum.feedback.map((item) => (
            <div key={item.id} className="border border-slate/10 bg-white p-6">
              <p className="font-semibold text-slate">{item.label}</p>
            </div>
          ))}
        </div>
      </Section>

      <CTASection
        heading="Gain Real Teaching Experience"
        subheading="Apply now to start your supervised teaching practicum in Agadir."
      />
    </>
  );
}
