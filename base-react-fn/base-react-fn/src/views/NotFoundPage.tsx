// ─── COMPONENT ───────────────────────────────────────────────────────────────
export default function NotFoundPage() {
    // ─── RENDER ──────────────────────────────────────────────────────────────
    return (
        <div className="flex min-h-screen flex-col items-center justify-center gap-4 text-center">
            <h1 className="text-6xl font-light tracking-tight">404</h1>
            <p className="text-sm text-muted-foreground">Page not found</p>
        </div>
    )
}
