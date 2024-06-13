import { About, Docs, Home, NotFound } from '@/pages'

const routes = [
    {
        name: 'Home',
        path: '/',
        element: <Home />,
        meta: {
            navbar: { order: 1, type: 'topbar' }
        }
    },
    {
        name: 'About',
        path: '/about',
        element: <About />,
        meta: {
            navbar: { order: 2, type: 'topbar' }
        }
    },
    {
        name: 'Docs',
        path: '/docs',
        element: <Docs />,
        meta: {
            navbar: { order: 3, type: 'topbar' }
        }
    },
    {
        name: '404',
        path: '*',
        element: <NotFound />,
        meta: { navbar: undefined }
    }
]

export default routes