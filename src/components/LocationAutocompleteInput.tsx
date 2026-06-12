import { useState } from 'react'

import { Input } from '@/components/ui/input'
import { usePlaceSuggestions } from '@/hooks/usePlaceSuggestions'
import { cn } from '@/lib/utils'

type LocationAutocompleteInputProps = {
  value: string
  onChange: (value: string) => void
  onBlur?: () => void
  placeholder?: string
  readOnly?: boolean
  className?: string
  name?: string
}

function SuggestionList({
  suggestions,
  loading,
  onSelect,
}: {
  suggestions: string[]
  loading: boolean
  onSelect: (value: string) => void
}) {
  if (loading && suggestions.length === 0) {
    return (
      <li>
        <span className="location-autocomplete-status" aria-live="polite">
          Searching…
        </span>
      </li>
    )
  }

  return (
    <>
      {suggestions.map((suggestion) => (
        <li key={suggestion}>
          <button
            type="button"
            className="location-autocomplete-option"
            onMouseDown={(event) => event.preventDefault()}
            onClick={() => onSelect(suggestion)}
          >
            {suggestion}
          </button>
        </li>
      ))}
    </>
  )
}

export function LocationAutocompleteInput({
  value,
  onChange,
  onBlur,
  placeholder,
  readOnly = false,
  className,
  name,
}: LocationAutocompleteInputProps) {
  const [suppressSuggestions, setSuppressSuggestions] = useState(false)

  const searchEnabled = !readOnly && !suppressSuggestions && value.trim().length >= 1
  const { suggestions, loading } = usePlaceSuggestions(value, searchEnabled)
  const isOpen = searchEnabled && (loading || suggestions.length > 0)

  const selectSuggestion = (next: string) => {
    setSuppressSuggestions(true)
    onChange(next)
  }

  const handleInputChange = (next: string) => {
    setSuppressSuggestions(false)
    onChange(next)
  }

  if (readOnly) {
    return (
      <Input
        readOnly
        name={name}
        value={value}
        placeholder={placeholder}
        autoComplete="off"
        className={cn(className, 'cursor-default')}
      />
    )
  }

  return (
    <div className="location-autocomplete">
      <Input
        name={name}
        value={value}
        placeholder={placeholder}
        autoComplete="off"
        className={className}
        onChange={(event) => handleInputChange(event.target.value)}
        onBlur={() => onBlur?.()}
      />

      {isOpen ? (
        <ul className="location-autocomplete-list" role="listbox">
          <SuggestionList
            suggestions={suggestions}
            loading={loading}
            onSelect={selectSuggestion}
          />
        </ul>
      ) : null}
    </div>
  )
}
