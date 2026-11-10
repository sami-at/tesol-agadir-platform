/** Inline error message shown after a failed form submission. */
export default function ErrorState({ message = "Something went wrong. Please try again." }) {
  return (
    <div
      role="alert"
      className="flex items-start gap-2.5 rounded border border-terracotta/30 bg-terracotta/8 px-4 py-3 text-sm text-terracotta-dark"
    >
      <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-terracotta text-[10px] font-bold text-white" aria-hidden="true">
        !
      </span>
      <span>{message}</span>
    </div>
  );
}
