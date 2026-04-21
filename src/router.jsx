import { createBrowserRouter, RouterProvider, Outlet } from 'react-router-dom'
import App from './App.jsx'
import LocationPage from './LocationPage.jsx'
import BlogPage from './BlogPage.jsx'
import {
  BenefitsPage,
  DeliveryAreasPage,
  AboutMicrogreensPage,
  ShopPage,
  HowItWorksPage,
  TestimonialsPage,
  FaqPage,
} from './SectionPages.jsx'
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
      { path: 'benefits', element: <BenefitsPage /> },
      { path: 'delivery-areas', element: <DeliveryAreasPage /> },
      { path: 'about-microgreens', element: <AboutMicrogreensPage /> },
      { path: 'shop', element: <ShopPage /> },
      { path: 'how-it-works', element: <HowItWorksPage /> },
      { path: 'testimonials', element: <TestimonialsPage /> },
      { path: 'faq', element: <FaqPage /> },
    ],
  },
])

export default function Router() {
  return <RouterProvider router={router} />
}