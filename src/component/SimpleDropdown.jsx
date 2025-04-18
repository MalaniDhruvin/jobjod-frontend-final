"use client"
import { useState, useRef, useEffect } from "react"
import { ChevronDown } from "lucide-react"

export default function SimpleDropdown({
  label,
  placeholder,
  options,
  value,
  onChange
}) {
  const [showDropdown, setShowDropdown] = useState(false)
  const dropdownRef = useRef(null)

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = event => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown)
  }

  const handleSelect = option => {
    onChange(option)
    setShowDropdown(false)
  }

  return (
    <div className="mb-6">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
      )}
      <div className="relative" ref={dropdownRef}>
        <div
          className="flex justify-between items-center border-b border-gray-300 pb-2 cursor-pointer"
          onClick={toggleDropdown}
        >
          <span className="text-sm">
            {value || placeholder || "Select an option"}
          </span>
          <ChevronDown className="h-4 w-4 text-gray-400" />
        </div>
        {showDropdown && (
          <div className="absolute z-20 mt-1 w-full bg-white border border-gray-200 rounded-md shadow-lg">
            <ul className="py-1 max-h-60 overflow-auto">
              {options.map((option, index) => (
                <li
                  key={index}
                  className="px-4 py-2 text-sm hover:bg-gray-100 cursor-pointer"
                  onClick={() => handleSelect(option)}
                >
                  {option}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  )
}
