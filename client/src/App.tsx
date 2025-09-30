import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { Login } from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import Administration from "./pages/Administration";
import Navigation from "./layout/Navigation";
import { AdminRoute } from "./routes/AdminRoute";
import { AuthenticatedRoute } from "./routes/AuthenticatedRoute";
import NotFound from "./pages/NotFound";
import Dashboard from "./pages/Dashboard";
import TestCollectionPage from "./pages/TestCollectionPage";
import Collection from "./pages/Collection";

const router = createBrowserRouter([
  {
    element: <Navigation />,
    errorElement: <NotFound />,
    children: [
      {
        path: "/",
        element: <Home />,
        errorElement: <NotFound />,
      },
      {
        path: "/administration",
        element: (
          <AdminRoute>
            <Administration />
          </AdminRoute>
        ),
        errorElement: <NotFound />,
      },
      {
        path: "/dashboard",
        element: (
          <AuthenticatedRoute>
            <Dashboard />
          </AuthenticatedRoute>
        ),
        errorElement: <NotFound />,
      },
      {
        path: "/collection",
        element: (
          <AuthenticatedRoute>
            <Collection />
          </AuthenticatedRoute>
        ),
        errorElement: <NotFound />,
      },
    ],
  },
  {
    path: "/login",
    element: <Login />,
    errorElement: <NotFound />,
  },
  {
    path: "/register",
    element: <Register />,
    errorElement: <NotFound />,
  },
]);

const App = () => {
  return <RouterProvider router={router} />;
};

export default App;
