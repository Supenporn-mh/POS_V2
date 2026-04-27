import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { cn } from '@/components/ui/utils'
import type { ReactNode } from 'react'

export interface FormSelectOption {
    value: string
    label: ReactNode
    disabled?: boolean
    icon?: ReactNode
}

interface FormSelectProps {
    value?: string
    onChange?: (value: string) => void
    options: FormSelectOption[]
    placeholder?: ReactNode
    disabled?: boolean
    /** Class on the trigger button */
    className?: string
    /** Class on the dropdown content */
    contentClassName?: string
    align?: 'start' | 'center' | 'end'
    name?: string
    id?: string
    triggerSize?: 'sm' | 'default'
}

export function FormSelect({
    value,
    onChange,
    options,
    placeholder,
    disabled = false,
    className,
    contentClassName,
    align,
    name,
    id,
    triggerSize = 'default',
}: FormSelectProps) {
    return (
        <Select value={value} onValueChange={onChange} disabled={disabled} name={name}>
            <SelectTrigger id={id} size={triggerSize} className={cn('w-full', className)}>
                <SelectValue placeholder={placeholder} />
            </SelectTrigger>
            <SelectContent align={align} className={contentClassName}>
                {options.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value} disabled={opt.disabled}>
                        {opt.icon ? (
                            <span className="flex items-center gap-2">
                                {opt.icon}
                                {opt.label}
                            </span>
                        ) : (
                            opt.label
                        )}
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    )
}
