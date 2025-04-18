"use client"
import { useState, useEffect, useRef } from "react"
import { ChevronDown, ChevronUp, Check, Plus, Search, X } from "lucide-react"

export default function SearchableDropdown({
  label,
  placeholder = "Search...",
  options,
  value,
  onChange,
  allowAddNew = false,
  groupBy = null,
  allowDirectEdit = false,
}) {
  const [searchQuery, setSearchQuery] = useState("")
  const [showDropdown, setShowDropdown] = useState(false)
  const [filteredOptions, setFilteredOptions] = useState(options)
  const [groupedOptions, setGroupedOptions] = useState({})
  const dropdownRef = useRef(null)
  const inputRef = useRef(null)
  const [isEditing, setIsEditing] = useState(false)

  // Filter and group options based on search query
  useEffect(() => {
    if (Array.isArray(options)) {
      let filtered = options

      if (searchQuery) {
        // Check if options are objects with label property or simple strings
        if (typeof options[0] === "object" && options[0]?.label) {
          filtered = options.filter((option) => option.label.toLowerCase().includes(searchQuery.toLowerCase()))
        } else {
          filtered = options.filter((option) => option.toLowerCase().includes(searchQuery.toLowerCase()))
        }
      }

      setFilteredOptions(filtered)

      // Group options if groupBy is provided
      if (groupBy && filtered.length > 0 && typeof filtered[0] === "object") {
        const grouped = filtered.reduce((acc, option) => {
          const groupName = option[groupBy] || "Other"
          if (!acc[groupName]) {
            acc[groupName] = []
          }
          acc[groupName].push(option)
          return acc
        }, {})
        setGroupedOptions(grouped)
      }
    }
  }, [searchQuery, options, groupBy])

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  const handleAddNewOption = () => {
    if (!searchQuery.trim()) return

    // Create new option based on the format of existing options
    let newOption
    if (typeof options[0] === "object" && options[0]?.label) {
      newOption = {
        value: searchQuery.toLowerCase().replace(/\s+/g, "-"),
        label: searchQuery,
        group: "Custom",
      }
    } else {
      newOption = searchQuery
    }

    // Call onChange with the new option
    onChange(newOption)
    setSearchQuery("")
    setShowDropdown(false)
  }

  const getDisplayValue = () => {
    if (!value) return ""

    if (typeof value === "object" && value?.label) {
      return value.label
    }

    return value
  }

  const handleSelectOption = (option) => {
    onChange(option)
    setSearchQuery("")
    setShowDropdown(false)
  }

  const isOptionSelected = (option) => {
    if (typeof option === "object" && option?.value) {
      return typeof value === "object" ? option.value === value.value : option.value === value
    }
    return option === value
  }

  return (
    <div className="mb-6">
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <div className="relative" ref={dropdownRef}>
        <div className="flex items-center border-b border-gray-300 pb-2">
          {!searchQuery && getDisplayValue() && !isEditing ? (
            <div className="flex items-center w-full">
              <div
                className="flex-1 text-gray-900 font-medium cursor-pointer"
                onClick={() => {
                  if (allowDirectEdit) {
                    setIsEditing(true)
                    setSearchQuery(getDisplayValue())
                    // Focus the input when clicking on the selected value
                    setTimeout(() => {
                      if (inputRef.current) {
                        inputRef.current.focus()
                      }
                    }, 0)
                  } else {
                    setShowDropdown(true)
                    // Focus the input when clicking on the selected value
                    setTimeout(() => {
                      if (inputRef.current) {
                        inputRef.current.focus()
                      }
                    }, 0)
                  }
                }}
              >
                {getDisplayValue()}
              </div>
              {allowDirectEdit && (
                <button
                  className="ml-2 text-blue-600 hover:text-blue-800 p-1 rounded-full hover:bg-gray-100"
                  onClick={() => {
                    setIsEditing(true)
                    setSearchQuery(getDisplayValue())
                    // Focus the input when clicking edit
                    setTimeout(() => {
                      if (inputRef.current) {
                        inputRef.current.focus()
                      }
                    }, 0)
                  }}
                >
                  <Search className="h-4 w-4" />
                </button>
              )}
            </div>
          ) : (
            <div className="flex items-center w-full">
              <Search className="h-4 w-4 text-gray-400 mr-2" />
              <input
                ref={inputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value)
                  if (!isEditing) {
                    setShowDropdown(true)
                  }
                }}
                onFocus={() => {
                  if (!isEditing) {
                    setShowDropdown(true)
                  }
                }}
                onBlur={() => {
                  if (isEditing && searchQuery.trim()) {
                    // Save the edited value when focus is lost
                    onChange(searchQuery)
                    setIsEditing(false)
                  }
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && isEditing && searchQuery.trim()) {
                    // Save the edited value when Enter is pressed
                    onChange(searchQuery)
                    setIsEditing(false)
                    e.preventDefault()
                  } else if (e.key === "Escape") {
                    // Cancel editing when Escape is pressed
                    setIsEditing(false)
                    setSearchQuery("")
                    e.preventDefault()
                  }
                }}
                placeholder={getDisplayValue() || placeholder}
                className="w-full focus:outline-none focus:border-purple-500"
              />
            </div>
          )}
          {isEditing ? (
            <div className="flex">
              <button
                className="text-green-600 hover:text-green-800 p-1 rounded-full hover:bg-gray-100 mr-1"
                onClick={() => {
                  if (searchQuery.trim()) {
                    onChange(searchQuery)
                  }
                  setIsEditing(false)
                  setSearchQuery("")
                }}
              >
                <Check className="h-4 w-4" />
              </button>
              <button
                className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100"
                onClick={() => {
                  setIsEditing(false)
                  setSearchQuery("")
                }}
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ) : showDropdown ? (
            <ChevronUp className="h-5 w-5 text-gray-400 cursor-pointer" onClick={() => setShowDropdown(false)} />
          ) : (
            <ChevronDown className="h-5 w-5 text-gray-400 cursor-pointer" onClick={() => setShowDropdown(true)} />
          )}
        </div>
        {showDropdown && (
          <div className="absolute z-20 mt-1 w-full bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-auto">
            {filteredOptions.length > 0 ? (
              <div>
                {groupBy && typeof filteredOptions[0] === "object" ? (
                  // Render grouped options
                  Object.entries(groupedOptions).map(([group, groupOptions]) => (
                    <div key={group}>
                      <div className="px-4 py-1 text-xs font-semibold text-gray-500 bg-gray-50">{group}</div>
                      <ul className="py-1">
                        {groupOptions.map((option, index) => (
                          <li
                            key={index}
                            className={`px-4 py-2 text-sm cursor-pointer flex items-center justify-between ${
                              isOptionSelected(option) ? "bg-gray-50 text-black font-medium" : "hover:bg-gray-100"
                            }`}
                            onClick={() => handleSelectOption(option)}
                          >
                            {option.label}
                            {isOptionSelected(option) && <Check className="h-4 w-4 ml-2" />}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))
                ) : (
                  // Render flat list of options
                  <ul className="py-1">
                    {filteredOptions.map((option, index) => (
                      <li
                        key={index}
                        className={`px-4 py-2 text-sm cursor-pointer flex items-center justify-between ${
                          isOptionSelected(option) ? "bg-gray-50 text-black font-medium" : "hover:bg-gray-100"
                        }`}
                        onClick={() => handleSelectOption(option)}
                      >
                        {typeof option === "object" ? option.label : option}
                        {isOptionSelected(option) && <Check className="h-4 w-4 ml-2" />}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ) : (
              <div className="px-4 py-2 text-sm text-gray-500">
                No results found
                {allowAddNew && searchQuery.trim() && (
                  <button
                    className="flex items-center text-purple-600 hover:text-purple-800 mt-1"
                    onClick={handleAddNewOption}
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Add "{searchQuery}"
                  </button>
                )}
              </div>
            )}

            {/* Add new option button when allowed */}
            {allowAddNew && searchQuery.trim() && filteredOptions.length > 0 && (
              <div className="px-4 py-2 border-t border-gray-100">
                <button
                  className="flex items-center text-purple-600 hover:text-purple-800 text-sm"
                  onClick={handleAddNewOption}
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Add "{searchQuery}"
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

