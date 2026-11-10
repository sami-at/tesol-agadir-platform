import Seo from "../../components/common/Seo";
import Section from "../../components/common/Section";
import ContactForm from "../../components/forms/ContactForm";
import Icon from "../../components/common/Icon";
import { useContent } from "../../context/ContentContext";

const CONTACT_ROWS = [
  { label: "Phone", key: "phone", icon: "phone" },
  { label: "WhatsApp", key: "whatsapp", icon: "phone" },
  { label: "Email", key: "email", icon: "mail" },
  { label: "Address", key: "address", icon: "mapPin" },
  { label: "Hours", key: "hours", icon: "clock" },
  { label: "Contact Person", key: "contactPerson", icon: "users" },
  { label: "Facebook", key: "facebook", icon: "globe" },
];

export default function Contact() {
  const { content } = useContent();
  const { contact } = content.siteContent;
  const { seoConfig } = content;

  return (
    <>
      <Seo title={seoConfig.contact.title} description={seoConfig.contact.description} />

      <Section eyebrow="Get In Touch" title="Contact Us">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2">
          <div>
            <dl className="space-y-5 border border-slate/10 bg-white p-6 text-sm">
              {CONTACT_ROWS.map((row) => (
                <div key={row.key} className="flex items-start gap-3">
                  <Icon name={row.icon} className="mt-0.5 h-4 w-4 shrink-0 text-terracotta" />
                  <div>
                    <dt className="font-semibold text-slate">{row.label}</dt>
                    <dd className="mt-0.5 text-slate/70">{contact[row.key]}</dd>
                  </div>
                </div>
              ))}
            </dl>

            <div
              className="mt-6 flex h-56 items-center justify-center border border-slate/10 bg-sand-dark/40 text-sm text-slate/50"
              role="img"
              aria-label="Map placeholder showing academy location"
            >
              Map Placeholder
            </div>
          </div>

          <div>
            <ContactForm />
          </div>
        </div>
      </Section>
    </>
  );
}
