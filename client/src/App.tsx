import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { Login } from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import AdminDashboard from "./pages/AdminDashboard";
import Navigation from "./layout/Navigation";
import { AdminRoute } from "./components/AdminRoute";
import NotFound from "./pages/NotFound";

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
        path: "admin/dashboard",
        element: (
          <AdminRoute>
            <AdminDashboard />
          </AdminRoute>
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
