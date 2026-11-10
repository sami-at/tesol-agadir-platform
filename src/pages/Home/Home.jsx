import { Link } from "react-router-dom";
import Seo from "../../components/common/Seo";
import Hero from "../../components/sections/Hero";
import Section from "../../components/common/Section";
import Card from "../../components/common/Card";
import StatCard from "../../components/common/StatCard";
import TestimonialCard from "../../components/sections/TestimonialCard";
import CTASection from "../../components/sections/CTASection";
import Icon from "../../components/common/Icon";
import { useContent } from "../../context/ContentContext";

const WHY_CHOOSE_ICONS = {
  standards: "globe",
  practicum: "users",
  flexible: "clock",
  support: "shield",
};

export default function Home() {
  const { content } = useContent();
  const { siteContent, testimonials, seoConfig, media } = content;

  return (
    <>
      <Seo title={seoConfig.home.title} description={seoConfig.home.description} />

      <Hero
        heading={siteContent.hero.heading}
        subheading={siteContent.hero.subheading}
        image={media.heroImage}
      />

      <Section className="border-b border-slate/10 !py-12">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
          {siteContent.stats.map((stat) => (
            <StatCard key={stat.id} label={stat.label} value={stat.value} />
          ))}
        </div>
      </Section>

      <Section eyebrow="Why TESOL Agadir" title="Built for Serious, Career-Focused Teachers" className="bg-white">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {siteContent.whyChoose.map((item) => (
            <Card
              key={item.id}
              title={item.title}
              description={item.description}
              icon={<Icon name={WHY_CHOOSE_ICONS[item.id]} className="h-5 w-5" />}
            />
          ))}
        </div>
      </Section>

      <Section eyebrow="The Program" title="Program Overview">
        <div className="mx-auto max-w-2xl text-center">
          <p className="leading-relaxed text-slate/70">{siteContent.programOverview.summary}</p>
          <ul className="mt-7 flex flex-wrap justify-center gap-3">
            {siteContent.programOverview.highlights.map((highlight) => (
              <li
                key={highlight}
                className="rounded-full border border-oceanic/20 bg-oceanic/6 px-4 py-1.5 text-sm font-medium text-oceanic"
              >
                {highlight}
              </li>
            ))}
          </ul>
          <Link
            to="/program"
            className="mt-7 inline-flex items-center gap-1.5 font-semibold text-terracotta hover:underline"
          >
            Explore the full curriculum
            <Icon name="arrowRight" className="h-4 w-4" />
          </Link>
        </div>
      </Section>

      <Section eyebrow="Alumni Voices" title="What Our Graduates Say" className="bg-white">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {testimonials.map((testimonial) => (
            <TestimonialCard key={testimonial.id} {...testimonial} />
          ))}
        </div>
      </Section>

      <CTASection
        heading="Ready to Start Your TESOL Journey?"
        subheading="Take the first step toward an internationally recognized teaching certification."
      />
    </>
  );
}
