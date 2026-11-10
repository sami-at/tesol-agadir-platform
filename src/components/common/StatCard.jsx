/** Displays a single statistic (label + value) used in the social-proof strip. */
export default function StatCard({ label, value }) {
  return (
    <div className="text-center sm:border-l sm:border-slate/15 sm:pl-6 sm:text-left sm:first:border-l-0 sm:first:pl-0">
      <p className="font-heading text-3xl font-semibold text-oceanic md:text-4xl">{value}</p>
      <p className="mt-1 text-sm text-slate/60">{label}</p>
    </div>
  );
}
