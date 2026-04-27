import App from '@/main'
import AppLayout from '@/layouts/AppLayout'
import DashboardPage from '@/views/DashboardPage'
import LoginPage from '@/views/LoginPage'
import NotFoundPage from '@/views/NotFoundPage'
import { createRootRoute, createRoute, createRouter } from '@tanstack/react-router'

const rootRoute = createRootRoute({ component: App })

const loginRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: '/login',
    component: LoginPage,
})

const layoutRoute = createRoute({
    getParentRoute: () => rootRoute,
    id: 'app-layout',
    component: AppLayout,
})

const childrenRoute = [
    {
        path: '/',
        component: DashboardPage,
    },
]

const routeTree = rootRoute.addChildren([
    loginRoute,
    layoutRoute.addChildren(
        childrenRoute.map((route) =>
            createRoute({
                getParentRoute: () => layoutRoute,
                ...route,
            })
        )
    ),
])

export default createRouter({ routeTree, defaultNotFoundComponent: NotFoundPage })
