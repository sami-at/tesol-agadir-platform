const LANGUAGES = [
  { code: "en", label: "EN" },
  { code: "fr", label: "FR" },
];

/**
 * Placeholder EN/FR switcher. Wired to i18next; full French copy is not
 * required yet, but switching updates i18n's active language.
 */
export default function LanguageSwitcher({ i18n }) {
  return (
    <div
      role="group"
      aria-label="Language switcher"
      className="flex items-center rounded-full border border-slate/15 p-0.5 text-xs font-semibold"
    >
      {LANGUAGES.map((lang) => (
        <button
          key={lang.code}
          type="button"
          onClick={() => i18n.changeLanguage(lang.code)}
          aria-pressed={i18n.language === lang.code}
          className={`rounded-full px-3 py-1 transition-colors ${
            i18n.language === lang.code
              ? "bg-oceanic text-white"
              : "text-slate/60 hover:text-oceanic"
          }`}
        >
          {lang.label}
        </button>
      ))}
    </div>
  );
}
