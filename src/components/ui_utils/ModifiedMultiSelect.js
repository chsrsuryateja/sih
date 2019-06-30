import React from "react";
import { Multiselect } from "../Multiselect/MultiSelect";

const renderError = ({ error, touched }) => {
  if (touched && error) {
    return true;
  }
  return false;
};

export const ModifiedMultiSelect = ({
  input,
  placeholder,
  required,
  label,
  meta,
  data
}) => {
  const showError = renderError(meta);
  return (
    <div
      className={`${required ? "required" : ""} field ${
        showError ? "error" : ""
      } `}
     
    >
      <label>{label}</label>
      <Multiselect
       {...input}
        options={data}
        onSelectOptions={res => input.onChange(res)}
      />
      <div style={{ display: showError ? "" : "none" }}>{meta.error}</div>
    </div>
  );
};
