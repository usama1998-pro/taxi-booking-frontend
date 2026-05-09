import { Archive, Calendar, Loader2, LogOut, RefreshCw } from 'lucide-react'
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'

import { AdminBookingCard, AdminBookingsBrandPlane } from '@/components/admin/AdminBookingCard'
import { AdminReservationDetailModal } from '@/components/admin/AdminReservationDetailModal'
import { dispatcherBookingsApi } from '@/lib/dispatcherBookingsApi'
import type { Booking, BookingListTimeScope } from '@/types/booking'

import './AdminBookingsList.css'

const PAGE_SIZE = 20

const TABS: { key: BookingListTimeScope; label: string }[] = [
  { key: 'upcoming', label: 'Upcoming' },
  { key: 'current', label: 'Current' },
  { key: 'past', label: 'Past' },
]

type SectionState = {
  items: Booking[]
  page: number
  totalPages: number
  total: number
  loading: boolean
  loadingMore: boolean
  error: string | null
  loadMoreError: string | null
}

function emptySection(): SectionState {
  return {
    items: [],
    page: 0,
    totalPages: 0,
    total: 0,
    loading: false,
    loadingMore: false,
    error: null,
    loadMoreError: null,
  }
}

function pad2(n: number): string {
  return String(n).padStart(2, '0')
}

function localDayKeyFromIso(iso: string): string {
  const d = new Date(iso)
  return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`
}

function localDayKeyFromDate(d: Date): string {
  return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`
}

export type AdminBookingsListProps = {
  accessToken: string
  onLogout: () => void
}

export function AdminBookingsList({ accessToken, onLogout }: AdminBookingsListProps) {
  const appendLockRef = useRef(false)
  const activeRef = useRef<BookingListTimeScope>('upcoming')
  const byScopeRef = useRef<Record<BookingListTimeScope, SectionState>>({
    past: emptySection(),
    current: emptySection(),
    upcoming: emptySection(),
  })

  const [active, setActive] = useState<BookingListTimeScope>('upcoming')
  const [byScope, setByScope] = useState(byScopeRef.current)
  const [refreshing, setRefreshing] = useState(false)
  const [refInput, setRefInput] = useState('')
  const [appliedRefQuery, setAppliedRefQuery] = useState('')
  const [dateDraft, setDateDraft] = useState('')
  const [appliedDateFilter, setAppliedDateFilter] = useState<Date | null>(null)
  const [notesBooking, setNotesBooking] = useState<Booking | null>(null)
  const [detailUuid, setDetailUuid] = useState<string | null>(null)
  const [detailBooking, setDetailBooking] = useState<Booking | null>(null)
  const [detailLoading, setDetailLoading] = useState(false)
  const [detailError, setDetailError] = useState<string | null>(null)

  activeRef.current = active
  byScopeRef.current = byScope

  const refreshScope = useCallback(
    async (scope: BookingListTimeScope) => {
      if (!accessToken) {
        setByScope((prev) => ({
          ...prev,
          [scope]: {
            ...emptySection(),
            error: 'Not signed in.',
            loading: false,
          },
        }))
        return
      }
      setByScope((prev) => ({
        ...prev,
        [scope]: {
          ...prev[scope],
          error: null,
          loadMoreError: null,
          loading: true,
          loadingMore: false,
        },
      }))
      try {
        const res = await dispatcherBookingsApi.list(accessToken, {
          page: 1,
          pageSize: PAGE_SIZE,
          timeScope: scope,
        })
        setByScope((prev) => ({
          ...prev,
          [scope]: {
            ...prev[scope],
            items: res.data,
            page: res.page,
            totalPages: res.totalPages,
            total: res.total,
            loading: false,
            loadingMore: false,
            error: null,
            loadMoreError: null,
          },
        }))
      } catch (e) {
        setByScope((prev) => ({
          ...prev,
          [scope]: {
            ...prev[scope],
            loading: false,
            loadingMore: false,
            error: e instanceof Error ? e.message : 'Could not load bookings.',
            items: [],
            page: 0,
            total: 0,
            totalPages: 0,
            loadMoreError: null,
          },
        }))
      }
    },
    [accessToken],
  )

  const loadNextPage = useCallback(
    async (scope: BookingListTimeScope) => {
      if (!accessToken || appendLockRef.current) {
        return
      }
      const st = byScopeRef.current[scope]
      if (st.loading || st.loadingMore || st.items.length === 0) {
        return
      }
      if (st.totalPages > 0 && st.page >= st.totalPages) {
        return
      }

      appendLockRef.current = true
      setByScope((prev) => ({
        ...prev,
        [scope]: {
          ...prev[scope],
          loadingMore: true,
          loadMoreError: null,
        },
      }))
      try {
        const nextPage = st.page + 1
        const res = await dispatcherBookingsApi.list(accessToken, {
          page: nextPage,
          pageSize: PAGE_SIZE,
          timeScope: scope,
        })
        setByScope((prev) => {
          const cur = prev[scope]
          const seen = new Set(cur.items.map((b) => b.uuid))
          const merged = [...cur.items]
          for (const b of res.data) {
            if (!seen.has(b.uuid)) {
              seen.add(b.uuid)
              merged.push(b)
            }
          }
          return {
            ...prev,
            [scope]: {
              ...cur,
              items: merged,
              page: res.page,
              totalPages: res.totalPages,
              total: res.total,
              loadingMore: false,
              loadMoreError: null,
            },
          }
        })
      } catch (e) {
        setByScope((prev) => ({
          ...prev,
          [scope]: {
            ...prev[scope],
            loadingMore: false,
            loadMoreError:
              e instanceof Error ? e.message : 'Could not load more bookings.',
          },
        }))
      } finally {
        appendLockRef.current = false
      }
    },
    [accessToken],
  )

  const scrollListTop = useCallback(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [])

  const selectTab = useCallback(
    (scope: BookingListTimeScope) => {
      setActive(scope)
      if (scope === 'current') {
        setDateDraft('')
        setAppliedDateFilter(null)
      }
      void refreshScope(scope).then(scrollListTop)
    },
    [refreshScope, scrollListTop],
  )

  useEffect(() => {
    if (!accessToken) {
      return
    }
    void refreshScope(activeRef.current)
  }, [accessToken, refreshScope])

  const onManualRefresh = useCallback(async () => {
    setRefreshing(true)
    const scope = activeRef.current
    await refreshScope(scope)
    scrollListTop()
    setRefreshing(false)
  }, [refreshScope, scrollListTop])

  const section = byScope[active]

  const filtered = useMemo(() => {
    let rows = section.items
    const q = appliedRefQuery.trim().toLowerCase()
    if (q) {
      rows = rows.filter((b) =>
        String(b.bookingReference ?? '')
          .toLowerCase()
          .includes(q),
      )
    }
    if (appliedDateFilter && active !== 'current') {
      const fk = localDayKeyFromDate(appliedDateFilter)
      rows = rows.filter((b) => localDayKeyFromIso(b.scheduledTime) === fk)
    }
    return rows
  }, [section.items, appliedRefQuery, appliedDateFilter, active])

  const gridBookings = useMemo(() => {
    const groups = new Map<string, Booking[]>()
    for (const b of filtered) {
      const k = localDayKeyFromIso(b.scheduledTime)
      if (!groups.has(k)) {
        groups.set(k, [])
      }
      groups.get(k)!.push(b)
    }
    const keys = [...groups.keys()].sort((a, b) => {
      if (a === b) {
        return 0
      }
      return active === 'past' ? (a < b ? 1 : -1) : a < b ? -1 : 1
    })
    const out: Booking[] = []
    for (const k of keys) {
      const chunk = groups.get(k)!
      chunk.sort((a, b) =>
        active === 'past'
          ? new Date(b.scheduledTime).getTime() - new Date(a.scheduledTime).getTime()
          : new Date(a.scheduledTime).getTime() - new Date(b.scheduledTime).getTime(),
      )
      out.push(...chunk)
    }
    return out
  }, [filtered, active])

  const emptyCopy =
    active === 'past'
      ? 'No past trips yet.'
      : active === 'current'
        ? 'Nothing scheduled for today.'
        : 'No reservations from tomorrow onward.'

  const onDeleteBooking = useCallback(
    (b: Booking) => {
      if (!window.confirm(`Remove booking ${b.bookingReference}?`)) {
        return
      }
      void (async () => {
        try {
          await dispatcherBookingsApi.removeReservation(accessToken, b.uuid)
          await refreshScope(activeRef.current)
        } catch (e) {
          window.alert(
            e instanceof Error ? e.message : 'This booking could not be removed.',
          )
        }
      })()
    },
    [accessToken, refreshScope],
  )

  const applyRefSearch = useCallback(() => {
    setAppliedRefQuery(refInput.trim())
  }, [refInput])

  const clearRefSearch = useCallback(() => {
    setRefInput('')
    setAppliedRefQuery('')
  }, [])

  const applyDateSearch = useCallback(() => {
    const v = dateDraft.trim()
    if (!v) {
      setAppliedDateFilter(null)
      return
    }
    const [y, m, d] = v.split('-').map((x) => parseInt(x, 10))
    if (!Number.isFinite(y) || !Number.isFinite(m) || !Number.isFinite(d)) {
      setAppliedDateFilter(null)
      return
    }
    setAppliedDateFilter(new Date(y, m - 1, d))
  }, [dateDraft])

  const clearDateSearch = useCallback(() => {
    setDateDraft('')
    setAppliedDateFilter(null)
  }, [])

  const openDetail = useCallback((uuid: string) => {
    setDetailUuid(uuid)
    setDetailBooking(null)
    setDetailError(null)
    setDetailLoading(true)
  }, [])

  useEffect(() => {
    if (!detailUuid || !accessToken) {
      return
    }
    let cancelled = false
    void (async () => {
      try {
        const b = await dispatcherBookingsApi.getByUuid(accessToken, detailUuid)
        if (!cancelled) {
          setDetailBooking(b)
          setDetailError(null)
        }
      } catch (e) {
        if (!cancelled) {
          setDetailBooking(null)
          setDetailError(e instanceof Error ? e.message : 'Could not load booking.')
        }
      } finally {
        if (!cancelled) {
          setDetailLoading(false)
        }
      }
    })()
    return () => {
      cancelled = true
    }
  }, [detailUuid, accessToken])

  const closeDetail = useCallback(() => {
    setDetailUuid(null)
    setDetailBooking(null)
    setDetailError(null)
    setDetailLoading(false)
  }, [])

  const shellNav = (
    <header className="admin-bookings-shell__navbar">
      <div className="admin-bookings-shell__brand">
        <AdminBookingsBrandPlane />
        <div className="admin-bookings-shell__brand-text">
          <div className="admin-bookings-shell__logo-line">TAXI BARCELONA24</div>
          <div className="admin-bookings-shell__brand-sub">Taxi Barcelona24</div>
        </div>
      </div>
      <nav className="admin-bookings-shell__tabs" aria-label="Booking period">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            type="button"
            className={
              'admin-bookings-shell__tab' +
              (active === tab.key ? ' admin-bookings-shell__tab--active' : '')
            }
            onClick={() => selectTab(tab.key)}
          >
            {tab.label}
          </button>
        ))}
      </nav>
      <div className="admin-bookings-shell__tools">
        <button
          type="button"
          className="admin-bookings-shell__icon-btn"
          onClick={() => void onManualRefresh()}
          disabled={refreshing || section.loading}
          aria-label="Refresh list"
        >
          <span className={refreshing ? 'admin-bookings-shell__spin' : undefined}>
            <RefreshCw size={18} strokeWidth={2} />
          </span>
        </button>
        <button type="button" className="admin-bookings-shell__logout" onClick={onLogout}>
          <LogOut size={16} strokeWidth={2} aria-hidden />
          Log out
        </button>
      </div>
    </header>
  )

  const filterPanel = (
    <div className="admin-bookings-shell__filters">
      <section className="admin-bookings-filter-card">
        <div className="admin-bookings-filter-card__title">Search by booking ref</div>
        <div className="admin-bookings-filter-card__body">
          <label className="admin-bookings-filter-card__label" htmlFor="admin-ref-input">
            Enter Booking Ref
          </label>
          <div className="admin-bookings-filter-card__row">
            <input
              id="admin-ref-input"
              className="admin-bookings-filter-card__input"
              value={refInput}
              onChange={(e) => setRefInput(e.target.value)}
              placeholder=""
              autoCapitalize="off"
              autoCorrect="off"
            />
            <button type="button" className="admin-bookings-btn admin-bookings-btn--primary" onClick={applyRefSearch}>
              Search
            </button>
            <button type="button" className="admin-bookings-btn admin-bookings-btn--danger" onClick={clearRefSearch}>
              Clear
            </button>
          </div>
        </div>
      </section>

      {active !== 'current' ? (
        <section className="admin-bookings-filter-card">
          <div className="admin-bookings-filter-card__title">Search by Date</div>
          <div className="admin-bookings-filter-card__body">
            <label className="admin-bookings-filter-card__label" htmlFor="admin-date-input">
              Select Date
            </label>
            <div className="admin-bookings-filter-card__row">
              <div className="admin-bookings-filter-card__date-wrap">
                <Calendar size={18} className="admin-bookings-filter-card__cal-icon" strokeWidth={1.75} aria-hidden />
                <input
                  id="admin-date-input"
                  type="date"
                  className="admin-bookings-filter-card__input admin-bookings-filter-card__input--date"
                  value={dateDraft}
                  onChange={(e) => setDateDraft(e.target.value)}
                />
              </div>
              <button type="button" className="admin-bookings-btn admin-bookings-btn--primary" onClick={applyDateSearch}>
                Search
              </button>
              <button type="button" className="admin-bookings-btn admin-bookings-btn--danger" onClick={clearDateSearch}>
                Clear
              </button>
            </div>
          </div>
        </section>
      ) : null}
    </div>
  )

  const canLoadMore =
    section.items.length > 0 &&
    !section.loading &&
    section.totalPages > 0 &&
    section.page < section.totalPages

  const listFooter =
    section.items.length > 0 && !section.loading ? (
      <div className="admin-bookings-shell__load-more-wrap">
        {section.total > 0 ? (
          <p className="admin-bookings-shell__load-more-meta">
            Showing {section.items.length} of {section.total} booking{section.total === 1 ? '' : 's'}
          </p>
        ) : null}
        {canLoadMore ? (
          <button
            type="button"
            className="admin-bookings-btn admin-bookings-btn--primary admin-bookings-shell__load-more-btn"
            disabled={section.loadingMore}
            onClick={() => void loadNextPage(active)}
          >
            {section.loadingMore ? 'Loading…' : 'Load more'}
          </button>
        ) : null}
        {section.loadMoreError ? (
          <p className="admin-bookings-shell__footer-error">{section.loadMoreError}</p>
        ) : null}
      </div>
    ) : section.loadMoreError ? (
      <p className="admin-bookings-shell__footer-error">{section.loadMoreError}</p>
    ) : null

  const emptyIcon =
    active === 'past' ? (
      <Archive size={48} strokeWidth={1.25} className="admin-bookings-shell__empty-icon" />
    ) : (
      <Calendar size={48} strokeWidth={1.25} className="admin-bookings-shell__empty-icon" />
    )

  return (
    <div className="admin-bookings-shell">
      {shellNav}
      {filterPanel}

      <div className="admin-bookings-shell__scroll">
        {section.error && section.items.length === 0 && !section.loading ? (
          <p className="admin-bookings-shell__error-text">{section.error}</p>
        ) : section.loading && section.items.length === 0 ? (
          <div className="admin-bookings-shell__empty-loading">
            <Loader2 className="admin-bookings-shell__spinner" size={40} strokeWidth={2} />
          </div>
        ) : gridBookings.length === 0 ? (
          <div className="admin-bookings-shell__empty">
            {emptyIcon}
            <p className="admin-bookings-shell__empty-msg">{emptyCopy}</p>
          </div>
        ) : (
          <div className="admin-bookings-shell__grid">
            {gridBookings.map((item) => (
              <AdminBookingCard
                key={item.uuid}
                booking={item}
                dateDayKey={localDayKeyFromIso(item.scheduledTime)}
                onNotes={() => setNotesBooking(item)}
                onView={() => openDetail(item.uuid)}
                onDelete={() => onDeleteBooking(item)}
              />
            ))}
          </div>
        )}
        {listFooter}
      </div>

      {notesBooking ? (
        <div
          className="admin-bookings-modal-overlay"
          role="presentation"
          onClick={() => setNotesBooking(null)}
        >
          <div
            className="admin-bookings-modal-sheet"
            role="dialog"
            aria-labelledby="admin-notes-title"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 id="admin-notes-title" className="admin-bookings-modal-title">
              Notes
            </h2>
            <p className="admin-bookings-notes-body">
              {notesBooking.note?.trim() ? notesBooking.note.trim() : 'No notes for this booking.'}
            </p>
            <div className="admin-bookings-modal-actions">
              <button type="button" className="admin-bookings-modal-btn-primary" onClick={() => setNotesBooking(null)}>
                Close
              </button>
            </div>
          </div>
        </div>
      ) : null}

      <AdminReservationDetailModal
        open={detailUuid !== null}
        loading={detailLoading}
        error={detailError}
        booking={detailBooking}
        onClose={closeDetail}
      />
    </div>
  )
}
