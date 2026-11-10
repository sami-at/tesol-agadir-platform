/**
 * Displays a single term. When `selectable` is true, renders as an
 * accessible radio-style selectable card (used on the Apply page).
 */
export default function TermCard({ term, selectable = false, selected = false, onSelect }) {
  if (selectable) {
    return (
      <button
        type="button"
        role="radio"
        aria-checked={selected}
        onClick={() => onSelect?.(term.id)}
        className={`relative w-full border p-4 text-left transition-all ${
          selected
            ? "border-oceanic bg-oceanic/5 ring-1 ring-oceanic"
            : "border-slate/15 bg-white hover:border-oceanic/40 hover:bg-sand/30"
        }`}
      >
        {term.popular && (
          <span className="absolute -top-2.5 right-3 rounded-full bg-saffron px-2.5 py-0.5 text-[0.65rem] font-bold uppercase tracking-wide text-slate">
            Popular
          </span>
        )}
        <div className="flex items-start justify-between gap-2">
          <p className="font-medium text-slate">{term.name}</p>
          <span
            className={`mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full border-2 ${
              selected ? "border-oceanic bg-oceanic" : "border-slate/30"
            }`}
            aria-hidden="true"
          >
            {selected && <span className="h-1.5 w-1.5 rounded-full bg-white" />}
          </span>
        </div>
        <p className="mt-2 text-xs text-slate/60">
          {term.startDate} – {term.endDate}
        </p>
        <p className="mt-0.5 text-xs text-slate/60">{term.mode}</p>
      </button>
    );
  }

  return (
    <div className="border border-slate/10 bg-white p-5">
      <div className="flex items-center justify-between">
        <p className="font-heading font-semibold text-slate">{term.name}</p>
        <span className="rounded-full bg-sand-dark px-2.5 py-0.5 text-[0.65rem] font-semibold uppercase tracking-wide text-slate/60">
          {term.status}
        </span>
      </div>
      <dl className="mt-4 space-y-2 text-sm text-slate/70">
        <div className="flex justify-between">
          <dt>Dates</dt>
          <dd className="font-medium text-slate">
            {term.startDate} – {term.endDate}
          </dd>
        </div>
        <div className="flex justify-between">
          <dt>Mode</dt>
          <dd className="font-medium text-slate">{term.mode}</dd>
        </div>
        <div className="flex justify-between">
          <dt>Application Deadline</dt>
          <dd className="font-medium text-slate">{term.applicationDeadline}</dd>
        </div>
      </dl>
    </div>
  );
}
