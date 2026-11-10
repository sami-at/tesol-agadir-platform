/** Inline loading indicator shown while a form is submitting. */
export default function LoadingState({ message = "Submitting..." }) {
  return (
    <div className="flex items-center gap-2.5 text-sm font-medium text-oceanic" role="status">
      <span
        className="h-4 w-4 animate-spin rounded-full border-2 border-oceanic/30 border-t-oceanic"
        aria-hidden="true"
      />
      <span>{message}</span>
    </div>
  );
}
