// ─── IMPORTS ─────────────────────────────────────────────────────────────────
import { Globe } from 'lucide-react'

// ─── COMPONENT ───────────────────────────────────────────────────────────────
export default function LoginLangSwitcher() {
    // ─── RENDER ──────────────────────────────────────────────────────────────
    return (
        <div style={{ position: 'absolute', top: '20px', right: '20px', zIndex: 10 }}>
            <div
                style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '6px 12px',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    background: 'white',
                    fontSize: '13px',
                    fontFamily: "'Lato', sans-serif",
                }}
            >
                <Globe style={{ width: '14px', height: '14px', color: '#6b7280' }} />
                <button
                    onClick={() => $setLocale('th')}
                    style={{
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        padding: '0 2px',
                        fontSize: '13px',
                        fontFamily: "'Lato', sans-serif",
                        fontWeight: $currentLang === 'th' ? '700' : '400',
                        color: $currentLang === 'th' ? '#111827' : '#9ca3af',
                    }}
                >
                    TH
                </button>
                <span style={{ color: '#e5e7eb' }}>|</span>
                <button
                    onClick={() => $setLocale('en')}
                    style={{
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        padding: '0 2px',
                        fontSize: '13px',
                        fontFamily: "'Lato', sans-serif",
                        fontWeight: $currentLang === 'en' ? '700' : '400',
                        color: $currentLang === 'en' ? '#111827' : '#9ca3af',
                    }}
                >
                    EN
                </button>
            </div>
        </div>
    )
}
