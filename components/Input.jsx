import React from 'react'

const Input = ({ type, value, onChange, label, name, placeholder }) => {
  return (
    <div className="space-y-2">
      <label className="text-gray-700 font-medium">{label}</label>
      <input 
        type={type}
        value={value}
        onChange={onChange}
        name={name}
        placeholder={placeholder}
        className="w-full p-3 border-2 border-blue-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
      />
    </div>
  )
}

export default Input
