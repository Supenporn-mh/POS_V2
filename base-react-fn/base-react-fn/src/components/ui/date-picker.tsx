import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { cn } from '@/components/ui/utils'
import dayjs from 'dayjs'
import { CalendarIcon } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import type { DateRange } from 'react-day-picker'

interface DatePickerProps {
    value: Date | null | undefined
    onChange: (date: Date | null) => void
    placeholder?: string
    format?: string
    disabled?: boolean
    className?: string
    align?: 'start' | 'center' | 'end'
}

export function DatePicker({
    value,
    onChange,
    placeholder = 'Select date',
    format = 'DD/MM/YYYY',
    disabled = false,
    className,
    align = 'start',
}: DatePickerProps) {
    const [open, setOpen] = useState(false)

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    type="button"
                    variant="outline"
                    disabled={disabled}
                    className={cn(
                        'w-full justify-start h-9 font-normal',
                        !value && 'text-muted-foreground',
                        className
                    )}
                >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {value ? dayjs(value).format(format) : placeholder}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align={align}>
                <Calendar
                    mode="single"
                    selected={value ?? undefined}
                    onSelect={(date) => {
                        onChange(date ?? null)
                        setOpen(false)
                    }}
                    initialFocus
                />
            </PopoverContent>
        </Popover>
    )
}

interface DateRangePickerProps {
    from: Date | null | undefined
    to: Date | null | undefined
    onChange: (range: { from: Date | null; to: Date | null }) => void
    /** "legacy" (default) = two single-date pickers; "modern" = single popover with mode="range" */
    variant?: 'legacy' | 'modern'
    fromPlaceholder?: string
    toPlaceholder?: string
    /** Modern variant only — single trigger label when both dates are empty */
    placeholder?: string
    format?: string
    disabled?: boolean
    className?: string
    /** Legacy variant only */
    separator?: React.ReactNode
    /** Modern variant only — number of calendar months shown side-by-side */
    numberOfMonths?: number
    /** Modern variant only — popover alignment */
    align?: 'start' | 'center' | 'end'
}

export function DateRangePicker({
    from,
    to,
    onChange,
    variant = 'legacy',
    fromPlaceholder = 'From',
    toPlaceholder = 'To',
    placeholder = 'Select date range',
    format = 'DD/MM/YY',
    disabled = false,
    className,
    separator = '→',
    numberOfMonths = 2,
    align = 'start',
}: DateRangePickerProps) {
    if (variant === 'modern') {
        return (
            <ModernRangePicker
                from={from}
                to={to}
                onChange={onChange}
                fromPlaceholder={fromPlaceholder}
                toPlaceholder={toPlaceholder}
                placeholder={placeholder}
                format={format}
                disabled={disabled}
                className={className}
                numberOfMonths={numberOfMonths}
                align={align}
            />
        )
    }

    return (
        <div className={cn('flex items-center gap-2', className)}>
            <DatePicker
                value={from}
                onChange={(date) => onChange({ from: date, to: to ?? null })}
                placeholder={fromPlaceholder}
                format={format}
                disabled={disabled}
                className="flex-1"
            />
            <span className="text-muted-foreground select-none">{separator}</span>
            <DatePicker
                value={to}
                onChange={(date) => onChange({ from: from ?? null, to: date })}
                placeholder={toPlaceholder}
                format={format}
                disabled={disabled}
                className="flex-1"
            />
        </div>
    )
}

interface ModernRangePickerProps {
    from: Date | null | undefined
    to: Date | null | undefined
    onChange: (range: { from: Date | null; to: Date | null }) => void
    fromPlaceholder: string
    toPlaceholder: string
    placeholder: string
    format: string
    disabled: boolean
    className?: string
    numberOfMonths: number
    align: 'start' | 'center' | 'end'
}

function ModernRangePicker({
    from,
    to,
    onChange,
    fromPlaceholder,
    toPlaceholder,
    placeholder,
    format,
    disabled,
    className,
    numberOfMonths,
    align,
}: ModernRangePickerProps) {
    const [open, setOpen] = useState(false)
    const committed: DateRange | undefined =
        from || to ? { from: from ?? undefined, to: to ?? undefined } : undefined
    const [draft, setDraft] = useState<DateRange | undefined>(committed)
    // Mirror draft into a ref so handlers always see the latest value
    // (Radix's onPointerDownOutside / onEscapeKeyDown otherwise capture a stale closure)
    const draftRef = useRef<DateRange | undefined>(draft)
    draftRef.current = draft

    // Reset draft to the latest committed range whenever the popover opens
    useEffect(() => {
        if (open) setDraft(committed)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [open])

    const isIncomplete = (d: DateRange | undefined) => !!(d?.from && !d?.to)

    const handleOpenChange = (next: boolean) => {
        if (!next && isIncomplete(draftRef.current)) return
        setOpen(next)
    }

    const handleSelect = (range: DateRange | undefined) => {
        setDraft(range)
        draftRef.current = range
        // Only auto-close once a real range (different start & end) is selected
        if (range?.from && range?.to && range.from.getTime() !== range.to.getTime()) {
            onChange({ from: range.from, to: range.to })
            setOpen(false)
        }
    }

    const handleApply = () => {
        if (!draft?.from || !draft?.to) return
        onChange({ from: draft.from, to: draft.to })
        setOpen(false)
    }

    const handleCancel = () => {
        setDraft(committed)
        draftRef.current = committed
        setOpen(false)
    }

    const handleClear = () => {
        setDraft(undefined)
        draftRef.current = undefined
        onChange({ from: null, to: null })
        setOpen(false)
    }

    const label = (() => {
        if (from && to) return `${dayjs(from).format(format)} → ${dayjs(to).format(format)}`
        if (from) return `${dayjs(from).format(format)} → ${toPlaceholder}`
        if (to) return `${fromPlaceholder} → ${dayjs(to).format(format)}`
        return placeholder
    })()

    return (
        <Popover open={open} onOpenChange={handleOpenChange}>
            <PopoverTrigger asChild>
                <Button
                    type="button"
                    variant="outline"
                    disabled={disabled}
                    className={cn(
                        'w-full justify-start h-9 font-normal',
                        !from && !to && 'text-muted-foreground',
                        className
                    )}
                >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {label}
                </Button>
            </PopoverTrigger>
            <PopoverContent
                className="w-auto p-0"
                align={align}
                onPointerDownOutside={(e) => {
                    if (isIncomplete(draftRef.current)) e.preventDefault()
                }}
                onEscapeKeyDown={(e) => {
                    if (isIncomplete(draftRef.current)) e.preventDefault()
                }}
                onInteractOutside={(e) => {
                    if (isIncomplete(draftRef.current)) e.preventDefault()
                }}
            >
                <Calendar
                    mode="range"
                    defaultMonth={draft?.from ?? committed?.from}
                    selected={draft}
                    onSelect={handleSelect}
                    numberOfMonths={numberOfMonths}
                    initialFocus
                />
                <div className="flex items-center justify-between gap-2 border-t p-2">
                    <Button type="button" variant="ghost" size="sm" onClick={handleClear}>
                        Clear
                    </Button>
                    <div className="flex items-center gap-2">
                        {isIncomplete(draft) && (
                            <span className="text-xs text-muted-foreground">Pick an end date</span>
                        )}
                        <Button type="button" variant="ghost" size="sm" onClick={handleCancel}>
                            Cancel
                        </Button>
                        <Button
                            type="button"
                            size="sm"
                            disabled={!draft?.from || !draft?.to}
                            onClick={handleApply}
                        >
                            Apply
                        </Button>
                    </div>
                </div>
            </PopoverContent>
        </Popover>
    )
}
