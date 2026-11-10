import { useState } from "react";

function humanize(key) {
  const spaced = key
    .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
    .replace(/[-_]/g, " ");
  return spaced.charAt(0).toUpperCase() + spaced.slice(1);
}

function generateId() {
  return `item-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

/** Picks a short human-friendly summary for a collapsed array item's card header. */
function summarizeItem(item, index) {
  if (typeof item === "string") return item || `Item ${index + 1}`;
  if (item && typeof item === "object") {
    const preferredKeys = ["name", "title", "label", "question"];
    for (const key of preferredKeys) {
      if (typeof item[key] === "string" && item[key].trim()) return item[key];
    }
    const firstString = Object.values(item).find((v) => typeof v === "string" && v.trim());
    if (firstString) return firstString;
  }
  return `Item ${index + 1}`;
}

/** Produces a blank version of `value`'s shape, used as a template for new array items. */
function blankClone(value) {
  if (typeof value === "string") return "";
  if (typeof value === "number") return 0;
  if (typeof value === "boolean") return false;
  if (Array.isArray(value)) return [];
  if (value && typeof value === "object") {
    const out = {};
    for (const key of Object.keys(value)) {
      out[key] = key === "id" ? generateId() : blankClone(value[key]);
    }
    return out;
  }
  return "";
}

const LONG_TEXT_PATTERN = /description|summary|overview|bio|mission|intro|campus|quote|subheading|note|address/i;

const fieldClasses =
  "w-full rounded border border-slate/20 bg-white px-3 py-2 text-sm text-slate transition-colors focus:border-oceanic focus:outline-none focus:ring-2 focus:ring-oceanic/25";

/**
 * Recursively renders an editable form for an arbitrary JSON-like value
 * (string/number/boolean/array/object), calling `onChange` with the updated
 * value on every edit. This lets the admin dashboard edit any content
 * section without a bespoke form per section.
 */
export default function DynamicFieldEditor({ value, onChange, label }) {
  // Collapsed-by-default cards keep long lists (faculty, testimonials, etc.) scannable
  // without scrolling through every field of every item at once. Declared unconditionally
  // since Hooks can't be called only inside the `Array.isArray` branch below.
  const [collapsed, setCollapsed] = useState(() =>
    Array.isArray(value) ? new Set(value.map((_, i) => i)) : new Set()
  );

  if (Array.isArray(value)) {
    const itemsAreObjects = value.length > 0 && typeof value[0] === "object" && value[0] !== null;

    const updateAt = (index, itemValue) => {
      const next = [...value];
      next[index] = itemValue;
      onChange(next);
    };
    const removeAt = (index) => {
      onChange(value.filter((_, i) => i !== index));
      setCollapsed((prev) => {
        const next = new Set();
        prev.forEach((i) => {
          if (i < index) next.add(i);
          else if (i > index) next.add(i - 1);
        });
        return next;
      });
    };
    const addItem = () => {
      const template = value.length > 0 ? blankClone(value[0]) : itemsAreObjects ? {} : "";
      onChange([...value, template]);
      // Newly added items are left out of the collapsed set, so they open automatically.
    };
    const toggle = (index) => {
      setCollapsed((prev) => {
        const next = new Set(prev);
        if (next.has(index)) next.delete(index);
        else next.add(index);
        return next;
      });
    };

    if (!itemsAreObjects) {
      // Simple string/number lists (tags, options) stay flat — no need to collapse.
      return (
        <div>
          {label && <p className="mb-2 text-sm font-semibold text-slate">{label}</p>}
          <div className="space-y-2">
            {value.map((item, index) => (
              <div
                // eslint-disable-next-line react/no-array-index-key
                key={index}
                className="flex items-center gap-2"
              >
                <input
                  type="text"
                  className={fieldClasses}
                  value={item}
                  onChange={(e) => updateAt(index, e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => removeAt(index)}
                  className="shrink-0 rounded border border-terracotta/40 px-2.5 py-1 text-xs font-semibold text-terracotta hover:bg-terracotta hover:text-white"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
          <button
            type="button"
            onClick={addItem}
            className="mt-3 rounded border border-oceanic/40 px-3 py-1.5 text-xs font-semibold text-oceanic hover:bg-oceanic hover:text-white"
          >
            + Add Item
          </button>
        </div>
      );
    }

    return (
      <div>
        {label && (
          <p className="mb-2 text-sm font-semibold text-slate">
            {label} <span className="font-normal text-slate/40">({value.length})</span>
          </p>
        )}
        <div className="space-y-2">
          {value.map((item, index) => {
            const isOpen = !collapsed.has(index);
            return (
              <div
                // eslint-disable-next-line react/no-array-index-key
                key={item?.id ?? index}
                className="rounded border border-slate/15 bg-sand/30"
              >
                <div className="flex items-center gap-2 px-3 py-2">
                  <button
                    type="button"
                    onClick={() => toggle(index)}
                    className="flex flex-1 items-center gap-2 text-left"
                    aria-expanded={isOpen}
                  >
                    <span className="text-xs text-slate/50" aria-hidden="true">
                      {isOpen ? "▾" : "▸"}
                    </span>
                    <span className="text-xs font-semibold text-slate/40">#{index + 1}</span>
                    <span className="truncate text-sm font-medium text-slate">
                      {summarizeItem(item, index)}
                    </span>
                  </button>
                  <button
                    type="button"
                    onClick={() => removeAt(index)}
                    className="shrink-0 rounded border border-terracotta/40 px-2.5 py-1 text-xs font-semibold text-terracotta hover:bg-terracotta hover:text-white"
                  >
                    Remove
                  </button>
                </div>
                {isOpen && (
                  <div className="border-t border-slate/10 bg-white p-3">
                    <DynamicFieldEditor value={item} onChange={(v) => updateAt(index, v)} />
                  </div>
                )}
              </div>
            );
          })}
        </div>
        <button
          type="button"
          onClick={addItem}
          className="mt-3 rounded border border-oceanic/40 px-3 py-1.5 text-xs font-semibold text-oceanic hover:bg-oceanic hover:text-white"
        >
          + Add Item
        </button>
      </div>
    );
  }

  if (value && typeof value === "object") {
    const keys = Object.keys(value).filter((key) => key !== "id");

    const updateKey = (key, keyValue) => {
      onChange({ ...value, [key]: keyValue });
    };

    const isShortField = (key, fieldValue) => {
      if (Array.isArray(fieldValue) || (fieldValue && typeof fieldValue === "object")) return false;
      if (typeof fieldValue === "boolean") return false;
      return !(LONG_TEXT_PATTERN.test(key) || String(fieldValue).length > 80);
    };

    const shortKeys = keys.filter((key) => isShortField(key, value[key]));
    const booleanKeys = keys.filter((key) => typeof value[key] === "boolean");
    const longKeys = keys.filter(
      (key) => !isShortField(key, value[key]) && typeof value[key] !== "boolean" &&
        !(Array.isArray(value[key]) || (value[key] && typeof value[key] === "object"))
    );
    const complexKeys = keys.filter(
      (key) => Array.isArray(value[key]) || (value[key] && typeof value[key] === "object")
    );

    const renderShortField = (key) => {
      const fieldValue = value[key];
      return (
        <div key={key}>
          <label className="mb-1.5 block text-sm font-medium text-slate">{humanize(key)}</label>
          <input
            type={typeof fieldValue === "number" ? "number" : "text"}
            className={fieldClasses}
            value={fieldValue ?? ""}
            onChange={(e) =>
              updateKey(key, typeof fieldValue === "number" ? Number(e.target.value) : e.target.value)
            }
          />
        </div>
      );
    };

    return (
      <div className="space-y-4">
        {shortKeys.length > 0 && (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">{shortKeys.map(renderShortField)}</div>
        )}
        {booleanKeys.length > 0 && (
          <div className="flex flex-wrap gap-x-6 gap-y-2">
            {booleanKeys.map((key) => (
              <label key={key} className="flex items-center gap-2 text-sm font-medium text-slate">
                <input
                  type="checkbox"
                  checked={value[key]}
                  onChange={(e) => updateKey(key, e.target.checked)}
                  className="h-4 w-4 rounded border-slate/30 text-oceanic focus:ring-oceanic/40"
                />
                {humanize(key)}
              </label>
            ))}
          </div>
        )}
        {longKeys.map((key) => (
          <div key={key}>
            <label className="mb-1.5 block text-sm font-medium text-slate">{humanize(key)}</label>
            <textarea
              rows={3}
              className={fieldClasses}
              value={value[key] ?? ""}
              onChange={(e) => updateKey(key, e.target.value)}
            />
          </div>
        ))}
        {complexKeys.map((key) => (
          <div key={key} className="rounded border border-slate/10 bg-white p-4">
            <DynamicFieldEditor value={value[key]} onChange={(v) => updateKey(key, v)} label={humanize(key)} />
          </div>
        ))}
      </div>
    );
  }

  // Primitive top-level value (e.g. a single string section like syllabusUrl).
  return (
    <div>
      {label && <label className="mb-1.5 block text-sm font-medium text-slate">{label}</label>}
      <input
        type="text"
        className={fieldClasses}
        value={value ?? ""}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}
