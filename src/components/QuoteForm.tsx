import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import * as z from 'zod'

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'

const quoteFormSchema = z
  .object({
    tripType: z.enum(['oneWay', 'return']),
    pickup: z.string().min(1),
    dropoff: z.string().trim().min(1, 'Enter a destination'),
    departureAt: z.string().optional(),
    returnAt: z.string().optional(),
    passengers: z.number().int().min(1).max(16),
    luggage: z.number().int().min(0).max(16),
  })
  .superRefine((data, ctx) => {
    if (data.tripType === 'return' && !data.returnAt?.trim()) {
      ctx.addIssue({
        code: 'custom',
        message: 'Add return date & time',
        path: ['returnAt'],
      })
    }
  })

export type QuoteFormValues = z.infer<typeof quoteFormSchema>

type QuoteFormProps = {
  onContinue: (values: QuoteFormValues) => void
  initialValues?: QuoteFormValues | null
}

const defaultPickup = 'Barcelona-El Prat International Airport (BCN)'

const inputClassName =
  'quote-field-input !box-border !min-h-[48px] !w-full !min-w-0 !max-w-full !block !rounded-[12px] !border !border-[#d5dee9] !bg-white !px-[14px] !py-[13px] !text-sm !text-[#152032] !shadow-none md:!text-sm placeholder:!text-[#8b97a8]'

export function QuoteForm({ onContinue, initialValues }: QuoteFormProps) {
  const form = useForm<QuoteFormValues>({
    resolver: zodResolver(quoteFormSchema),
    defaultValues: initialValues ?? {
      tripType: 'oneWay',
      pickup: defaultPickup,
      dropoff: '',
      departureAt: '',
      returnAt: '',
      passengers: 1,
      luggage: 1,
    },
  })

  const tripType = form.watch('tripType')

  function onSubmit(values: QuoteFormValues) {
    onContinue(values)
  }

  return (
    <aside className="quote-card" aria-label="Get a price quote form">
      <div className="quote-card-inner">
        <h2>Get a price quote</h2>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="quote-form flex w-full min-w-0 flex-col gap-0"
          >
            <div className="trip-toggle">
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
                    <Input readOnly className={cn(inputClassName, 'cursor-default')} {...field} />
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
                    <Input
                      placeholder="To (airport, port, address)"
                      autoComplete="off"
                      className={inputClassName}
                      {...field}
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
                  <FormLabel className="sr-only">Departure date and time</FormLabel>
                  <FormControl>
                    <Input
                      type="datetime-local"
                      autoComplete="off"
                      className={cn(inputClassName, 'quote-field-datetime')}
                      {...field}
                      value={field.value ?? ''}
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
                    <FormLabel className="sr-only">Return date and time</FormLabel>
                    <FormControl>
                      <Input
                        type="datetime-local"
                        autoComplete="off"
                        className={cn(inputClassName, 'quote-field-datetime')}
                        {...field}
                        value={field.value ?? ''}
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
