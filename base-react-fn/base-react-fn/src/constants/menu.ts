import { BarChart3 } from 'lucide-react'
import type { ComponentType } from 'react'

export interface MenuItem {
    id: string
    path: string
    labelKey: string
    icon: ComponentType<{ className?: string }>
}

export const menuItems = {
    general: [
        { id: 'dashboard', path: '/', labelKey: 'menu:dashboard', icon: BarChart3 },
    ],
} satisfies Record<string, MenuItem[]>

export type MenuSection = keyof typeof menuItems

export const menuSections: { key: MenuSection; labelKey: string }[] = [
    { key: 'general', labelKey: 'menu:sectionGeneral' },
]
