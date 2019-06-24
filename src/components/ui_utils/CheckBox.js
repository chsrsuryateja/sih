import React from "react";

export const CheckBox = ({ input }) => {
  return (
    <div className="ui segment">
      <div className="required field">
        <div
          className="ui toggle checkbox"
          onClick={() => input.onChange(!input.value)}
        >
          <input
            type="checkbox"
            tabIndex={0}
            className="hidden"
            checked={input.value}
            onChange={() => {}}
          />
          <label>{input.value ? "ON Campus" : "OFF Campus"}</label>
        </div>
      </div>
    </div>
  );
};
