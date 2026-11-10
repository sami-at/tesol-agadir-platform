import Button from "../common/Button";
import Icon from "../common/Icon";

/** Home page hero banner with heading, subheading, and two CTAs. */
export default function Hero({ heading, subheading, image }) {
  return (
    <section className="relative overflow-hidden bg-oceanic text-white">
      {/* Subtle geometric accent, not a heavy gradient */}
      <div
        className="pointer-events-none absolute -right-24 -top-24 h-96 w-96 rounded-full bg-white/5"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -bottom-32 left-1/3 h-72 w-72 rounded-full bg-terracotta/10"
        aria-hidden="true"
      />

      <div className="relative mx-auto grid max-w-6xl items-center gap-14 px-4 py-20 sm:px-6 md:grid-cols-[1.1fr_0.9fr] md:py-28">
        <div>
          <p className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/25 px-3.5 py-1.5 text-xs font-semibold uppercase tracking-[0.12em] text-white/80">
            <Icon name="graduationCap" className="h-4 w-4 text-saffron" />
            120-Hour TESOL Certification
          </p>
          <h1 className="font-heading text-[2.1rem] font-semibold leading-[1.15] md:text-5xl">
            {heading}
          </h1>
          <p className="mt-5 max-w-lg text-[1.05rem] leading-relaxed text-white/80">
            {subheading}
          </p>
          <div className="mt-9 flex flex-wrap gap-4">
            <Button to="/apply" variant="secondary" size="lg">
              Start Application
              <Icon name="arrowRight" className="h-4 w-4" />
            </Button>
            <Button
              to="/tuition-dates"
              variant="outlineLight"
              size="lg"
            >
              View Program Dates
            </Button>
          </div>
        </div>

        <div className="relative">
          {image ? (
            <img
              src={image}
              alt=""
              className="aspect-[4/5] w-full max-w-sm border border-white/20 object-cover md:ml-auto"
            />
          ) : (
            <div
              className="flex aspect-[4/5] w-full max-w-sm items-center justify-center border border-white/20 bg-white/5 text-center md:ml-auto"
              aria-hidden="true"
            >
              <span className="px-6 text-sm font-medium text-white/50">
                Campus / Classroom Photography Placeholder
              </span>
            </div>
          )}
          <div className="absolute -bottom-5 -left-5 hidden max-w-[220px] border border-white/15 bg-oceanic-dark/95 px-5 py-4 shadow-xl backdrop-blur sm:block">
            <p className="font-heading text-2xl font-semibold text-saffron">98%</p>
            <p className="mt-0.5 text-xs text-white/70">Graduate placement rate</p>
          </div>
        </div>
      </div>
    </section>
  );
}
