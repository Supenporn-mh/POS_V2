// ─── IMPORTS ─────────────────────────────────────────────────────────────────
import SchoolLogo from '@/assets/images/Logo.png'
import SchoolImage from '@/assets/images/school-bg.jpg'
import Template from '@/components/common/Template'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Mail, ShieldCheck } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'

// ─── FILE-LOCAL CONSTANTS ────────────────────────────────────────────────────
const OTP_LENGTH = 6
const RESEND_COOLDOWN = 57

interface OTPVerificationProps {
    email: string
    isLoading?: boolean
    onVerify: (otp: string) => void
    onResend?: () => void
    onChangeEmail?: () => void
}

// ─── COMPONENT ───────────────────────────────────────────────────────────────
export default function OTPVerification({
    email,
    isLoading = false,
    onVerify,
    onResend,
    onChangeEmail,
}: OTPVerificationProps) {
    // ─── DATA STATE & LIB ────────────────────────────────────────────────────
    const [otp, setOtp] = useState<string[]>(Array(OTP_LENGTH).fill(''))
    const [countdown, setCountdown] = useState(RESEND_COOLDOWN)
    const [isResendDisabled, setIsResendDisabled] = useState(true)
    const inputRefs = useRef<(HTMLInputElement | null)[]>([])

    // ─── METHODS ─────────────────────────────────────────────────────────────
    const handleChange = (index: number, value: string) => {
        if (value && !/^\d$/.test(value)) return
        const next = [...otp]
        next[index] = value
        setOtp(next)
        if (value && index < OTP_LENGTH - 1) {
            inputRefs.current[index + 1]?.focus()
        }
    }

    const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Backspace' && !otp[index] && index > 0) {
            inputRefs.current[index - 1]?.focus()
        }
    }

    const handlePaste = (e: React.ClipboardEvent) => {
        e.preventDefault()
        const digits = e.clipboardData
            .getData('text')
            .slice(0, OTP_LENGTH)
            .split('')
            .filter((char) => /^\d$/.test(char))

        if (!digits.length) return

        const next = [...otp]
        digits.forEach((digit, i) => {
            if (i < OTP_LENGTH) next[i] = digit
        })
        setOtp(next)

        const nextEmpty = next.findIndex((v) => !v)
        const focusIndex = nextEmpty === -1 ? OTP_LENGTH - 1 : nextEmpty
        inputRefs.current[focusIndex]?.focus()
    }

    const handleVerify = () => {
        if (!isComplete) {
            $toast.error($t('otp:incomplete'))
            return
        }
        onVerify(otpCode)
    }

    const handleResend = () => {
        if (isResendDisabled) return
        setCountdown(RESEND_COOLDOWN)
        setIsResendDisabled(true)
        setOtp(Array(OTP_LENGTH).fill(''))
        inputRefs.current[0]?.focus()
        onResend?.()
        $toast.success($t('otp:resendSuccess'))
    }

    // ─── WATCH & COMPUTED ────────────────────────────────────────────────────
    useEffect(() => {
        if (countdown > 0 && isResendDisabled) {
            const timer = setTimeout(() => setCountdown((c) => c - 1), 1000)
            return () => clearTimeout(timer)
        }
        if (countdown === 0) {
            setIsResendDisabled(false)
        }
    }, [countdown, isResendDisabled])

    const otpCode = otp.join('')
    const isComplete = otpCode.length === OTP_LENGTH

    // ─── RENDER ──────────────────────────────────────────────────────────────
    return (
        <Template>
            <div className="otp-page">
                <div className="otp-page__hero" style={{ backgroundImage: `url(${SchoolImage})` }} />

                <div className="otp-page__panel">
                    <div className="otp-page__card">
                        <div className="otp-page__logo-wrap">
                            <img src={SchoolLogo} alt="King's College" className="otp-page__logo" />
                        </div>

                        <div className="otp-page__header">
                            <h1 className="otp-page__title">{$t('otp:title')}</h1>
                            <p className="otp-page__subtitle">{$t('otp:subtitle')}</p>
                        </div>

                        <div className="otp-page__email-wrap">
                            <div className="otp-page__email-icon">
                                <Mail strokeWidth={1.5} />
                            </div>
                            <p className="otp-page__email-label">{$t('otp:sentTo')}</p>
                            <p className="otp-page__email-value">{email}</p>
                        </div>

                        <div className="otp-page__field">
                            <label className="otp-page__label">{$t('otp:enterCode')}</label>
                            <div className="otp-page__inputs" onPaste={handlePaste}>
                                {otp.map((digit, index) => (
                                    <input
                                        key={index}
                                        ref={(el) => {
                                            inputRefs.current[index] = el
                                        }}
                                        type="text"
                                        inputMode="numeric"
                                        maxLength={1}
                                        value={digit}
                                        onChange={(e) => handleChange(index, e.target.value)}
                                        onKeyDown={(e) => handleKeyDown(index, e)}
                                        className="otp-page__input"
                                    />
                                ))}
                            </div>
                        </div>

                        <Button
                            onClick={handleVerify}
                            disabled={!isComplete || isLoading}
                            className={`otp-page__verify${isComplete ? ' otp-page__verify--active' : ''}`}
                        >
                            <ShieldCheck className="w-5 h-5" strokeWidth={2} />
                            {$t('otp:verify')}
                        </Button>

                        <div className="otp-page__resend-wrap">
                            <p className="otp-page__resend-hint">{$t('otp:didNotReceive')}</p>
                            <button
                                type="button"
                                onClick={handleResend}
                                disabled={isResendDisabled}
                                className="otp-page__resend-btn"
                            >
                                {isResendDisabled ? $t('otp:resendIn', { seconds: countdown }) : $t('otp:resend')}
                            </button>
                        </div>

                        <button type="button" onClick={onChangeEmail} className="otp-page__change-email-btn">
                            <ArrowLeft className="w-4 h-4" strokeWidth={2} />
                            {$t('otp:changeEmail')}
                        </button>
                    </div>
                </div>
            </div>
        </Template>
    )
}
