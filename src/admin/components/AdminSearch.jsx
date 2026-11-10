import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ADMIN_SECTIONS } from "../adminSchema";
import { useContent } from "../../context/ContentContext";
import { getAtPath } from "../utils/contentPath";
import Icon from "../../components/common/Icon";

// Extra jump targets that aren't in ADMIN_SECTIONS (e.g. the applications table).
const EXTRA_ITEMS = [
  {
    key: "applications",
    label: "Applications",
    group: "Apply",
    description: "The table of everyone who has submitted the Apply page's application form.",
    path: "/admin/applications",
  },
];

const ALL_ITEMS = [
  ...EXTRA_ITEMS,
  ...ADMIN_SECTIONS.map((section) => ({
    key: section.key,
    label: section.label,
    group: section.group,
    description: section.description,
    pageLabel: section.pageLabel,
    path: `/admin/${section.key}`,
  })),
];

function matchesLabel(item, query) {
  const haystack = `${item.label} ${item.group} ${item.description ?? ""} ${item.pageLabel ?? ""}`.toLowerCase();
  return query
    .toLowerCase()
    .split(/\s+/)
    .filter(Boolean)
    .every((word) => haystack.includes(word));
}

// Recursively walks any section's editable value (strings/arrays/objects) looking for
// the query, so a word copied straight off the public website can be traced back to
// exactly which admin field it lives in.
function collectTextMatches(value, query) {
  if (typeof value === "string") {
    return value.toLowerCase().includes(query) ? [value] : [];
  }
  if (Array.isArray(value)) {
    return value.flatMap((item) => collectTextMatches(item, query));
  }
  if (value && typeof value === "object") {
    return Object.values(value).flatMap((v) => collectTextMatches(v, query));
  }
  return [];
}

// Builds a highlighted excerpt around the first match, e.g. "...our TESOL [certificate]
// program is..." so the user can confirm it's the right field before opening it.
function buildSnippet(text, query) {
  const idx = text.toLowerCase().indexOf(query.toLowerCase());
  if (idx === -1) return null;
  const start = Math.max(0, idx - 30);
  const end = Math.min(text.length, idx + query.length + 30);
  return {
    pre: (start > 0 ? "…" : "") + text.slice(start, idx),
    match: text.slice(idx, idx + query.length),
    post: text.slice(idx + query.length, end) + (end < text.length ? "…" : ""),
  };
}

/**
 * Global search opened from the admin top bar or Ctrl/Cmd+K.
 * Matches both section names AND the actual text stored in every field, so
 * pasting a word/phrase copied from the public site finds every place it appears.
 */
export default function AdminSearch() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const [prevQuery, setPrevQuery] = useState(query);
  const inputRef = useRef(null);
  const navigate = useNavigate();
  const { content } = useContent();

  const results = useMemo(() => {
    const q = query.trim();
    if (!q) return ALL_ITEMS.slice(0, 8).map((item) => ({ item, snippet: null, matchCount: 0 }));

    const byKey = new Map();
    for (const item of ALL_ITEMS) {
      if (matchesLabel(item, q)) byKey.set(item.key, { item, snippet: null, matchCount: 0 });
    }

    if (content) {
      const qLower = q.toLowerCase();
      for (const section of ADMIN_SECTIONS) {
        const sectionValue = getAtPath(content, section.path);
        const textMatches = collectTextMatches(sectionValue, qLower);
        if (textMatches.length === 0) continue;

        const item = ALL_ITEMS.find((i) => i.key === section.key);
        const existing = byKey.get(section.key);
        const snippet = buildSnippet(textMatches[0], qLower);
        byKey.set(section.key, {
          item: existing?.item ?? item,
          snippet,
          matchCount: textMatches.length,
        });
      }
    }

    // Show sections with real content matches first (most relevant to a copy-pasted word).
    return [...byKey.values()].sort((a, b) => b.matchCount - a.matchCount).slice(0, 20);
  }, [query, content]);

  // Reset the highlighted result whenever the query changes (adjusting state during render, no effect needed).
  if (query !== prevQuery) {
    setPrevQuery(query);
    setActiveIndex(0);
  }

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  useEffect(() => {
    const handleGlobalKeyDown = (e) => {
      const isShortcut = (e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k";
      if (isShortcut) {
        e.preventDefault();
        setOpen(true);
      }
    };
    window.addEventListener("keydown", handleGlobalKeyDown);
    return () => window.removeEventListener("keydown", handleGlobalKeyDown);
  }, []);

  const close = () => {
    setOpen(false);
    setQuery("");
  };

  const goTo = (result) => {
    if (!result) return;
    navigate(result.item.path);
    close();
  };

  const handleKeyDown = (e) => {
    if (e.key === "Escape") {
      close();
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => Math.min(i + 1, results.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      goTo(results[activeIndex]);
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 rounded border border-slate/20 px-3 py-1.5 text-sm text-slate/60 hover:border-oceanic/40 hover:text-oceanic"
      >
        <Icon name="search" className="h-4 w-4" />
        <span className="hidden sm:inline">Search pages & content...</span>
        <kbd className="hidden rounded border border-slate/20 px-1.5 py-0.5 text-[0.65rem] text-slate/40 sm:inline">
          ⌘K
        </kbd>
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-start justify-center bg-slate/40 px-4 pt-24"
          role="dialog"
          aria-modal="true"
          onClick={close}
        >
          <div
            className="w-full max-w-lg overflow-hidden rounded border border-slate/10 bg-white shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-2 border-b border-slate/10 px-4 py-3">
              <Icon name="search" className="h-4 w-4 shrink-0 text-slate/40" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Paste a word from the website, or a page name..."
                className="w-full text-sm text-slate placeholder:text-slate/40 focus:outline-none"
              />
            </div>
            <ul className="max-h-96 overflow-y-auto py-1.5">
              {results.length === 0 && (
                <li className="px-4 py-3 text-sm text-slate/50">Nothing found for "{query}".</li>
              )}
              {results.map((result, index) => (
                <li key={result.item.key}>
                  <button
                    type="button"
                    onClick={() => goTo(result)}
                    onMouseEnter={() => setActiveIndex(index)}
                    className={`flex w-full flex-col gap-0.5 px-4 py-2 text-left ${
                      index === activeIndex ? "bg-oceanic/8" : ""
                    }`}
                  >
                    <span className="flex items-center gap-2 text-sm font-medium text-slate">
                      {result.item.label}
                      <span className="rounded-full bg-sand px-2 py-0.5 text-[0.65rem] font-normal text-slate/50">
                        {result.item.group}
                      </span>
                      {result.matchCount > 1 && (
                        <span className="rounded-full bg-oceanic/10 px-2 py-0.5 text-[0.65rem] font-normal text-oceanic">
                          {result.matchCount} matches
                        </span>
                      )}
                    </span>
                    {result.snippet ? (
                      <span className="truncate text-xs text-slate/60">
                        {result.snippet.pre}
                        <mark className="rounded bg-terracotta/20 px-0.5 text-terracotta-dark">
                          {result.snippet.match}
                        </mark>
                        {result.snippet.post}
                      </span>
                    ) : (
                      result.item.description && (
                        <span className="truncate text-xs text-slate/50">{result.item.description}</span>
                      )
                    )}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </>
  );
}

