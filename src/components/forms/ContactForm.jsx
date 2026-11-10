import { useForm } from "../../hooks/useForm";
import { submitContactMessage } from "../../services/contactService";
import { isRequired, isValidEmail } from "../../utils/validators";
import FormField from "./FormField";
import LoadingState from "../common/LoadingState";
import ErrorState from "../common/ErrorState";
import SuccessMessage from "../common/SuccessMessage";
import Button from "../common/Button";

const INITIAL_VALUES = { name: "", email: "", message: "" };

function validate(values) {
  const errors = {};
  if (!isRequired(values.name)) errors.name = "Name is required.";
  if (!isRequired(values.email)) errors.email = "Email address is required.";
  else if (!isValidEmail(values.email)) errors.email = "Enter a valid email address.";
  if (!isRequired(values.message)) errors.message = "Message is required.";
  return errors;
}

export default function ContactForm() {
  const {
    values,
    errors,
    touched,
    status,
    submitError,
    handleChange,
    handleBlur,
    handleSubmit,
    reset,
    isSubmitting,
  } = useForm({ initialValues: INITIAL_VALUES, validate, onSubmit: submitContactMessage });

  if (status === "success") {
    return (
      <div className="space-y-5 border border-slate/10 bg-white p-8">
        <SuccessMessage message="Thank you for reaching out. We'll get back to you soon." />
        <Button variant="outline" onClick={reset}>
          Send Another Message
        </Button>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      aria-busy={isSubmitting}
      className="space-y-5 border border-slate/10 bg-white p-6 sm:p-8"
    >
      <FormField
        id="name"
        label="Name"
        required
        value={values.name}
        onChange={(e) => handleChange("name", e.target.value)}
        onBlur={() => handleBlur("name")}
        error={touched.name ? errors.name : undefined}
        autoComplete="name"
      />

      <FormField
        id="email"
        label="Email"
        type="email"
        required
        value={values.email}
        onChange={(e) => handleChange("email", e.target.value)}
        onBlur={() => handleBlur("email")}
        error={touched.email ? errors.email : undefined}
        autoComplete="email"
      />

      <FormField
        id="message"
        label="Message"
        as="textarea"
        required
        value={values.message}
        onChange={(e) => handleChange("message", e.target.value)}
        onBlur={() => handleBlur("message")}
        error={touched.message ? errors.message : undefined}
      />

      {status === "error" && <ErrorState message={submitError} />}
      {isSubmitting && <LoadingState message="Sending your message..." />}

      <Button type="submit" size="lg" disabled={isSubmitting} className="w-full sm:w-auto">
        Send Message
      </Button>
    </form>
  );
}
