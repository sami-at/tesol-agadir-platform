/**
 * Generic labeled form field supporting text/email/tel inputs, selects, and
 * textareas, with accessible labels and inline error messages.
 */
export default function FormField({
  id,
  label,
  type = "text",
  as = "input",
  required = false,
  error,
  options = [],
  ...rest
}) {
  const describedBy = error ? `${id}-error` : undefined;
  const fieldClasses = `w-full rounded border bg-white px-3.5 py-2.5 text-sm text-slate transition-colors focus:outline-none focus:ring-2 focus:ring-oceanic/25 ${
    error ? "border-terracotta focus:border-terracotta" : "border-slate/20 focus:border-oceanic"
  }`;

  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-sm font-medium text-slate">
        {label}
        {required && (
          <span aria-hidden="true" className="ml-0.5 text-terracotta">
            *
          </span>
        )}
      </label>

      {as === "select" && (
        <select
          id={id}
          required={required}
          aria-invalid={Boolean(error)}
          aria-describedby={describedBy}
          className={fieldClasses}
          {...rest}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      )}

      {as === "textarea" && (
        <textarea
          id={id}
          required={required}
          rows={5}
          aria-invalid={Boolean(error)}
          aria-describedby={describedBy}
          className={fieldClasses}
          {...rest}
        />
      )}

      {as === "input" && (
        <input
          id={id}
          type={type}
          required={required}
          aria-invalid={Boolean(error)}
          aria-describedby={describedBy}
          className={fieldClasses}
          {...rest}
        />
      )}

      {error && (
        <p id={`${id}-error`} role="alert" className="mt-1.5 text-xs font-medium text-terracotta">
          {error}
        </p>
      )}
    </div>
  );
}
