/** Displays a single faculty member profile. Consumes structured faculty data. */
export default function FacultyCard({ name, position, education, bio, photo }) {
  return (
    <div className="border border-slate/10 bg-white p-6 text-center">
      <div
        className="mx-auto flex h-20 w-20 items-center justify-center rounded-full border border-oceanic/15 bg-oceanic/6 text-xs font-medium uppercase tracking-wide text-oceanic/50"
        aria-hidden="true"
      >
        {photo ? (
          <img src={photo} alt="" className="h-full w-full rounded-full object-cover" />
        ) : (
          "Photo"
        )}
      </div>
      <h3 className="mt-4 font-heading text-lg font-semibold text-slate">{name}</h3>
      <p className="text-sm font-medium text-terracotta">{position}</p>
      <p className="mt-1 text-xs text-slate/50">{education}</p>
      <p className="mt-3 text-sm leading-relaxed text-slate/70">{bio}</p>
    </div>
  );
}
