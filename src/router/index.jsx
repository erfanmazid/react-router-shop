import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Layout from "../layout";
import Home from "../pages/HomePage";
import NotFoundPage from "../pages/NotFoundPage";
import ProductsPage from "../pages/ProductsPage";

export const router = createBrowserRouter([
  {
    element: <Layout />,
    errorElement: <NotFoundPage />,
    children: [
      {
        // index: true,
        path: "/",
        element: <Home />,
      },
      {
        path: "/products",
        element: <ProductsPage />,
        // loader: productsLoader,
      },
      {},
    ],
  },
]);
export const AppRoute = () => {
  return <RouterProvider router={router} />;
};
