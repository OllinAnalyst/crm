import React from "react";

export function Input({ value, onChange, placeholder = "", className = "", ...rest }) {
  return (
    <input
      type="text"
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className={`border px-3 py-2 rounded-md w-full ${className}`}
      {...rest}
    />
  );
}
