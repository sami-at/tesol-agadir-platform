import { useState } from "react";
import { NavLink } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Button from "../common/Button";
import LanguageSwitcher from "./LanguageSwitcher";

const NAV_ITEMS = [
  { to: "/", key: "home" },
  { to: "/about", key: "about" },
  { to: "/program", key: "program" },
  { to: "/practicum", key: "practicum" },
  { to: "/tuition-dates", key: "tuitionDates" },
  { to: "/contact", key: "contact" },
];

export default function Header() {
  const { t, i18n } = useTranslation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navLinkClass = ({ isActive }) =>
    `relative py-1 text-[0.925rem] font-medium transition-colors ${
      isActive ? "text-oceanic" : "text-slate/70 hover:text-oceanic"
    } after:absolute after:-bottom-1 after:left-0 after:h-0.5 after:bg-terracotta after:transition-all ${
      isActive ? "after:w-full" : "after:w-0"
    }`;

  return (
    <header className="sticky top-0 z-40 border-b border-slate/10 bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3.5 sm:px-6">
        <NavLink to="/" className="flex flex-col leading-none">
          <span className="font-heading text-lg font-semibold text-oceanic">
            American TESOL Academy
          </span>
          <span className="mt-0.5 text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-terracotta">
            Agadir
          </span>
        </NavLink>

        {/* Desktop navigation */}
        <nav className="hidden items-center gap-7 lg:flex" aria-label="Primary">
          {NAV_ITEMS.map((item) => (
            <NavLink key={item.to} to={item.to} end={item.to === "/"} className={navLinkClass}>
              {t(`nav.${item.key}`)}
            </NavLink>
          ))}
        </nav>

        <div className="hidden items-center gap-5 lg:flex">
          <LanguageSwitcher i18n={i18n} />
          <span className="h-5 w-px bg-slate/15" aria-hidden="true" />
          <Button to="/apply" variant="secondary" size="sm">
            {t("nav.apply")}
          </Button>
        </div>

        {/* Mobile menu toggle */}
        <button
          type="button"
          className="inline-flex items-center justify-center rounded p-2 text-slate lg:hidden"
          aria-expanded={isMenuOpen}
          aria-controls="mobile-nav"
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          onClick={() => setIsMenuOpen((open) => !open)}
        >
          <span className="sr-only">{isMenuOpen ? "Close menu" : "Open menu"}</span>
          {isMenuOpen ? (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          ) : (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          )}
        </button>
      </div>

      {/* Mobile navigation */}
      {isMenuOpen && (
        <nav
          id="mobile-nav"
          aria-label="Primary mobile"
          className="border-t border-slate/10 bg-white px-4 py-5 lg:hidden"
        >
          <ul className="flex flex-col divide-y divide-slate/8">
            {NAV_ITEMS.map((item) => (
              <li key={item.to}>
                <NavLink
                  to={item.to}
                  end={item.to === "/"}
                  className={({ isActive }) =>
                    `block py-3 text-base font-medium ${isActive ? "text-oceanic" : "text-slate/80"}`
                  }
                  onClick={() => setIsMenuOpen(false)}
                >
                  {t(`nav.${item.key}`)}
                </NavLink>
              </li>
            ))}
          </ul>
          <div className="mt-5 flex items-center justify-between gap-4">
            <LanguageSwitcher i18n={i18n} />
            <Button to="/apply" variant="secondary" size="sm" onClick={() => setIsMenuOpen(false)}>
              {t("nav.apply")}
            </Button>
          </div>
        </nav>
      )}
    </header>
  );
}
