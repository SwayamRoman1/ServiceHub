import React from "react";

export const Button = ({
  variant = "primary",
  size = "md",
  loading = false,
  className = "",
  children,
  ...props
}) => {
  const base = "btn-" + variant;
  const sizeCls = size === "sm" ? " btn-sm" : size === "lg" ? " btn-lg" : "";
  const loadingCls = loading ? " btn-loading" : "";
  return (
    <button
      className={`${base}${sizeCls}${loadingCls} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export const Input = ({ className = "", ...props }) => (
  <input className={`input ${className}`} {...props} />
);

export const Textarea = ({ className = "", ...props }) => (
  <textarea className={`input ${className}`} {...props} />
);

export const Select = ({ className = "", children, ...props }) => (
  <select className={`input ${className}`} {...props}>
    {children}
  </select>
);

export const Field = ({ label, help, error, children }) => (
  <div className="field">
    {label && <label>{label}</label>}
    {children}
    {help && (
      <div className="muted" style={{ marginTop: 6 }}>
        {help}
      </div>
    )}
    {error && (
      <div style={{ color: "var(--danger)", fontWeight: 700, marginTop: 6 }}>
        {error}
      </div>
    )}
  </div>
);

export const Modal = ({ open, onClose, title, children, footer }) => {
  if (!open) return null;
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        {title && <h2 style={{ marginTop: 0 }}>{title}</h2>}
        {children}
        {footer && <div className="form-actions mt-3">{footer}</div>}
      </div>
    </div>
  );
};
