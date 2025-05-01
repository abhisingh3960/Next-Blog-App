import React from "react";

const TextArea = ({ rows, value, onChange, name, label, placeholder }) => {
  return (
    <div className="space-y-2">
      <label htmlFor={name} className="block text-sm font-medium text-gray-700">
        {label}
      </label>
      <textarea
        id={name}
        rows={rows}
        value={value}
        onChange={onChange}
        name={name}
        placeholder={placeholder}
        className="w-full p-3 rounded-md border border-gray-300 bg-gray-50 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
      />
    </div>
  );
};

export default TextArea;
