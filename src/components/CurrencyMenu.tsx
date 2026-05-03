import { useEffect, useRef, useState } from 'react'

import { useDisplayCurrency } from '@/context/DisplayCurrencyContext'
import { DISPLAY_CURRENCY_OPTIONS, type DisplayCurrencyCode } from '@/lib/displayCurrency'

type CurrencyMenuProps = {
  /** `hero`: light text on transparent header. `surface`: dark text on booking-style pages. */
  variant?: 'hero' | 'surface'
}

export function CurrencyMenu({ variant = 'hero' }: CurrencyMenuProps) {
  const { currency, setCurrency } = useDisplayCurrency()
  const [open, setOpen] = useState(false)
  const wrapRef = useRef<HTMLDivElement>(null)

  const current = DISPLAY_CURRENCY_OPTIONS.find((o) => o.code === currency) ?? DISPLAY_CURRENCY_OPTIONS[0]

  useEffect(() => {
    if (!open) return
    function onDocMouseDown(e: MouseEvent) {
      const el = wrapRef.current
      if (el && !el.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', onDocMouseDown)
    return () => document.removeEventListener('mousedown', onDocMouseDown)
  }, [open])

  function select(code: DisplayCurrencyCode) {
    setCurrency(code)
    setOpen(false)
  }

  return (
    <div className="currency-menu" ref={wrapRef}>
      <button
        type="button"
        className={`currency-menu-trigger currency-menu-trigger--${variant}`}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={`Display currency, ${current.label}. Change currency.`}
        onClick={() => setOpen((o) => !o)}
      >
        {current.compact}
      </button>
      {open ? (
        <ul className="currency-menu-list" role="listbox" aria-label="Choose display currency">
          {DISPLAY_CURRENCY_OPTIONS.map((opt) => (
            <li key={opt.code} role="none">
              <button
                type="button"
                role="option"
                aria-selected={opt.code === currency}
                className={`currency-menu-option${opt.code === currency ? ' is-active' : ''}`}
                onClick={() => select(opt.code)}
              >
                <span className="currency-menu-option-compact">{opt.compact}</span>
                <span className="currency-menu-option-label">{opt.label}</span>
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  )
}
