/**
 * Generic content card used for "Why Choose" items, program highlights, etc.
 */
export default function Card({ title, description, icon, className = "" }) {
  return (
    <div
      className={`group rounded border border-slate/10 bg-white p-6 transition-shadow duration-150 hover:shadow-[0_4px_20px_-6px_rgba(26,77,100,0.18)] ${className}`}
    >
      {icon && (
        <div className="mb-4 flex h-11 w-11 items-center justify-center rounded bg-oceanic/8 text-oceanic transition-colors group-hover:bg-oceanic group-hover:text-white">
          {icon}
        </div>
      )}
      <h3 className="text-lg font-semibold text-slate">{title}</h3>
      {description && <p className="mt-2 text-sm leading-relaxed text-slate/70">{description}</p>}
    </div>
  );
}
