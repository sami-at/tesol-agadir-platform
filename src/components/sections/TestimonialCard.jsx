import Icon from "../common/Icon";

/** Displays a single alumni testimonial. Consumes structured data, not hardcoded per instance. */
export default function TestimonialCard({ name, role, quote, photo }) {
  return (
    <blockquote className="flex h-full flex-col border border-slate/10 bg-white p-7">
      <Icon name="quote" className="h-7 w-7 text-terracotta/40" />
      <p className="mt-4 flex-1 text-[0.95rem] leading-relaxed text-slate/80">{quote}</p>
      <footer className="mt-6 flex items-center gap-3 border-t border-slate/8 pt-5">
        <div
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-oceanic/10 text-xs font-semibold text-oceanic"
          aria-hidden="true"
        >
          {photo ? (
            <img src={photo} alt="" className="h-full w-full rounded-full object-cover" />
          ) : (
            name
              .split(" ")
              .map((part) => part[0])
              .join("")
          )}
        </div>
        <div>
          <p className="text-sm font-semibold text-slate">{name}</p>
          <p className="text-xs text-slate/60">{role}</p>
        </div>
      </footer>
    </blockquote>
  );
}
