import { useState } from "react";

/** Accessible accordion driven by curriculum module data. */
export default function CurriculumAccordion({ modules }) {
  const [openId, setOpenId] = useState(modules[0]?.id ?? null);

  return (
    <div className="divide-y divide-slate/10 border border-slate/10 bg-white">
      {modules.map((module, index) => {
        const isOpen = openId === module.id;
        const panelId = `panel-${module.id}`;
        const buttonId = `accordion-${module.id}`;

        return (
          <div key={module.id}>
            <h3>
              <button
                type="button"
                id={buttonId}
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => setOpenId(isOpen ? null : module.id)}
                className="flex w-full items-center gap-4 px-5 py-5 text-left hover:bg-sand/40"
              >
                <span
                  className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full font-heading text-sm font-semibold ${
                    isOpen ? "bg-oceanic text-white" : "bg-oceanic/8 text-oceanic"
                  }`}
                  aria-hidden="true"
                >
                  {index + 1}
                </span>
                <span className="flex-1 font-medium text-slate">{module.title}</span>
                <span aria-hidden="true" className="shrink-0 text-lg text-oceanic">
                  {isOpen ? "−" : "+"}
                </span>
              </button>
            </h3>
            <div className="accordion-panel" data-open={isOpen}>
              <div>
                <div
                  id={panelId}
                  role="region"
                  aria-labelledby={buttonId}
                  className="px-5 pb-6 pl-[3.75rem]"
                >
                  <p className="text-sm text-slate/70">{module.summary}</p>
                  <ul className="mt-3 space-y-1.5 text-sm text-slate/80">
                    {module.topics.map((topic) => (
                      <li key={topic} className="flex items-start gap-2">
                        <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-terracotta" aria-hidden="true" />
                        {topic}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
