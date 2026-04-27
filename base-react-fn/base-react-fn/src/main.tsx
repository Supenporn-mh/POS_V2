import { Outlet, RouterProvider } from '@tanstack/react-router'
import { Agentation } from 'agentation'
import { createRoot } from 'react-dom/client'
import { useTranslation } from 'react-i18next'
import Toaster, { toast } from './components/ui/sonner'
import locale from './locales'
import apiService from './plugins/apiService'
import router from './routers'
import store from './stores/global'

import './assets/themes/globals.scss'
import './assets/themes/main.css'
import Template from './components/common/Template'
import { LoadingOverlay } from './components/ui/loading'
import { use, useEffect, useState } from 'react'

declare global {
    var ApiService: typeof apiService
    var $t: ReturnType<typeof useTranslation>['t']
    var $setLocale: (locale: string) => void
    var $currentLang: string
    var $toast: typeof toast
    var $store: ReturnType<typeof store.getState>
}

globalThis.ApiService = apiService
globalThis.$t = locale.t.bind(locale)
globalThis.$currentLang = locale.language
globalThis.$toast = toast
globalThis.$store = store.getState()

const container = document.getElementById('root')!
let root = (window as any).__root
if (!root) {
    root = createRoot(container)
    ;(window as any).__root = root
}
const renderApp = () => {
    root.render(<RouterProvider key={globalThis.$currentLang} router={router} />)
}
globalThis.$setLocale = (lang: string) => {
    locale.changeLanguage(lang)
    globalThis.$t = locale.t.bind(locale)
    globalThis.$currentLang = lang
    renderApp()
}

renderApp()

export default function App() {
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        const unsubscribe = store.subscribe(() => {
            const state = store.getState()
            if (state.screenLoading !== loading) {
                setLoading(state.screenLoading)
            }
        })
        return () => unsubscribe()
    }, [loading])

    return (
        <Template>
            <LoadingOverlay visible={loading} />
            <Outlet />
            <Toaster position="top-right" richColors />
            {import.meta.env.DEV && <Agentation />}
        </Template>
    )
}
