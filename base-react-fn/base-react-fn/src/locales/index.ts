import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

const localeModules = import.meta.glob<Record<string, string>>('./**/*.json', { eager: true })

type Resources = Record<string, Record<string, Record<string, string>>>

const resources: Resources = {}

for (const [filePath, module] of Object.entries(localeModules)) {
    // path looks like "./en/login.json"
    const parts = filePath.split('/')
    const lang = parts[1] // "en" or "th"
    const nsFile = parts[2] // "login.json"
    const ns = nsFile.replace('.json', '')

    if (!resources[lang]) resources[lang] = {}
    resources[lang][ns] = module
}

// ─── Collect all namespace names ──────────────────────────────────────────────
const allNamespaces = [...new Set(Object.values(resources).flatMap((langRes) => Object.keys(langRes)))]

i18n.use(initReactI18next).init({
    resources,
    fallbackLng: 'en',
    ns: allNamespaces,
    defaultNS: 'web',

    interpolation: {
        escapeValue: false,
    },

    saveMissing: import.meta.env.DEV,
    missingKeyHandler: import.meta.env.DEV
        ? (lngs, ns, key) => {
              console.warn(`[i18n] Missing key: ${ns}.${key} (${lngs.join(',')})`)
          }
        : undefined,
})

export default i18n
