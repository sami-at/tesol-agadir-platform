import { Link } from "react-router-dom";
import { isSafeUrl } from "../../utils/validators";

const VARIANT_CLASSES = {
  primary: "bg-oceanic text-white hover:bg-oceanic-dark active:bg-oceanic-dark",
  secondary: "bg-terracotta text-white hover:bg-terracotta-dark active:bg-terracotta-dark",
  outline:
    "border-2 border-oceanic text-oceanic bg-transparent hover:bg-oceanic hover:text-white",
  outlineLight:
    "border-2 border-white/50 text-white bg-transparent hover:bg-white hover:text-oceanic",
  ghost: "text-oceanic hover:bg-oceanic/8",
  light: "bg-white text-terracotta hover:bg-sand",
};

const SIZE_CLASSES = {
  md: "px-6 py-3 text-[0.95rem]",
  lg: "px-8 py-4 text-base",
  sm: "px-4 py-2 text-sm",
};

/**
 * Reusable button that renders as a <Link> when `to` is provided,
 * otherwise as a native <button>.
 */
export default function Button({
  to,
  href,
  variant = "primary",
  size = "md",
  type = "button",
  className = "",
  children,
  ...rest
}) {
  const classes = `inline-flex items-center justify-center gap-2 rounded font-semibold tracking-tight transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed ${SIZE_CLASSES[size]} ${VARIANT_CLASSES[variant]} ${className}`;

  if (to) {
    return (
      <Link to={to} className={classes} {...rest}>
        {children}
      </Link>
    );
  }

  // Plain anchor for external links or file downloads (not an internal route).
  // Renders as a disabled-looking button if the URL isn't safe to navigate to
  // (e.g. "javascript:"/"data:" — only relative paths and http(s) are allowed).
  if (href) {
    if (!isSafeUrl(href)) {
      return (
        <button type="button" className={classes} disabled aria-disabled="true">
          {children}
        </button>
      );
    }
    return (
      <a href={href} className={classes} {...rest}>
        {children}
      </a>
    );
  }

  return (
    <button type={type} className={classes} {...rest}>
      {children}
    </button>
  );
}
