/** Responsive table of terms for desktop; falls back to stacked cards on mobile via TermCard. */
export default function TermTable({ terms }) {
  return (
    <div className="overflow-x-auto border border-slate/10 bg-white">
      <table className="w-full min-w-[640px] text-left text-sm">
        <caption className="sr-only">Upcoming TESOL certification terms</caption>
        <thead>
          <tr className="border-b border-slate/10">
            <th scope="col" className="px-5 py-3.5 text-xs font-semibold uppercase tracking-wide text-slate/50">
              Term
            </th>
            <th scope="col" className="px-5 py-3.5 text-xs font-semibold uppercase tracking-wide text-slate/50">
              Dates
            </th>
            <th scope="col" className="px-5 py-3.5 text-xs font-semibold uppercase tracking-wide text-slate/50">
              Mode
            </th>
            <th scope="col" className="px-5 py-3.5 text-xs font-semibold uppercase tracking-wide text-slate/50">
              Application Deadline
            </th>
            <th scope="col" className="px-5 py-3.5 text-xs font-semibold uppercase tracking-wide text-slate/50">
              Status
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate/8">
          {terms.map((term) => (
            <tr key={term.id} className="hover:bg-sand/30">
              <th scope="row" className="px-5 py-4 font-heading font-semibold text-slate">
                {term.name}
              </th>
              <td className="px-5 py-4 text-slate/70">
                {term.startDate} – {term.endDate}
              </td>
              <td className="px-5 py-4 text-slate/70">{term.mode}</td>
              <td className="px-5 py-4 text-slate/70">{term.applicationDeadline}</td>
              <td className="px-5 py-4">
                <span className="rounded-full bg-sand-dark px-2.5 py-1 text-xs font-semibold uppercase tracking-wide text-slate/60">
                  {term.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
