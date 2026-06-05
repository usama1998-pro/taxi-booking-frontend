import { useEffect, useId, useRef, useState } from 'react'

import { Input } from '@/components/ui/input'
import { searchLocations } from '@/lib/locationSearch'
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

export function LocationAutocompleteInput({
  value,
  onChange,
  onBlur,
  placeholder,
  readOnly = false,
  className,
  name,
}: LocationAutocompleteInputProps) {
  const listId = useId()
  const rootRef = useRef<HTMLDivElement | null>(null)
  const [isOpen, setIsOpen] = useState(false)
  const [activeIndex, setActiveIndex] = useState(-1)
  const [suggestions, setSuggestions] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (readOnly) {
      setSuggestions([])
      setIsOpen(false)
      return
    }

    const trimmed = value.trim()
    if (trimmed.length < 2) {
      setSuggestions([])
      setIsOpen(false)
      setIsLoading(false)
      return
    }

    const controller = new AbortController()
    const timer = window.setTimeout(() => {
      setIsLoading(true)
      void searchLocations(trimmed, controller.signal)
        .then((results) => {
          setSuggestions(results)
          setIsOpen(results.length > 0)
          setActiveIndex(-1)
        })
        .catch(() => {
          setSuggestions([])
          setIsOpen(false)
        })
        .finally(() => {
          setIsLoading(false)
        })
    }, 350)

    return () => {
      window.clearTimeout(timer)
      controller.abort()
    }
  }, [readOnly, value])

  useEffect(() => {
    function onPointerDown(event: MouseEvent) {
      const root = rootRef.current
      if (!root) return
      if (!root.contains(event.target as Node)) {
        setIsOpen(false)
        setActiveIndex(-1)
      }
    }

    document.addEventListener('mousedown', onPointerDown)
    return () => document.removeEventListener('mousedown', onPointerDown)
  }, [])

  function selectSuggestion(nextValue: string) {
    onChange(nextValue)
    setIsOpen(false)
    setActiveIndex(-1)
  }

  function handleKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (!isOpen || suggestions.length === 0) {
      return
    }

    if (event.key === 'ArrowDown') {
      event.preventDefault()
      setActiveIndex((index) => (index + 1) % suggestions.length)
      return
    }

    if (event.key === 'ArrowUp') {
      event.preventDefault()
      setActiveIndex((index) => (index <= 0 ? suggestions.length - 1 : index - 1))
      return
    }

    if (event.key === 'Enter' && activeIndex >= 0) {
      event.preventDefault()
      selectSuggestion(suggestions[activeIndex] ?? value)
      return
    }

    if (event.key === 'Escape') {
      setIsOpen(false)
      setActiveIndex(-1)
    }
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
    <div ref={rootRef} className="location-autocomplete">
      <Input
        name={name}
        value={value}
        placeholder={placeholder}
        autoComplete="off"
        role="combobox"
        aria-expanded={isOpen}
        aria-controls={listId}
        aria-autocomplete="list"
        aria-activedescendant={activeIndex >= 0 ? `${listId}-option-${activeIndex}` : undefined}
        className={className}
        onChange={(event) => onChange(event.target.value)}
        onFocus={() => {
          if (suggestions.length > 0) {
            setIsOpen(true)
          }
        }}
        onBlur={() => {
          onBlur?.()
        }}
        onKeyDown={handleKeyDown}
      />

      {isOpen ? (
        <ul id={listId} className="location-autocomplete-list" role="listbox">
          {suggestions.map((suggestion, index) => (
            <li key={suggestion} role="presentation">
              <button
                id={`${listId}-option-${index}`}
                type="button"
                role="option"
                aria-selected={index === activeIndex}
                className={cn(
                  'location-autocomplete-option',
                  index === activeIndex && 'is-active',
                )}
                onMouseDown={(event) => event.preventDefault()}
                onClick={() => selectSuggestion(suggestion)}
              >
                {suggestion}
              </button>
            </li>
          ))}
        </ul>
      ) : null}

      {isLoading ? <span className="location-autocomplete-loading">Searching…</span> : null}
    </div>
  )
}
