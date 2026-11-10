// Keep in sync with APPLICATION_STATUSES in server/routes/applications.js.
export const APPLICATION_STATUSES = [
  { value: "not_contacted", label: "Not Contacted", color: "bg-slate/10 text-slate/70 border-slate/20" },
  { value: "contacted", label: "Contacted", color: "bg-oceanic/10 text-oceanic border-oceanic/25" },
  {
    value: "waiting_response",
    label: "Waiting for Response",
    color: "bg-amber-100 text-amber-700 border-amber-300",
  },
  { value: "responded", label: "Responded", color: "bg-purple-100 text-purple-700 border-purple-300" },
  { value: "accepted", label: "Accepted", color: "bg-green-100 text-green-700 border-green-300" },
  { value: "rejected", label: "Rejected", color: "bg-terracotta/10 text-terracotta border-terracotta/30" },
];

export function getStatusMeta(value) {
  return APPLICATION_STATUSES.find((s) => s.value === value) ?? APPLICATION_STATUSES[0];
}
