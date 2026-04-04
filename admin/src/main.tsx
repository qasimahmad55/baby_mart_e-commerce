
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { createBrowserRouter, Navigate, RouterProvider } from 'react-router'
import Login from './pages/Login.tsx'
import Register from './pages/Register.tsx'
import Dashboard from './pages/Dashboard.tsx'
import Account from './pages/Account.tsx'
import Orders from './pages/Orders.tsx'
import Invoices from './pages/Invoices.tsx'
import Products from './pages/Products.tsx'
import Banenrs from './pages/Banners.tsx'
import Categories from './pages/Categories.tsx'
import Brands from './pages/Brands.tsx'
import UsersPage from './pages/Users.tsx'
const router = createBrowserRouter([
  { path: "/login", element: < Login /> },
  { path: "/register", element: <Register /> },
  { path: "/", element: <Navigate to="/dashboard" replace /> },
  {
    path: "/dashboard",
    element: <App />,
    children: [
      { index: true, element: <Dashboard /> },
      { path: "account", element: <Account /> },
      { path: "users", element: <UsersPage /> },
      { path: "orders", element: < Orders /> },
      { path: "invoices", element: <Invoices /> },
      { path: "products", element: <Products /> },
      { path: "banners", element: <Banenrs /> },
      { path: "categories", element: <Categories /> },
      { path: "brands", element: <Brands /> },
    ],
  }
])
createRoot(document.getElementById('root')!).render(
  <RouterProvider router={router} />
)
