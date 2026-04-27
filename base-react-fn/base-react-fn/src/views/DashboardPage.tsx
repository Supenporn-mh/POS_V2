// ─── IMPORTS ─────────────────────────────────────────────────────────────────
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

// ─── COMPONENT ───────────────────────────────────────────────────────────────
export default function DashboardPage() {
    // ─── RENDER ──────────────────────────────────────────────────────────────
    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-3 md:p-6 rounded-xl border border-gray-100 shadow-sm">
                <div>
                    <h2 className="text-xl font-semibold">{$t('menu:dashboard')}</h2>
                    <p className="text-sm text-muted-foreground">{$t('menu:appTagline')}</p>
                </div>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Welcome</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-sm text-muted-foreground">Dashboard content goes here.</p>
                </CardContent>
            </Card>
        </div>
    )
}
