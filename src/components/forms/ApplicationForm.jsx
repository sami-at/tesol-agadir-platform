import { useForm } from "../../hooks/useForm";
import { submitApplication } from "../../services/applicationService";
import { isRequired, isValidEmail, isValidPhone } from "../../utils/validators";
import { useContent } from "../../context/ContentContext";
import FormField from "./FormField";
import Icon from "../common/Icon";
import LoadingState from "../common/LoadingState";
import ErrorState from "../common/ErrorState";
import Button from "../common/Button";

const INITIAL_VALUES = {
  firstName: "",
  lastName: "",
  email: "",
  gender: "",
  phone: "",
  city: "",
  degreeInfo: "",
  teachingBackground: "",
  questions: "",
};

function SectionHeader({ number, title, subtitle }) {
  return (
    <div className="mb-5 flex items-start gap-3.5">
      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-oceanic font-heading text-sm font-semibold text-white">
        {number}
      </span>
      <div>
        <h3 className="font-heading text-lg font-semibold text-slate">{title}</h3>
        <p className="mt-0.5 text-sm text-slate/55">{subtitle}</p>
      </div>
    </div>
  );
}

function validate(values) {
  const errors = {};

  if (!isRequired(values.email)) errors.email = "Email address is required.";
  else if (!isValidEmail(values.email)) errors.email = "Enter a valid email address.";
  if (!isRequired(values.gender)) errors.gender = "Please select your gender.";
  if (!isRequired(values.phone)) errors.phone = "Phone number is required.";
  else if (!isValidPhone(values.phone)) errors.phone = "Enter a valid phone number.";
  if (!isRequired(values.city)) errors.city = "City of residence is required.";

  return errors;
}

export default function ApplicationForm() {
  const { content } = useContent();
  const form = content.applicationForm;
  const sections = form.sections;
  const labels = form.fieldLabels;
  const genderOptions = [{ value: "", label: "Select an option" }, ...form.genderOptions];

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
  } = useForm({ initialValues: INITIAL_VALUES, validate, onSubmit: submitApplication });

  if (status === "success") {
    return (
      <div className="flex flex-col items-center gap-3 border border-slate/10 bg-white px-6 py-10 text-center sm:px-10">
        <span className="flex h-14 w-14 items-center justify-center rounded-full bg-oceanic/10">
          <Icon name="check" className="h-7 w-7 text-oceanic" strokeWidth={2} />
        </span>
        <h3 className="font-heading text-xl font-semibold text-slate">{form.successTitle}</h3>
        <p className="max-w-sm leading-relaxed text-slate/65">{form.successMessage}</p>
        <Button variant="outline" onClick={reset} className="mt-2">
          Submit Another Application
        </Button>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      aria-busy={isSubmitting}
      className="divide-y divide-slate/10 border border-slate/10 bg-white"
    >
      {/* Section 1: Personal Information */}
      <div className="p-5 sm:p-6">
        <SectionHeader number={1} {...sections[0]} />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FormField
            id="firstName"
            label={labels.firstName}
            value={values.firstName}
            onChange={(e) => handleChange("firstName", e.target.value)}
            onBlur={() => handleBlur("firstName")}
            autoComplete="given-name"
          />

          <FormField
            id="lastName"
            label={labels.lastName}
            value={values.lastName}
            onChange={(e) => handleChange("lastName", e.target.value)}
            onBlur={() => handleBlur("lastName")}
            autoComplete="family-name"
          />

          <FormField
            id="email"
            label={labels.email}
            type="email"
            required
            value={values.email}
            onChange={(e) => handleChange("email", e.target.value)}
            onBlur={() => handleBlur("email")}
            error={touched.email ? errors.email : undefined}
            autoComplete="email"
          />

          <FormField
            id="gender"
            label={labels.gender}
            as="select"
            required
            options={genderOptions}
            value={values.gender}
            onChange={(e) => handleChange("gender", e.target.value)}
            onBlur={() => handleBlur("gender")}
            error={touched.gender ? errors.gender : undefined}
          />

          <FormField
            id="phone"
            label={labels.phone}
            type="tel"
            required
            value={values.phone}
            onChange={(e) => handleChange("phone", e.target.value)}
            onBlur={() => handleBlur("phone")}
            error={touched.phone ? errors.phone : undefined}
            autoComplete="tel"
          />

          <FormField
            id="city"
            label={labels.city}
            required
            value={values.city}
            onChange={(e) => handleChange("city", e.target.value)}
            onBlur={() => handleBlur("city")}
            error={touched.city ? errors.city : undefined}
            autoComplete="address-level2"
          />
        </div>
      </div>

      {/* Section 2: Educational Background */}
      <div className="p-5 sm:p-6">
        <SectionHeader number={2} {...sections[1]} />
        <FormField
          id="degreeInfo"
          label={labels.degreeInfo}
          placeholder={labels.degreeInfoPlaceholder}
          value={values.degreeInfo}
          onChange={(e) => handleChange("degreeInfo", e.target.value)}
        />
      </div>

      {/* Section 3: Teaching Background */}
      <div className="p-5 sm:p-6">
        <SectionHeader number={3} {...sections[2]} />
        <FormField
          id="teachingBackground"
          label={labels.teachingBackground}
          value={values.teachingBackground}
          onChange={(e) => handleChange("teachingBackground", e.target.value)}
        />
      </div>

      {/* Section 4: Questions */}
      <div className="p-5 sm:p-6">
        <SectionHeader number={4} {...sections[3]} />
        <FormField
          id="questions"
          label={labels.questions}
          as="textarea"
          value={values.questions}
          onChange={(e) => handleChange("questions", e.target.value)}
          onBlur={() => handleBlur("questions")}
          error={touched.questions ? errors.questions : undefined}
        />
      </div>

      {/* Submission footer */}
      <div className="flex flex-col gap-3 bg-sand/40 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
        <p className="flex items-center gap-2 text-xs text-slate/55">
          <Icon name="shield" className="h-4 w-4 shrink-0 text-slate/40" />
          {form.confidentialityNote}
        </p>
        <Button type="submit" size="lg" disabled={isSubmitting} className="w-full sm:w-auto">
          {isSubmitting ? "Submitting..." : form.submitButtonLabel}
        </Button>
      </div>
      {status === "error" && (
        <div className="p-5 pt-0 sm:p-6 sm:pt-0">
          <ErrorState message={submitError} />
        </div>
      )}
      {isSubmitting && (
        <div className="p-5 pt-0 sm:p-6 sm:pt-0">
          <LoadingState message="Submitting your application..." />
        </div>
      )}
    </form>
  );
}


