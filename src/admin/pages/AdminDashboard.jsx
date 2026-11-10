import { Link } from "react-router-dom";
import { getAdminGroups } from "../adminSchema";

export default function AdminDashboard() {
  const groups = getAdminGroups();

  return (
    <div>
      <h1 className="font-heading text-2xl font-semibold text-slate">Content Dashboard</h1>
      <p className="mt-1 max-w-2xl text-sm text-slate/60">
        Select a section below to add, edit, or remove the information shown on the public
        website. Changes save immediately and appear on the live site without any code changes.
      </p>

      <div className="mt-8 space-y-8">
        {groups.map((group) => (
          <div key={group.name}>
            <h2 className="text-xs font-semibold uppercase tracking-[0.12em] text-slate/40">
              {group.name}
            </h2>
            <div className="mt-3 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {group.sections.map((section) => (
                <Link
                  key={section.key}
                  to={`/admin/${section.key}`}
                  className="border border-slate/10 bg-white p-5 transition-shadow hover:shadow-[0_4px_20px_-6px_rgba(26,77,100,0.18)]"
                >
                  <p className="font-semibold text-slate">{section.label}</p>
                  <p className="mt-1.5 text-sm leading-relaxed text-slate/60">
                    {section.description}
                  </p>
                  {section.pageLabel && (
                    <p className="mt-3 flex items-start gap-1.5 text-xs font-medium text-oceanic">
                      <span aria-hidden="true">📍</span>
                      <span>{section.pageLabel}</span>
                    </p>
                  )}
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
