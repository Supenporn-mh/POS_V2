'use client'

import { useTheme } from 'next-themes'
import { Toaster as Sonner, type ToasterProps, toast as sonnerToast, type ExternalToast } from 'sonner'
import { playSound } from '@/utils/NotifySound'

const Toaster = ({ ...props }: ToasterProps) => {
    const { theme = 'system' } = useTheme()

    return (
        <Sonner
            theme={theme as ToasterProps['theme']}
            className="toaster group"
            style={
                {
                    '--normal-bg': 'var(--popover)',
                    '--normal-text': 'var(--popover-foreground)',
                    '--normal-border': 'var(--border)',
                } as React.CSSProperties
            }
            {...props}
        />
    )
}

// Custom toast with sound
export const toast = Object.assign(
    (message: string | React.ReactNode, data?: ExternalToast) => {
        playSound('info')
        return sonnerToast(message, data)
    },
    {
        success: (message: string | React.ReactNode, data?: ExternalToast) => {
            playSound('success')
            return sonnerToast.success(message, data)
        },
        error: (message: string | React.ReactNode, data?: ExternalToast) => {
            playSound('error')
            return sonnerToast.error(message, data)
        },
        warning: (message: string | React.ReactNode, data?: ExternalToast) => {
            playSound('warning')
            return sonnerToast.warning(message, data)
        },
        info: (message: string | React.ReactNode, data?: ExternalToast) => {
            playSound('info')
            return sonnerToast.info(message, data)
        },
        loading: sonnerToast.loading,
        promise: sonnerToast.promise,
        dismiss: sonnerToast.dismiss,
        custom: sonnerToast.custom,
        message: sonnerToast.message,
    }
)

export default Toaster
