import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useContent } from "../../context/ContentContext";
import Icon from "../common/Icon";

const QUICK_LINKS = [
  { to: "/about", key: "about" },
  { to: "/program", key: "program" },
  { to: "/practicum", key: "practicum" },
  { to: "/tuition-dates", key: "tuitionDates" },
  { to: "/apply", key: "apply" },
  { to: "/contact", key: "contact" },
];

export default function Footer() {
  const { t } = useTranslation();
  const { content } = useContent();
  const year = new Date().getFullYear();

  if (!content) return null;
  const { general, contact } = content.siteContent;

  return (
    <footer className="border-t border-white/10 bg-slate text-white">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-16 sm:px-6 md:grid-cols-12">
        <div className="md:col-span-5">
          <p className="font-heading text-xl font-semibold">{general.academyName}</p>
          <p className="mt-3 max-w-sm text-sm leading-relaxed text-white/60">
            {general.tagline}. A 120-hour TESOL certification combining rigorous
            coursework with real, observed classroom teaching practice.
          </p>
        </div>

        <div className="md:col-span-3">
          <p className="text-xs font-semibold uppercase tracking-[0.15em] text-white/40">
            {t("footer.quickLinks")}
          </p>
          <ul className="mt-4 space-y-2.5 text-sm text-white/70">
            {QUICK_LINKS.map((link) => (
              <li key={link.to}>
                <Link to={link.to} className="transition-colors hover:text-terracotta">
                  {t(`nav.${link.key}`)}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="md:col-span-4">
          <p className="text-xs font-semibold uppercase tracking-[0.15em] text-white/40">
            {t("footer.contactUs")}
          </p>
          <ul className="mt-4 space-y-3 text-sm text-white/70">
            <li className="flex items-center gap-2.5">
              <Icon name="phone" className="h-4 w-4 shrink-0 text-terracotta" />
              {contact.phone}
            </li>
            <li className="flex items-center gap-2.5">
              <Icon name="mail" className="h-4 w-4 shrink-0 text-terracotta" />
              {contact.email}
            </li>
            <li className="flex items-start gap-2.5">
              <Icon name="mapPin" className="mt-0.5 h-4 w-4 shrink-0 text-terracotta" />
              {contact.address}
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10 py-5 text-center text-xs text-white/40">
        © {year} {general.academyName}. {t("footer.rights")}
      </div>
    </footer>
  );
}
