import { createBrowserRouter, RouterProvider, Outlet } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ProductDetails from "./pages/ProductDetails";
import AddProduct from "./admin/AddProduct";
import EditProduct from "./admin/EditProduct";
import ProductList from "./admin/ProductList";
import AdminDashboard from "./admin/AdminDashboard";
import AdminLayout from "./admin/AdminLayout";
import Orders from "./admin/Orders";
import Customers from "./admin/Customers";
import Analytics from "./admin/Analytics";
import Settings from "./admin/Settings";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Cart from "./pages/Cart";
import CheckoutAddress from "./pages/CheckoutAddress";
import Checkout from "./pages/Checkout";
import OrderSuccess from "./pages/OrderSuccess";

function Layout() {
  return (
    <>
      <Navbar />
      <Outlet />
      <Footer />
    </>
  );
}

const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      { path: "/", element: <Home /> },
      { path: "/login", element: <Login /> },
      { path: "/signup", element: <Signup /> },
      { path: "/product/:id", element: <ProductDetails /> },
      { path: "/cart", element: <Cart /> },
      { path: "/checkout-address", element: <CheckoutAddress /> },
      { path: "/checkout", element: <Checkout /> },
      { path: "/order-success/:id", element: <OrderSuccess /> },
      { path: "*", element: <h1 className="text-center py-20 text-2xl font-bold text-gray-500">Page Not Found</h1> },
    ],
  },
  {
    path: "/admin",
    element: <AdminLayout />,
    children: [
      { index: true, element: <AdminDashboard /> },
      { path: "products", element: <ProductList /> },
      { path: "products/add", element: <AddProduct /> },
      { path: "products/update/:id", element: <EditProduct /> },
      { path: "orders", element: <Orders /> },
      { path: "customers", element: <Customers /> },
      { path: "analytics", element: <Analytics /> },
      { path: "settings", element: <Settings /> },
    ],
  },
]);

export default function App() {
  return <RouterProvider router={router} />;
}
