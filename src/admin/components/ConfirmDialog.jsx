/**
 * Blocking confirmation modal for destructive admin actions (e.g. deleting
 * applications). Renders nothing when `open` is false.
 */
export default function ConfirmDialog({ open, title, message, confirmLabel = "Confirm", onConfirm, onCancel, busy }) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate/40 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-dialog-title"
    >
      <div className="w-full max-w-sm rounded border border-slate/10 bg-white p-5 shadow-xl">
        <h2 id="confirm-dialog-title" className="font-heading text-lg font-semibold text-slate">
          {title}
        </h2>
        <p className="mt-2 text-sm text-slate/70">{message}</p>
        <div className="mt-5 flex justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            disabled={busy}
            className="rounded border border-slate/20 px-3.5 py-2 text-sm font-medium text-slate/70 hover:border-slate/40 disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={busy}
            className="rounded bg-terracotta px-3.5 py-2 text-sm font-semibold text-white hover:bg-terracotta-dark disabled:opacity-50"
          >
            {busy ? "Deleting..." : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
