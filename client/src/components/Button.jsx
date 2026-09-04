// src/components/Button.jsx
// Reusable button with variant support

/**
 * @param {'primary'|'secondary'|'ghost'|'danger'} variant
 * @param {boolean} loading  - Shows a spinner and disables the button
 */
const Button = ({
  children,
  variant = 'primary',
  loading = false,
  className = '',
  ...props
}) => {
  return (
    <button
      className={`btn btn--${variant} ${className}`.trim()}
      disabled={loading || props.disabled}
      {...props}
    >
      {loading ? <span className="btn__spinner" aria-hidden="true" /> : children}
    </button>
  );
};

export default Button;
