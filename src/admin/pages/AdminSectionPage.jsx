import { useEffect, useState } from "react";
import { useParams, Navigate, useNavigate } from "react-router-dom";
import { useContent } from "../../context/ContentContext";
import { useAuth } from "../../context/AuthContext";
import { findAdminSection } from "../adminSchema";
import { defaultContent } from "../../data/defaultContent";
import { getAtPath, setAtPath } from "../utils/contentPath";
import { validateContent } from "../utils/validateContent";
import DynamicFieldEditor from "../components/DynamicFieldEditor";
import LoadingState from "../../components/common/LoadingState";
import ErrorState from "../../components/common/ErrorState";
import SuccessMessage from "../../components/common/SuccessMessage";
import Button from "../../components/common/Button";

export default function AdminSectionPage() {
  const { sectionKey } = useParams();
  const section = findAdminSection(sectionKey);
  const { content, updateSection } = useContent();
  const { logout } = useAuth();
  const navigate = useNavigate();

  const [value, setValue] = useState(null);
  const [status, setStatus] = useState("idle"); // idle | saving | success | error
  const [errorMessage, setErrorMessage] = useState("");
  const [validationIssues, setValidationIssues] = useState([]);

  useEffect(() => {
    if (section && content) {
      // oxlint-disable-next-line react/set-state-in-effect -- re-derives the local editable copy when the route's section or the loaded content changes
      setValue(getAtPath(content, section.path));
      setStatus("idle");
      setValidationIssues([]);
    }
  }, [section, content]);

  if (!section) return <Navigate to="/admin" replace />;
  if (!content || value === null) {
    return <LoadingState message="Loading section..." />;
  }

  const originalValue = getAtPath(content, section.path);
  const isDirty = JSON.stringify(value) !== JSON.stringify(originalValue);

  const handleDiscard = () => {
    setValue(originalValue);
    setValidationIssues([]);
    setStatus("idle");
  };

  const handleResetToDefault = () => {
    setValue(getAtPath(defaultContent, section.path));
    setValidationIssues([]);
    setStatus("idle");
  };

  const handleSave = async () => {
    const issues = validateContent(value);
    if (issues.length > 0) {
      setValidationIssues(issues);
      setStatus("error");
      setErrorMessage("Please fix the highlighted issues before saving.");
      return;
    }

    setStatus("saving");
    setValidationIssues([]);
    try {
      const [topKey, ...rest] = section.path;
      const nextTopValue = setAtPath(content[topKey], rest, value);
      await updateSection(topKey, nextTopValue);
      setStatus("success");
    } catch (err) {
      if (err.status === 401) {
        await logout();
        navigate("/admin/login", { replace: true });
        return;
      }
      if (err.status === 422 && Array.isArray(err.issues)) {
        setValidationIssues(err.issues);
        setErrorMessage("The server rejected these changes.");
        setStatus("error");
        return;
      }
      setStatus("error");
      setErrorMessage(err.message || "Unable to save changes. Please try again.");
    }
  };

  return (
    <div className="max-w-3xl">
      <h1 className="font-heading text-2xl font-semibold text-slate">{section.label}</h1>
      <p className="mt-1 text-sm text-slate/60">{section.description}</p>

      {section.pageLabel && (
        <div className="mt-3 flex flex-wrap items-center gap-2 border border-oceanic/20 bg-oceanic/5 px-4 py-2.5 text-sm text-slate">
          <span aria-hidden="true">📍</span>
          <span>
            Appears on: <strong className="font-semibold">{section.pageLabel}</strong>
          </span>
          {section.page && (
            <a
              href={section.page}
              target="_blank"
              rel="noopener noreferrer"
              className="ml-auto font-semibold text-oceanic underline underline-offset-2 hover:text-oceanic-dark"
            >
              View this page ↗
            </a>
          )}
        </div>
      )}

      <div className="mt-6 border border-slate/10 bg-white p-6">
        <DynamicFieldEditor value={value} onChange={setValue} />
      </div>

      {validationIssues.length > 0 && (
        <div className="mt-4">
          <ErrorState
            message={`${errorMessage} ${validationIssues.join(" ")}`}
          />
        </div>
      )}
      {status === "error" && validationIssues.length === 0 && (
        <div className="mt-4">
          <ErrorState message={errorMessage} />
        </div>
      )}
      {status === "success" && (
        <div className="mt-4">
          <SuccessMessage message="Saved. The public website now reflects this change." />
        </div>
      )}

      <div className="sticky bottom-0 mt-6 flex flex-wrap items-center gap-3 border-t border-slate/10 bg-white/95 py-4 backdrop-blur">
        <Button onClick={handleSave} disabled={status === "saving" || !isDirty}>
          {status === "saving" ? "Saving..." : "Save Changes"}
        </Button>
        <Button variant="outline" onClick={handleDiscard} disabled={!isDirty || status === "saving"}>
          Discard Changes
        </Button>
        <Button variant="ghost" onClick={handleResetToDefault} disabled={status === "saving"}>
          Reset to Default
        </Button>
        {isDirty && status !== "saving" && (
          <span className="text-xs font-medium text-terracotta">Unsaved changes</span>
        )}
      </div>
    </div>
  );
}
