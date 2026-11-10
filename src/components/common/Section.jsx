/**
 * Consistent page-section wrapper: max-width container, vertical padding,
 * optional eyebrow/title/subtitle, and optional background color.
 */
export default function Section({
  id,
  eyebrow,
  title,
  subtitle,
  align = "center",
  className = "",
  containerClassName = "",
  headingClassName = "",
  children,
}) {
  const alignClasses = align === "left" ? "text-left" : "text-center mx-auto";

  return (
    <section id={id} className={`py-16 md:py-24 ${className}`}>
      <div className={`mx-auto max-w-6xl px-4 sm:px-6 ${containerClassName}`}>
        {(eyebrow || title || subtitle) && (
          <div className={`mb-10 md:mb-14 max-w-2xl ${alignClasses} ${headingClassName}`}>
            {eyebrow && (
              <p className="mb-3 text-xs font-semibold uppercase tracking-[0.15em] text-terracotta">
                {eyebrow}
              </p>
            )}
            {title && (
              <h2 className="text-2xl font-semibold text-slate md:text-[2rem]">{title}</h2>
            )}
            {subtitle && <p className="mt-4 leading-relaxed text-slate/70">{subtitle}</p>}
          </div>
        )}
        {children}
      </div>
    </section>
  );
}
