import Seo from "../../components/common/Seo";
import Section from "../../components/common/Section";
import FacultyCard from "../../components/sections/FacultyCard";
import { useContent } from "../../context/ContentContext";

export default function About() {
  const { content } = useContent();
  const { siteContent, faculty, seoConfig, media } = content;

  return (
    <>
      <Seo title={seoConfig.about.title} description={seoConfig.about.description} />

      <Section eyebrow="Our Purpose" title="Mission & Vision">
        <p className="mx-auto max-w-2xl text-center leading-relaxed text-slate/70">
          {siteContent.about.mission}
        </p>
      </Section>

      <Section eyebrow="Quality Assurance" title="Accreditation & Standards" className="bg-white">
        <div className="mx-auto max-w-3xl">
          <p className="text-center leading-relaxed text-slate/70">
            {siteContent.about.accreditationIntro}
          </p>
          <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
            {siteContent.about.accreditationItems.map((item) => (
              <div key={item.id} className="border border-slate/10 bg-sand/40 p-5">
                <p className="font-semibold text-slate">{item.title}</p>
                <p className="mt-1 text-sm text-slate/60">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </Section>

      <Section eyebrow="Our Team" title="Faculty">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {faculty.map((member) => (
            <FacultyCard key={member.id} {...member} />
          ))}
        </div>
      </Section>

      <Section eyebrow="Visit Us" title="Campus & Location" className="bg-white">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div>
            <p className="leading-relaxed text-slate/70">{siteContent.about.campus}</p>
          </div>
          {media.campusImage ? (
            <img
              src={media.campusImage}
              alt="American TESOL Academy Agadir campus"
              className="h-48 w-full border border-slate/10 object-cover"
            />
          ) : (
            <div
              className="flex h-48 items-center justify-center border border-slate/10 bg-sand-dark/40 text-sm text-slate/50"
              aria-hidden="true"
            >
              Campus Image Placeholder
            </div>
          )}
        </div>
        <div
          className="mt-6 flex h-64 items-center justify-center border border-slate/10 bg-sand-dark/40 text-sm text-slate/50"
          role="img"
          aria-label="Map placeholder showing campus location"
        >
          Map Placeholder
        </div>
      </Section>
    </>
  );
}
