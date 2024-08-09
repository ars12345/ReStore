import { createBrowserRouter } from 'react-router-dom'
import App from '../layouts/App'
import { Homepage } from '../../features/home/Homepage'
import { Catalog } from '../../features/catalog/Catalog'
import { ProductDetails } from '../../features/catalog/ProductDetails'
import { ABoutPage } from '../../features/about/AboutPage'
import { ContactPage } from '../../features/contact/ContactPage'

export const router = createBrowserRouter([
    {
        path: '/',
        element: <App />,
        children: [
            {path: '', element: <Homepage/>},
            {path: '/catalog', element: <Catalog/>},
            {path: '/catalog/:id', element: <ProductDetails/>},
            {path: '/about', element: <ABoutPage/>},
            {path: '/contact', element: <ContactPage/>},
        ]
    }
])
