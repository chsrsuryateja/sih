import React from "react";

const renderError = ({ error, touched }) => {
  if (touched && error) {
    return true;
  }
  return false;
};

export const Select = ({ children, input, required, label, meta }) => {
  const showError = renderError(meta);
  return (
    <div
      className={`${required ? "required" : ""} field ${
        showError ? "error" : ""
      }`}
    >
      <label>{label}</label>
      <select {...input}>{children}</select>
      <div style={{ display: showError ? "" : "none" }}>{meta.error}</div>
    </div>
  );
};

export const ActionSelect = ({
  children,
  input,
  required,
  label,
  meta,
  iconName,
  buttonText,
  onButtonClick
}) => {
  const showError = renderError(meta);
  return (
    <div
      className={`${required ? "required" : ""} field ${
        showError ? "error" : ""
      }`}
    >
      <label>
        <i className={`${iconName} icon`} />
        {label}
      </label>
      <div className="ui fluid action input">
        <select {...input}>{children}</select>
        <button className="ui secondary button" onClick={() => onButtonClick(input.value)}>
          {buttonText}
        </button>
      </div>
    </div>
  );
};
