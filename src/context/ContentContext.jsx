import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { getContent, updateSection as updateSectionRequest, resetSection as resetSectionRequest } from "../services/contentService";

const ContentContext = createContext(null);

/**
 * Loads site content once (from the backend content API) and makes it
 * available to the whole app — both the public pages and the admin
 * dashboard read/write through this same context, so admin edits are
 * reflected immediately without a page reload.
 */
export function ContentProvider({ children }) {
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const data = await getContent();
      setContent(data);
    } catch {
      setError("Unable to load site content. Please refresh the page.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // oxlint-disable-next-line react/set-state-in-effect -- fetches content from the backend API on mount
    load();
  }, [load]);

  const updateSection = useCallback(async (sectionKey, value) => {
    const next = await updateSectionRequest(sectionKey, value);
    setContent(next);
    return next;
  }, []);

  const resetSection = useCallback(async (sectionKey) => {
    const next = await resetSectionRequest(sectionKey);
    setContent(next);
    return next;
  }, []);

  return (
    <ContentContext.Provider value={{ content, loading, error, updateSection, resetSection, refresh: load }}>
      {children}
    </ContentContext.Provider>
  );
}

/** Access shared site content: { content, loading, error, updateSection, resetSection, refresh }. */
// oxlint-disable-next-line react/only-export-components -- hook is intentionally co-located with its provider
export function useContent() {
  const ctx = useContext(ContentContext);
  if (!ctx) throw new Error("useContent must be used within a ContentProvider");
  return ctx;
}
