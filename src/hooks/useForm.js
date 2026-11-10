import { useCallback, useState } from "react";

/**
 * Generic form-handling hook: tracks values, validation errors, touched
 * fields, and submission status (idle/submitting/success/error). Designed to
 * be reused by any form (application, contact, etc.) regardless of backend.
 *
 * @param {object} options
 * @param {object} options.initialValues
 * @param {(values: object) => object} options.validate - returns an errors map
 * @param {(values: object) => Promise<any>} options.onSubmit
 */
export function useForm({ initialValues, validate, onSubmit }) {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [status, setStatus] = useState("idle"); // idle | submitting | success | error
  const [submitError, setSubmitError] = useState("");

  const handleChange = useCallback((name, value) => {
    setValues((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  }, []);

  const handleBlur = useCallback((name) => {
    setTouched((prev) => ({ ...prev, [name]: true }));
  }, []);

  const reset = useCallback(() => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
    setStatus("idle");
    setSubmitError("");
  }, [initialValues]);

  const handleSubmit = useCallback(
    async (event) => {
      if (event?.preventDefault) event.preventDefault();

      // Prevent duplicate submissions while a request is already in flight.
      if (status === "submitting") return;

      const validationErrors = validate ? validate(values) : {};
      setErrors(validationErrors);
      setTouched(
        Object.keys(values).reduce((acc, key) => ({ ...acc, [key]: true }), {})
      );

      const hasErrors = Object.values(validationErrors).some(Boolean);
      if (hasErrors) return;

      setStatus("submitting");
      setSubmitError("");

      try {
        await onSubmit(values);
        setStatus("success");
      } catch (error) {
        setStatus("error");
        setSubmitError(error?.message || "Something went wrong. Please try again.");
      }
    },
    [status, validate, values, onSubmit]
  );

  return {
    values,
    errors,
    touched,
    status,
    submitError,
    handleChange,
    handleBlur,
    handleSubmit,
    reset,
    isSubmitting: status === "submitting",
  };
}
