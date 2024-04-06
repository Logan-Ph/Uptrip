import { createBrowserRouter, RouterProvider, Outlet } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
import Homepage from "../pages/Homepage";
import Login from "../pages/Login";
import Admin from "../pages/Admin";
import Unauthorized from "../pages/Unauthorized";
import PersistAndRequireAuth from "./PersistAndRequireAuth";
import VerifyEmail from "../pages/VerifyEmail";
import PageNotFound from "../pages/PageNotFound";
import SignUp from "../pages/SignUp";
import QuickSearch from '../pages/QuickSearch'

export default function Router() {
  const UserLayout = ({ header, footer }) => {
    return (
      <>
        {header}
        <Outlet />
        {footer}
      </>
    );
  };

  const BrowserRoutes = createBrowserRouter([
    {
      path: "/",
      element: <UserLayout header={<Header />} footer={<Footer />} />,
      children: [
        {
          path: "/",
          element: <Homepage />,
        },
        {
          path: "/unauthorized",
          element: <Unauthorized />,
        },
		{
			path: "/quick-search",
			element: <QuickSearch />
		},
        {
          path: "/",
          element: <PersistAndRequireAuth />,
          children: [
            {
              path: "/admin",
              element: <Admin />,
            },
          ],
        },
      ],
    },
    {
      path: "user/:token/verify-email",
      element: <VerifyEmail />,
    },
    {
      path: "/signup",
      element: <SignUp />,
    },
    {
      path: "/login",
      element: <Login />,
    },
    {
      path: "*",
      element: <PageNotFound />,
    },
  ]);

  return <RouterProvider router={BrowserRoutes} />;
}
