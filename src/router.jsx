import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import App from './App.jsx'
import Home from './pages/Home.jsx'
import ProductPage from './pages/ProductPage.jsx'
import SubscribePage from './pages/SubscribePage.jsx'
import ShopPage from './pages/ShopPage.jsx'
import WhyPage from './pages/WhyPage.jsx'
import FaqPage from './pages/FaqPage.jsx'
import './index.css'

const router = createBrowserRouter([
  { 
    path: '/', 
    element: <App />,
    children: [
      { path: '/', element: <Home /> },
      { path: '/shop', element: <ShopPage /> },
      { path: '/shop/:productId', element: <ProductPage /> },
      { path: '/subscribe', element: <SubscribePage /> },
      { path: '/why', element: <WhyPage /> },
      { path: '/faq', element: <FaqPage /> }
    ]
  },
])

export default function Router() {
  return <RouterProvider router={router} />
}