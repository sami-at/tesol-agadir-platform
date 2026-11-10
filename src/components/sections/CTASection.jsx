import Button from "../common/Button";
import Icon from "../common/Icon";

/** Reusable call-to-action banner used at the bottom of several pages. */
export default function CTASection({ heading, subheading, buttonLabel = "Apply Now", to = "/apply" }) {
  return (
    <section className="bg-terracotta text-white">
      <div className="mx-auto max-w-3xl px-4 py-16 text-center sm:px-6">
        <h2 className="font-heading text-2xl font-semibold md:text-3xl">{heading}</h2>
        {subheading && <p className="mt-3 leading-relaxed text-white/85">{subheading}</p>}
        <div className="mt-8">
          <Button to={to} variant="light" size="lg">
            {buttonLabel}
            <Icon name="arrowRight" className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </section>
  );
}
