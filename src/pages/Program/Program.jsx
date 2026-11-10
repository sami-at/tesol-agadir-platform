import Seo from "../../components/common/Seo";
import Section from "../../components/common/Section";
import CurriculumAccordion from "../../components/sections/CurriculumAccordion";
import Button from "../../components/common/Button";
import { useContent } from "../../context/ContentContext";

export default function Program() {
  const { content } = useContent();
  const { curriculumModules, assessmentCriteria, scheduleOptions, seoConfig, syllabusUrl } = content;
  return (
    <>
      <Seo title={seoConfig.program.title} description={seoConfig.program.description} />

      <Section
        eyebrow="Curriculum"
        title="120-Hour TESOL Certification"
        subtitle="A comprehensive program combining theory, language systems, lesson planning, and real classroom practice."
      >
        <CurriculumAccordion modules={curriculumModules} />
      </Section>

      <Section eyebrow="Grading" title="Assessment Criteria" className="bg-white">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
          {assessmentCriteria.map((criteria) => (
            <div key={criteria.id} className="border border-slate/10 bg-sand/40 p-6">
              <p className="font-heading text-lg font-semibold text-oceanic">{criteria.level}</p>
              <p className="mt-2 text-sm leading-relaxed text-slate/70">{criteria.description}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section eyebrow="Flexibility" title="Schedule Options">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {scheduleOptions.map((schedule) => (
            <div key={schedule.id} className="border border-slate/10 bg-white p-6">
              <div className="flex items-baseline justify-between">
                <h3 className="font-heading text-lg font-semibold text-slate">{schedule.label}</h3>
                <span className="text-sm text-slate/60">{schedule.duration}</span>
              </div>
              <p className="mt-2 text-sm leading-relaxed text-slate/70">{schedule.description}</p>
              <ul className="mt-4 space-y-2 text-sm text-slate/80">
                {schedule.sessions.map((session) => (
                  <li
                    key={`${schedule.id}-${session.day}`}
                    className="flex justify-between border-t border-slate/8 pt-2"
                  >
                    <span className="font-medium">{session.day}</span>
                    <span>{session.time}</span>
                    <span className="text-slate/60">{session.focus}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </Section>

      <Section className="bg-white">
        <div className="flex flex-col items-center gap-4 text-center sm:flex-row sm:justify-center">
          <Button href={syllabusUrl} variant="outline" download>
            Download Complete Syllabus
          </Button>
          <Button to="/apply" variant="secondary">
            Apply Now
          </Button>
        </div>
      </Section>
    </>
  );
}
