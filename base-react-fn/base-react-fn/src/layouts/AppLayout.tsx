// ─── IMPORTS ─────────────────────────────────────────────────────────────────
import { Button } from '@/components/ui/button'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarProvider,
    SidebarTrigger,
} from '@/components/ui/sidebar'
import { menuItems, menuSections, type MenuSection } from '@/constants/menu'
import { Outlet, useNavigate, useRouterState } from '@tanstack/react-router'
import { ChevronDown, ChevronsUpDown, Globe, LayoutGrid, LogOut, UserCog } from 'lucide-react'
import { useState } from 'react'

// ─── FILE-LOCAL CONSTANTS ────────────────────────────────────────────────────
const defaultOpenGroups: Record<MenuSection, boolean> = {
    general: true,
}

function getPageTitle(pathname: string): string {
    const allItems = Object.values(menuItems).flat()
    const match = allItems.find((item) => item.path === pathname)
    return match ? $t(match.labelKey) : ''
}

// ─── COMPONENT ───────────────────────────────────────────────────────────────
export default function AppLayout() {
    // ─── DATA STATE & LIB ────────────────────────────────────────────────────
    const navigate = useNavigate()
    const { location } = useRouterState()
    const activePath = location.pathname

    const [openGroups, setOpenGroups] = useState<Record<string, boolean>>(defaultOpenGroups)

    // ─── METHODS ─────────────────────────────────────────────────────────────
    const toggleGroup = (group: string) => {
        setOpenGroups((prev) => ({ ...prev, [group]: !prev[group] }))
    }

    const handleLogout = () => {
        localStorage.removeItem('access_token')
        navigate({ to: '/login' })
    }

    const toggleLanguage = () => {
        $setLocale($currentLang === 'en' ? 'th' : 'en')
    }

    // ─── RENDER ──────────────────────────────────────────────────────────────
    return (
        <SidebarProvider style={{ '--sidebar-width': '18rem' } as React.CSSProperties}>
            <div className="flex h-screen w-full">
                <Sidebar className="border-r">
                    <SidebarHeader className="p-4">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                                <LayoutGrid className="w-5 h-5 text-primary-foreground" />
                            </div>
                            <div>
                                <h2 className="font-semibold">{$t('menu:appName')}</h2>
                                <p className="text-xs text-muted-foreground">{$t('menu:appTagline')}</p>
                            </div>
                        </div>
                    </SidebarHeader>

                    <SidebarContent>
                        {menuSections.map(({ key, labelKey }) => {
                            const items = menuItems[key]
                            if (!items?.length) return null

                            return (
                                <Collapsible key={key} open={openGroups[key]} onOpenChange={() => toggleGroup(key)}>
                                    <SidebarGroup>
                                        <CollapsibleTrigger className="w-full">
                                            <SidebarGroupLabel className="flex items-center justify-between cursor-pointer hover:bg-accent/50 rounded-md px-2 py-1.5 text-sm font-semibold">
                                                {$t(labelKey)}
                                                <ChevronDown
                                                    className={`w-4 h-4 transition-transform duration-200 ${
                                                        openGroups[key] ? 'rotate-180' : ''
                                                    }`}
                                                />
                                            </SidebarGroupLabel>
                                        </CollapsibleTrigger>
                                        <CollapsibleContent>
                                            <SidebarGroupContent>
                                                <SidebarMenu>
                                                    {items.map((item) => (
                                                        <SidebarMenuItem key={item.id}>
                                                            <SidebarMenuButton
                                                                onClick={() => navigate({ to: item.path })}
                                                                isActive={activePath === item.path}
                                                            >
                                                                <item.icon className="w-4 h-4" />
                                                                <span>{$t(item.labelKey)}</span>
                                                            </SidebarMenuButton>
                                                        </SidebarMenuItem>
                                                    ))}
                                                </SidebarMenu>
                                            </SidebarGroupContent>
                                        </CollapsibleContent>
                                    </SidebarGroup>
                                </Collapsible>
                            )
                        })}
                    </SidebarContent>

                    <SidebarFooter className="p-3">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button
                                    variant="ghost"
                                    className="w-full justify-between h-[35px] px-4 rounded-xl bg-gradient-to-r from-gray-50 to-gray-100 hover:from-gray-100 hover:to-gray-150 border border-gray-200 shadow-sm hover:shadow-md group transition-all duration-200"
                                >
                                    <span className="font-bold text-sm text-gray-900">Admin</span>
                                    <ChevronsUpDown className="h-4 w-4 text-gray-400 group-hover:text-gray-600 transition-colors" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-56 bg-white" side="right" align="end" sideOffset={8}>
                                <div className="p-1">
                                    <DropdownMenuItem className="flex items-center gap-2 px-3 py-2 cursor-pointer">
                                        <UserCog className="w-4 h-4 text-muted-foreground" />
                                        <span className="text-sm">{$t('menu:profile')}</span>
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem
                                        onClick={handleLogout}
                                        className="flex items-center gap-2 px-3 py-2 cursor-pointer text-red-600"
                                    >
                                        <LogOut className="w-4 h-4" />
                                        <span className="text-sm">{$t('menu:logOut')}</span>
                                    </DropdownMenuItem>
                                </div>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </SidebarFooter>
                </Sidebar>

                <main className="flex-1 flex flex-col min-w-0">
                    <header className="border-b p-2 md:p-4 flex items-center gap-2 md:gap-4">
                        <SidebarTrigger />
                        <div className="flex-1 min-w-0">
                            <h1 className="text-sm md:text-lg font-semibold truncate">{getPageTitle(activePath)}</h1>
                        </div>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={toggleLanguage}
                            className="flex items-center gap-1 md:gap-2 shrink-0"
                        >
                            <Globe className="w-4 h-4" />
                            <span className="hidden sm:inline">{$currentLang === 'en' ? 'EN' : 'TH'}</span>
                        </Button>
                    </header>

                    <div className="flex-1 min-h-0 p-3 md:p-6 flex flex-col" data-content-area>
                        <Outlet />
                    </div>
                </main>
            </div>
        </SidebarProvider>
    )
}
