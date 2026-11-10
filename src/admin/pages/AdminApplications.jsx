import { Fragment, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  fetchApplications,
  updateApplicationStatus,
  deleteApplication,
  deleteApplications,
} from "../../services/applicationService";
import { useAuth } from "../../context/AuthContext";
import { APPLICATION_STATUSES, getStatusMeta } from "../applicationStatuses";
import { buildCsv, downloadCsv } from "../utils/exportCsv";
import ConfirmDialog from "../components/ConfirmDialog";
import LoadingState from "../../components/common/LoadingState";
import ErrorState from "../../components/common/ErrorState";
import Icon from "../../components/common/Icon";

function formatDate(value) {
  const date = new Date(`${value}Z`);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

const CSV_HEADERS = [
  "First Name",
  "Last Name",
  "Email",
  "Phone",
  "Gender",
  "City",
  "Degree Info",
  "Teaching Background",
  "Questions",
  "Status",
  "Submitted At",
];

function toCsvRow(app) {
  return [
    app.firstName,
    app.lastName,
    app.email,
    app.phone,
    app.gender,
    app.city,
    app.degreeInfo,
    app.teachingBackground,
    app.questions,
    getStatusMeta(app.status).label,
    formatDate(app.createdAt),
  ];
}

function todayStamp() {
  return new Date().toISOString().slice(0, 10);
}

export default function AdminApplications() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const [applications, setApplications] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [actionError, setActionError] = useState("");
  const [selectedIds, setSelectedIds] = useState(() => new Set());
  const [expandedId, setExpandedId] = useState(null);
  const [savingStatusId, setSavingStatusId] = useState(null);
  const [confirmAction, setConfirmAction] = useState(null); // { type: "one"|"selected"|"all", id? }
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    let cancelled = false;
    fetchApplications()
      .then((rows) => {
        if (!cancelled) setApplications(rows);
      })
      .catch(async (err) => {
        if (cancelled) return;
        if (err.status === 401) {
          await logout();
          navigate("/admin/login", { replace: true });
          return;
        }
        setErrorMessage(err.message || "Unable to load applications.");
      });
    return () => {
      cancelled = true;
    };
  }, [logout, navigate]);

  const allSelected = applications?.length > 0 && selectedIds.size === applications.length;
  const someSelected = selectedIds.size > 0;

  const selectedApps = useMemo(
    () => (applications ?? []).filter((app) => selectedIds.has(app.id)),
    [applications, selectedIds],
  );

  const toggleOne = (id) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleAll = () => {
    setSelectedIds((prev) => {
      if (applications && prev.size === applications.length) return new Set();
      return new Set((applications ?? []).map((app) => app.id));
    });
  };

  const clearSelection = () => setSelectedIds(new Set());

  const handleStatusChange = async (id, status) => {
    const previous = applications;
    setActionError("");
    setSavingStatusId(id);
    setApplications((rows) => rows.map((row) => (row.id === id ? { ...row, status } : row)));
    try {
      await updateApplicationStatus(id, status);
    } catch (err) {
      if (err.status === 401) {
        await logout();
        navigate("/admin/login", { replace: true });
        return;
      }
      setApplications(previous);
      setActionError(err.message || "Unable to update status. Please try again.");
    } finally {
      setSavingStatusId(null);
    }
  };

  const exportAll = () => {
    const csv = buildCsv(CSV_HEADERS, (applications ?? []).map(toCsvRow));
    downloadCsv(`applications-all-${todayStamp()}.csv`, csv);
  };

  const exportSelected = () => {
    if (selectedApps.length === 0) return;
    const csv = buildCsv(CSV_HEADERS, selectedApps.map(toCsvRow));
    downloadCsv(`applications-selected-${todayStamp()}.csv`, csv);
  };

  const runDelete = async () => {
    if (!confirmAction) return;
    setDeleting(true);
    setActionError("");
    try {
      if (confirmAction.type === "one") {
        await deleteApplication(confirmAction.id);
        setApplications((rows) => rows.filter((row) => row.id !== confirmAction.id));
        setSelectedIds((prev) => {
          const next = new Set(prev);
          next.delete(confirmAction.id);
          return next;
        });
      } else if (confirmAction.type === "selected") {
        const ids = [...selectedIds];
        await deleteApplications({ ids });
        setApplications((rows) => rows.filter((row) => !selectedIds.has(row.id)));
        setSelectedIds(new Set());
      } else if (confirmAction.type === "all") {
        await deleteApplications({ all: true });
        setApplications([]);
        setSelectedIds(new Set());
      }
      setConfirmAction(null);
    } catch (err) {
      if (err.status === 401) {
        await logout();
        navigate("/admin/login", { replace: true });
        return;
      }
      setActionError(err.message || "Unable to delete. Please try again.");
    } finally {
      setDeleting(false);
    }
  };

  const confirmCopy = {
    one: {
      title: "Delete this application?",
      message: "This permanently deletes this application. This cannot be undone.",
      confirmLabel: "Delete",
    },
    selected: {
      title: `Delete ${selectedIds.size} selected application${selectedIds.size === 1 ? "" : "s"}?`,
      message: "This permanently deletes the selected applications. This cannot be undone.",
      confirmLabel: "Delete Selected",
    },
    all: {
      title: `Delete all ${applications?.length ?? 0} applications?`,
      message:
        "This permanently deletes every submitted application, including any not currently selected. This cannot be undone.",
      confirmLabel: "Delete All",
    },
  }[confirmAction?.type];

  return (
    <div>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="font-heading text-2xl font-semibold text-slate">Submitted Applications</h1>
          <p className="mt-1 max-w-2xl text-sm text-slate/60">
            Everyone who has submitted the Apply page's application form, most recent first.
          </p>
        </div>

        {applications !== null && applications.length > 0 && (
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={exportAll}
              className="inline-flex items-center gap-1.5 rounded border border-oceanic/40 px-3 py-1.5 text-xs font-semibold text-oceanic hover:bg-oceanic hover:text-white"
            >
              <Icon name="download" className="h-3.5 w-3.5" />
              Export All
            </button>
            <button
              type="button"
              onClick={exportSelected}
              disabled={!someSelected}
              className="inline-flex items-center gap-1.5 rounded border border-oceanic/40 px-3 py-1.5 text-xs font-semibold text-oceanic hover:bg-oceanic hover:text-white disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:text-oceanic"
            >
              <Icon name="download" className="h-3.5 w-3.5" />
              Export Selected
            </button>
            <button
              type="button"
              onClick={() => setConfirmAction({ type: "all" })}
              className="inline-flex items-center gap-1.5 rounded border border-terracotta/40 px-3 py-1.5 text-xs font-semibold text-terracotta hover:bg-terracotta hover:text-white"
            >
              <Icon name="trash" className="h-3.5 w-3.5" />
              Delete All
            </button>
          </div>
        )}
      </div>

      {errorMessage && (
        <div className="mt-6">
          <ErrorState message={errorMessage} />
        </div>
      )}
      {actionError && (
        <div className="mt-4">
          <ErrorState message={actionError} />
        </div>
      )}

      {!errorMessage && applications === null && (
        <div className="mt-6">
          <LoadingState message="Loading applications..." />
        </div>
      )}

      {applications !== null && applications.length === 0 && (
        <p className="mt-6 text-sm text-slate/60">No applications have been submitted yet.</p>
      )}

      {applications !== null && applications.length > 0 && (
        <>
          {someSelected && (
            <div className="sticky top-0 z-10 mt-4 flex flex-wrap items-center gap-3 border border-oceanic/25 bg-oceanic/5 px-4 py-2.5 text-sm">
              <span className="font-medium text-oceanic">{selectedIds.size} selected</span>
              <button
                type="button"
                onClick={clearSelection}
                className="text-oceanic underline underline-offset-2 hover:text-oceanic-dark"
              >
                Clear selection
              </button>
              <button
                type="button"
                onClick={() => setConfirmAction({ type: "selected" })}
                className="ml-auto inline-flex items-center gap-1.5 rounded border border-terracotta/40 px-3 py-1.5 text-xs font-semibold text-terracotta hover:bg-terracotta hover:text-white"
              >
                <Icon name="trash" className="h-3.5 w-3.5" />
                Delete Selected
              </button>
            </div>
          )}

          <div className="mt-4 overflow-x-auto border border-slate/10 bg-white">
            <table className="w-full min-w-[860px] border-collapse text-left text-sm">
              <thead>
                <tr className="border-b border-slate/10 bg-sand/40 text-xs uppercase tracking-wide text-slate/50">
                  <th className="w-10 px-3 py-2.5">
                    <input
                      type="checkbox"
                      checked={allSelected}
                      onChange={toggleAll}
                      aria-label="Select all applications"
                      className="h-4 w-4 rounded border-slate/30 text-oceanic focus:ring-oceanic/40"
                    />
                  </th>
                  <th className="px-3 py-2.5 font-semibold">Applicant</th>
                  <th className="px-3 py-2.5 font-semibold">Contact</th>
                  <th className="px-3 py-2.5 font-semibold">City / Gender</th>
                  <th className="px-3 py-2.5 font-semibold">Status</th>
                  <th className="px-3 py-2.5 font-semibold">Submitted</th>
                  <th className="w-20 px-3 py-2.5 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {applications.map((app) => {
                  const isExpanded = expandedId === app.id;
                  const hasDetails = app.degreeInfo || app.teachingBackground || app.questions;
                  const statusMeta = getStatusMeta(app.status);
                  return (
                    <Fragment key={app.id}>
                      <tr
                        className={`border-b border-slate/10 ${selectedIds.has(app.id) ? "bg-oceanic/5" : "hover:bg-sand/30"}`}
                      >
                        <td className="px-3 py-2.5 align-top">
                          <input
                            type="checkbox"
                            checked={selectedIds.has(app.id)}
                            onChange={() => toggleOne(app.id)}
                            aria-label={`Select application from ${app.firstName} ${app.lastName}`}
                            className="h-4 w-4 rounded border-slate/30 text-oceanic focus:ring-oceanic/40"
                          />
                        </td>
                        <td className="px-3 py-2.5 align-top">
                          <button
                            type="button"
                            onClick={() => hasDetails && setExpandedId(isExpanded ? null : app.id)}
                            className={`flex items-center gap-1.5 text-left font-medium text-slate ${hasDetails ? "cursor-pointer" : "cursor-default"}`}
                          >
                            {hasDetails && (
                              <Icon
                                name="chevronDown"
                                className={`h-3.5 w-3.5 shrink-0 text-slate/40 transition-transform ${isExpanded ? "rotate-180" : ""}`}
                              />
                            )}
                            {[app.firstName, app.lastName].filter(Boolean).join(" ") || "(No name provided)"}
                          </button>
                        </td>
                        <td className="px-3 py-2.5 align-top text-slate/70">
                          <p className="break-all">{app.email}</p>
                          <p className="text-slate/50">{app.phone}</p>
                        </td>
                        <td className="px-3 py-2.5 align-top text-slate/70">
                          <p>{app.city}</p>
                          <p className="text-slate/50">{app.gender}</p>
                        </td>
                        <td className="px-3 py-2.5 align-top">
                          <select
                            value={app.status ?? "not_contacted"}
                            onChange={(e) => handleStatusChange(app.id, e.target.value)}
                            disabled={savingStatusId === app.id}
                            className={`rounded-full border px-2.5 py-1 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-oceanic/30 disabled:opacity-60 ${statusMeta.color}`}
                          >
                            {APPLICATION_STATUSES.map((s) => (
                              <option key={s.value} value={s.value}>
                                {s.label}
                              </option>
                            ))}
                          </select>
                        </td>
                        <td className="whitespace-nowrap px-3 py-2.5 align-top text-xs text-slate/50">
                          {formatDate(app.createdAt)}
                        </td>
                        <td className="px-3 py-2.5 align-top">
                          <button
                            type="button"
                            onClick={() => setConfirmAction({ type: "one", id: app.id })}
                            aria-label="Delete application"
                            className="rounded border border-terracotta/40 p-1.5 text-terracotta hover:bg-terracotta hover:text-white"
                          >
                            <Icon name="trash" className="h-3.5 w-3.5" />
                          </button>
                        </td>
                      </tr>
                      {isExpanded && hasDetails && (
                        <tr className="border-b border-slate/10 bg-sand/20">
                          <td />
                          <td colSpan={6} className="space-y-1.5 px-3 py-3 text-sm text-slate/70">
                            {app.degreeInfo && (
                              <p>
                                <span className="text-slate/50">Education: </span>
                                {app.degreeInfo}
                              </p>
                            )}
                            {app.teachingBackground && (
                              <p>
                                <span className="text-slate/50">Teaching background: </span>
                                {app.teachingBackground}
                              </p>
                            )}
                            {app.questions && (
                              <p>
                                <span className="text-slate/50">Questions: </span>
                                {app.questions}
                              </p>
                            )}
                          </td>
                        </tr>
                      )}
                    </Fragment>
                  );
                })}
              </tbody>
            </table>
          </div>
        </>
      )}

      <ConfirmDialog
        open={Boolean(confirmAction)}
        busy={deleting}
        onCancel={() => setConfirmAction(null)}
        onConfirm={runDelete}
        title={confirmCopy?.title}
        message={confirmCopy?.message}
        confirmLabel={confirmCopy?.confirmLabel}
      />
    </div>
  );
}
