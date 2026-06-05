import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import * as z from 'zod'

import { DateTimeLocalSplit } from '@/components/DateTimeLocalSplit'
import { LocationAutocompleteInput } from '@/components/LocationAutocompleteInput'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { isPickupDatetimeInPast, PICKUP_IN_PAST_MESSAGE } from '@/lib/bookingDateTime'
import { cn } from '@/lib/utils'

const routeTypeValues = ['fromAirport', 'toAirport', 'pointToPoint'] as const
export type RouteType = (typeof routeTypeValues)[number]

const quoteFormSchema = z
  .object({
    routeType: z.enum(routeTypeValues),
    tripType: z.enum(['oneWay', 'return']),
    pickup: z.string().min(1),
    dropoff: z.string().trim().min(1, 'Enter a destination'),
    departureAt: z.string().optional(),
    returnAt: z.string().optional(),
    passengers: z.number().int().min(1).max(16),
    luggage: z.number().int().min(0).max(16),
  })
  .superRefine((data, ctx) => {
    if (data.departureAt?.trim() && isPickupDatetimeInPast(data.departureAt)) {
      ctx.addIssue({
        code: 'custom',
        message: PICKUP_IN_PAST_MESSAGE,
        path: ['departureAt'],
      })
    }
    if (data.tripType === 'return' && !data.returnAt?.trim()) {
      ctx.addIssue({
        code: 'custom',
        message: 'Add return date & time',
        path: ['returnAt'],
      })
    }
    if (data.tripType === 'return' && data.returnAt?.trim() && isPickupDatetimeInPast(data.returnAt)) {
      ctx.addIssue({
        code: 'custom',
        message: PICKUP_IN_PAST_MESSAGE,
        path: ['returnAt'],
      })
    }
  })

export type QuoteFormValues = z.infer<typeof quoteFormSchema>

type QuoteFormProps = {
  onContinue: (values: QuoteFormValues) => void
  initialValues?: QuoteFormValues | null
}

const BARCELONA_AIRPORT = 'Barcelona-El Prat International Airport (BCN)'

const quoteFormEmpty: QuoteFormValues = {
  routeType: 'fromAirport',
  tripType: 'oneWay',
  pickup: BARCELONA_AIRPORT,
  dropoff: '',
  departureAt: '',
  returnAt: '',
  passengers: 1,
  luggage: 1,
}

function mergeQuoteInitial(initial?: QuoteFormValues | null): QuoteFormValues {
  if (!initial) {
    return { ...quoteFormEmpty }
  }
  return { ...quoteFormEmpty, ...initial }
}

function applyRouteType(
  routeType: RouteType,
  current: Pick<QuoteFormValues, 'pickup' | 'dropoff'>,
): Pick<QuoteFormValues, 'pickup' | 'dropoff'> {
  if (routeType === 'fromAirport') {
    return {
      pickup: BARCELONA_AIRPORT,
      dropoff: current.dropoff === BARCELONA_AIRPORT ? '' : current.dropoff,
    }
  }
  if (routeType === 'toAirport') {
    return {
      pickup: current.pickup === BARCELONA_AIRPORT ? '' : current.pickup,
      dropoff: BARCELONA_AIRPORT,
    }
  }
  return {
    pickup: current.pickup === BARCELONA_AIRPORT ? '' : current.pickup,
    dropoff: current.dropoff === BARCELONA_AIRPORT ? '' : current.dropoff,
  }
}

const inputClassName =
  'quote-field-input !box-border !min-h-[42px] !w-full !min-w-0 !max-w-full !block !rounded-[12px] !border !border-[#d5dee9] !bg-white !px-[14px] !py-[10px] !text-sm !text-[#152032] !shadow-none md:!text-sm placeholder:!text-[#8b97a8]'

export function QuoteForm({ onContinue, initialValues }: QuoteFormProps) {
  const form = useForm<QuoteFormValues>({
    resolver: zodResolver(quoteFormSchema),
    defaultValues: mergeQuoteInitial(initialValues),
  })

  const tripType = form.watch('tripType')
  const routeType = form.watch('routeType')

  function setRouteType(nextRouteType: RouteType) {
    const current = form.getValues()
    const nextLocations = applyRouteType(nextRouteType, current)
    form.setValue('routeType', nextRouteType)
    form.setValue('pickup', nextLocations.pickup)
    form.setValue('dropoff', nextLocations.dropoff)
    form.clearErrors(['pickup', 'dropoff'])
  }

  function onSubmit(values: QuoteFormValues) {
    onContinue(values)
  }

  return (
    <aside
      className={cn(
        'quote-card',
        tripType === 'return' ? 'quote-card--return' : 'quote-card--one-way',
      )}
      aria-label="Get a price quote form"
    >
      <div className="quote-card-inner">
        <h2>Get a price quote</h2>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="quote-form flex w-full min-w-0 flex-col gap-0"
          >
            <div className="trip-toggle route-toggle" role="group" aria-label="Route type">
              <button
                type="button"
                className={routeType === 'fromAirport' ? 'active' : ''}
                onClick={() => setRouteType('fromAirport')}
              >
                From Airport
              </button>
              <button
                type="button"
                className={routeType === 'toAirport' ? 'active' : ''}
                onClick={() => setRouteType('toAirport')}
              >
                To Airport
              </button>
              <button
                type="button"
                className={routeType === 'pointToPoint' ? 'active' : ''}
                onClick={() => setRouteType('pointToPoint')}
              >
                Point-to-Point
              </button>
            </div>

            <div className="trip-toggle" role="group" aria-label="Trip type">
              <button
                type="button"
                className={tripType === 'oneWay' ? 'active' : ''}
                onClick={() => {
                  form.setValue('tripType', 'oneWay')
                  form.clearErrors('returnAt')
                }}
              >
                One Way
              </button>
              <button
                type="button"
                className={tripType === 'return' ? 'active' : ''}
                onClick={() => form.setValue('tripType', 'return')}
              >
                Return
              </button>
            </div>

            <FormField
              control={form.control}
              name="pickup"
              render={({ field }) => (
                <FormItem className="quote-form-field">
                  <FormLabel className="sr-only">Pickup location</FormLabel>
                  <FormControl>
                    <LocationAutocompleteInput
                      readOnly={routeType === 'fromAirport'}
                      placeholder="From (address, hotel, port)"
                      className={cn(
                        inputClassName,
                        routeType === 'fromAirport' && 'cursor-default',
                      )}
                      value={field.value}
                      onChange={field.onChange}
                      onBlur={field.onBlur}
                      name={field.name}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="dropoff"
              render={({ field }) => (
                <FormItem className="quote-form-field">
                  <FormLabel className="sr-only">Drop-off</FormLabel>
                  <FormControl>
                    <LocationAutocompleteInput
                      readOnly={routeType === 'toAirport'}
                      placeholder="To (airport, port, address)"
                      className={cn(inputClassName, routeType === 'toAirport' && 'cursor-default')}
                      value={field.value}
                      onChange={field.onChange}
                      onBlur={field.onBlur}
                      name={field.name}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="departureAt"
              render={({ field }) => (
                <FormItem className="quote-form-field">
                  <FormLabel className="quote-datetime-heading">Pickup date &amp; time</FormLabel>
                  <FormControl>
                    <DateTimeLocalSplit
                      value={field.value ?? ''}
                      onChange={field.onChange}
                      inputClassName={cn(inputClassName, 'quote-field-datetime')}
                      variant="quote"
                      dateLabel="Date"
                      timeLabel="Time"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {tripType === 'return' ? (
              <FormField
                control={form.control}
                name="returnAt"
                render={({ field }) => (
                  <FormItem className="quote-form-field">
                    <FormLabel className="quote-datetime-heading">Return date &amp; time</FormLabel>
                    <FormControl>
                      <DateTimeLocalSplit
                        value={field.value ?? ''}
                        onChange={field.onChange}
                        inputClassName={cn(inputClassName, 'quote-field-datetime')}
                        variant="quote"
                        dateLabel="Date"
                        timeLabel="Time"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            ) : null}

            <div className="counter-row">
              <FormField
                control={form.control}
                name="passengers"
                render={({ field }) => (
                  <FormItem className="counter-field">
                    <FormLabel className="counter-label">Passengers</FormLabel>
                    <div className="counter-box">
                      <button
                        type="button"
                        onClick={() => field.onChange(Math.max(1, Number(field.value) - 1))}
                      >
                        -
                      </button>
                      <span>{field.value}</span>
                      <button
                        type="button"
                        onClick={() => field.onChange(Math.min(16, Number(field.value) + 1))}
                      >
                        +
                      </button>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="luggage"
                render={({ field }) => (
                  <FormItem className="counter-field">
                    <FormLabel className="counter-label">Luggage pieces</FormLabel>
                    <div className="counter-box">
                      <button
                        type="button"
                        onClick={() => field.onChange(Math.max(0, Number(field.value) - 1))}
                      >
                        -
                      </button>
                      <span>{field.value}</span>
                      <button
                        type="button"
                        onClick={() => field.onChange(Math.min(16, Number(field.value) + 1))}
                      >
                        +
                      </button>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <button type="submit" className="continue-btn mt-1 w-full">
              Continue
            </button>
          </form>
        </Form>
      </div>
    </aside>
  )
}
