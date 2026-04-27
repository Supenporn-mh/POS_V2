// ─── IMPORTS ─────────────────────────────────────────────────────────────────
import SchoolLogo from '@/assets/images/Logo.png'
import SchoolImage from '@/assets/images/school-bg.jpg'
import LoginLangSwitcher from '@/components/common/LoginLangSwitcher'
import Template from '@/components/common/Template'
import OTPVerification from '@/views/OTPVerification'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ArrowLeft, ArrowRight, Lock, Mail } from 'lucide-react'
import { useState } from 'react'
import { useNavigate } from '@tanstack/react-router'

// ─── FILE-LOCAL CONSTANTS ────────────────────────────────────────────────────
type LoginStep = 'email' | 'forgot' | 'otp'

// ─── COMPONENT ───────────────────────────────────────────────────────────────
export default function LoginPage() {
    // ─── DATA STATE & LIB ────────────────────────────────────────────────────
    const navigate = useNavigate()

    const [step, setStep] = useState<LoginStep>('email')
    const [isLoading, setIsLoading] = useState(false)
    const [formData, setFormData] = useState({ email: '', password: '' })
    const [sessionId, setSessionId] = useState('')

    // ─── METHODS ─────────────────────────────────────────────────────────────
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    const handleSubmit = async (e: React.SubmitEvent) => {
        e.preventDefault()
        if (!formData.email || !formData.password) {
            $toast.error($t('login:validationError'))
            return
        }

        setIsLoading(true)
        try {
            const result = await ApiService.requestOTP(formData.email, formData.password)
            setSessionId(result.sessionId)
            $toast.success($t('login:otpSent'))
            setStep('otp')
        } catch (error) {
            $toast.error(error instanceof Error ? error.message : $t('login:otpSendFailed'))
        } finally {
            setIsLoading(false)
        }
    }

    const handleForgotSubmit = async (e: React.SubmitEvent) => {
        e.preventDefault()
        if (!formData.email) {
            $toast.error($t('login:missingEmail'))
            return
        }

        setIsLoading(true)
        try {
            await ApiService.requestPasswordReset(formData.email)
            $toast.success($t('login:resetSent'))
            setStep('email')
            setFormData({ email: '', password: '' })
        } catch (error) {
            $toast.error(error instanceof Error ? error.message : $t('login:resetFailed'))
        } finally {
            setIsLoading(false)
        }
    }

    const handleVerifyOTP = async (otp: string) => {
        setIsLoading(true)
        try {
            const result = await ApiService.verifyOTP(formData.email, sessionId, otp)
            if (result.accessToken) {
                localStorage.setItem('access_token', result.accessToken)
            }
            $toast.success($t('login:loginSuccess'))
            navigate({ to: '/' })
        } catch (error) {
            $toast.error(error instanceof Error ? error.message : $t('login:otpVerifyFailed'))
        } finally {
            setIsLoading(false)
        }
    }

    const handleResendOTP = async () => {
        try {
            const result = await ApiService.requestOTP(formData.email, formData.password)
            setSessionId(result.sessionId)
        } catch (error) {
            $toast.error(error instanceof Error ? error.message : $t('login:otpSendFailed'))
        }
    }

    const handleChangeEmail = () => {
        setStep('email')
        setSessionId('')
        setFormData({ email: '', password: '' })
    }

    // ─── RENDER ──────────────────────────────────────────────────────────────
    if (step === 'otp') {
        return (
            <OTPVerification
                email={formData.email}
                isLoading={isLoading}
                onVerify={handleVerifyOTP}
                onResend={handleResendOTP}
                onChangeEmail={handleChangeEmail}
            />
        )
    }

    const isForgot = step === 'forgot'

    return (
        <Template>
            <div className="login-page">
                <div className="login-page__hero">
                    <img src={SchoolImage} alt="School Background" className="login-page__hero-image" />
                </div>

                <div className="login-page__panel">
                    <LoginLangSwitcher />

                    <div className="login-page__card-area">
                        <div className="login-page__card">
                            <div className="login-page__logo-wrap">
                                <img src={SchoolLogo} alt="King's College" className="login-page__logo" />
                            </div>
                            <div className="login-page__header">
                                <h1 className="login-page__title">
                                    {$t(isForgot ? 'login:forgotTitle' : 'login:title')}
                                </h1>
                                <p className="login-page__subtitle">
                                    {$t(isForgot ? 'login:forgotSubtitle' : 'login:subtitle')}
                                </p>
                            </div>
                            <form
                                className="login-page__form"
                                onSubmit={isForgot ? handleForgotSubmit : handleSubmit}
                            >
                                <div className="login-page__field">
                                    <label htmlFor="email" className="login-page__label">
                                        {$t('login:email')}
                                    </label>
                                    <div className="login-page__input-wrap">
                                        <Mail className="login-page__input-icon" />
                                        <Input
                                            id="email"
                                            type="email"
                                            value={formData.email}
                                            name="email"
                                            onChange={handleInputChange}
                                            autoComplete="email"
                                            placeholder={$t('login:emailPlaceholder')}
                                            className="login-page__input border border-gray-300 rounded-lg"
                                        />
                                    </div>
                                </div>

                                {!isForgot && (
                                    <>
                                        <div className="login-page__field login-page__field--tight">
                                            <label htmlFor="password" className="login-page__label">
                                                {$t('login:password')}
                                            </label>
                                            <div className="login-page__input-wrap">
                                                <Lock className="login-page__input-icon" />
                                                <Input
                                                    id="password"
                                                    type="password"
                                                    name="password"
                                                    value={formData.password}
                                                    onChange={handleInputChange}
                                                    autoComplete="current-password"
                                                    placeholder={$t('login:passwordPlaceholder')}
                                                    className="login-page__input border border-gray-300 rounded-lg"
                                                />
                                            </div>
                                        </div>

                                        <div className="login-page__forgot-wrap">
                                            <button
                                                type="button"
                                                className="login-page__forgot-btn"
                                                onClick={() => setStep('forgot')}
                                            >
                                                {$t('login:forgotPassword')}
                                            </button>
                                        </div>
                                    </>
                                )}

                                <Button type="submit" disabled={isLoading} className="login-page__submit rounded-lg">
                                    {isLoading ? (
                                        <span className="flex items-center justify-center gap-2">
                                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                            {$t(isForgot ? 'login:sending' : 'login:signingIn')}
                                        </span>
                                    ) : (
                                        <span className="flex items-center justify-center gap-2">
                                            {$t(isForgot ? 'login:sendReset' : 'login:continues')}
                                            <ArrowRight className="w-5 h-5" />
                                        </span>
                                    )}
                                </Button>
                            </form>

                            {isForgot && (
                                <div className="login-page__back-wrap">
                                    <button
                                        type="button"
                                        className="login-page__back-btn"
                                        onClick={() => {
                                            setStep('email')
                                            setFormData({ email: '', password: '' })
                                        }}
                                    >
                                        <ArrowLeft className="w-4 h-4" />
                                        {$t('login:backToLogin')}
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="login-page__footer">
                        <p className="login-page__footer-text">{$t('login:footerTitle')}</p>
                        <p className="login-page__footer-text login-page__footer-text--copy">
                            {$t('login:footerCopy')}
                        </p>
                    </div>
                </div>
            </div>
        </Template>
    )
}
