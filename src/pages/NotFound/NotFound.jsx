import Section from "../../components/common/Section";
import Button from "../../components/common/Button";
import Seo from "../../components/common/Seo";

export default function NotFound() {
  return (
    <>
      <Seo title="Page Not Found | American TESOL Academy Agadir" />
      <Section eyebrow="404" title="Page Not Found" subtitle="The page you're looking for doesn't exist.">
        <div className="text-center">
          <Button to="/">Back to Home</Button>
        </div>
      </Section>
    </>
  );
}
