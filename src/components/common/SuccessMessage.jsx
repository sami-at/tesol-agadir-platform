import Icon from "./Icon";

/** Inline success message shown after a successful form submission. */
export default function SuccessMessage({ message = "Thank you! Your submission was received." }) {
  return (
    <div
      role="status"
      className="flex items-start gap-3 rounded border border-oceanic/20 bg-oceanic/6 px-5 py-4 text-sm text-oceanic"
    >
      <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-oceanic text-white" aria-hidden="true">
        <Icon name="check" className="h-3.5 w-3.5" strokeWidth={3} />
      </span>
      <span className="font-medium">{message}</span>
    </div>
  );
}
