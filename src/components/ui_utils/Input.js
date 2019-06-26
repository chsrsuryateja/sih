import React from "react";

const renderError = ({ error, touched }) => {
  if (touched && error) {
    return true;
  }
  return false;
};

export const Input = ({
  input,
  placeholder,
  type,
  required,
  label,
  customProps,
  meta
}) => {
  const showError = renderError(meta);
  return (
    <div
      className={`${required ? "required" : ""} field ${
        showError ? "error" : ""
      } `}
    >
      <label>{label}</label>
      <input
        {...input}
        {...customProps}
        type={type}
        placeholder={placeholder}
        autoComplete="off"
        autoCorrect="off"
        spellCheck="off"
      />
      <div style={{ display: showError ? "" : "none" }}>{meta.error}</div>
    </div>
  );
};

export const IconInput = ({
  input,
  placeholder,
  type,
  required,
  label,
  iconName,
  customProps,
  meta,
}) => {
  const showError = renderError(meta);
  return (
    <div
      className={`${required ? "required" : ""} field ${
        showError ? "error" : ""
      } `}
    >
      <label>{label}</label>
      <div className="ui left icon input">
        <input
          {...input}
          {...customProps}
          type={type}
          placeholder={placeholder}
          autoComplete="off"
          autoCorrect="off"
          spellCheck="off"
        />
        <i className={`${iconName} icon`} />
      </div>
      <div style={{ display: showError ? "" : "none" }}>{meta.error}</div>
    </div>
  );
};

export const ActionInput = ({
  input,
  placeholder,
  type,
  required,
  label,
  meta,
  children
}) => {
  const showError = renderError(meta);
  return(
    <div className={`${required ? "required" : ""} field ${
      showError ? "error" : ""
    } `}>
    <label>{label}</label>
    <div className="ui right labeled input">
      <input
        type={type}
        {...input}
        placeholder={placeholder}
      />
        {children}
    </div>
    <div style={{ display: showError ? "" : "none" }}>{meta.error}</div>
  </div>
  );

}
