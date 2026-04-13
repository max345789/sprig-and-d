import { createBrowserRouter, RouterProvider, Outlet, Link, useLocation } from 'react-router-dom'
import App from './App.jsx'
import LocationPage from './LocationPage.jsx'
import BlogPage from './BlogPage.jsx'
import './index.css'

function Layout() {
  return (
    <>
      <Outlet />
    </>
  )
}

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      { index: true, element: <App /> },
      { path: 'microgreens-pattambi', element: <LocationPage location="pattambi" /> },
      { path: 'microgreens-valanchery', element: <LocationPage location="valanchery" /> },
      { path: 'microgreens-pallipuram', element: <LocationPage location="pallipuram" /> },
      { path: 'microgreens-pulamanthole', element: <LocationPage location="pulamanthole" /> },
      { path: 'blog/:slug', element: <BlogPage /> },
    ],
  },
])

export default function Router() {
  return <RouterProvider router={router} />
}