import type { IconName } from '@/components'
import type { ComponentType, LazyExoticComponent } from 'react'
import { useNavigate } from 'react-router-dom'

export interface RouteComponentProps {
    navigate: ReturnType<typeof useNavigate>
}

// Support both static and lazy-loaded components for flexibility
// Static imports are preferred for SSR with renderToString
// Lazy imports can be used for client-side code splitting when not using SSR
export type RouteComponent = ComponentType<RouteComponentProps> | LazyExoticComponent<ComponentType<{}>>

export type RouteType = 'page' | 'group' | 'redirect'

interface MetaNavbar {
    icon?: IconName
    order?: number
}

interface BaseRoute {
    name: string
    path?: string
    index?: true
    errorElement?: RouteComponent
    meta?: {
        isProtectedRoute?: boolean
        navbar?: MetaNavbar
        navbarIcon?: IconName
        order?: number
        redirection?: string
    }
}

export interface IndexRoute extends BaseRoute {
    index: true
    type: 'page'
    element: RouteComponent
}

export interface IndexRedirectRoute extends BaseRoute {
    index: true
    type: 'redirect'
}

export interface PageRoute extends BaseRoute {
    type: 'page'
    path: string
    element: RouteComponent
}

export interface GroupRoute extends BaseRoute {
    type: 'group'
    children: Route[]
}

export interface RedirectRoute extends BaseRoute {
    type: 'redirect'
    path: string
}

export type Route = IndexRoute | IndexRedirectRoute | PageRoute | GroupRoute | RedirectRoute

export interface IconProps {
    className?: string
    name?: IconName
    size?: number
    color?: string
    variant?: string
}
