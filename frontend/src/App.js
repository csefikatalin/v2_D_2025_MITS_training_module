import "./App.css";
import { createBrowserRouter, Navigate, RouterProvider } from "react-router";
import Layout from "./pages/Layout";
import NoPage from "./pages/NoPage";
import DashboardPage from "./pages/DashboardPage";
import CoursesPage from "./pages/CoursesPage";
import MentorsPage from "./pages/MentorsPage";
import LoginPage from "./pages/LoginPage";
import RegistrationPage from "./pages/RegistrationPage";
import CourseDetailsPage from "./pages/CourseDetailsPage";
import { AuthProvider } from "./contexts/AuthContext";
import authMiddleware from "./middleware/autMiddleware";
function App() {
  const router = createBrowserRouter([
    {
      path: "/login",
      element: <LoginPage />,
    },
    {
      path: "/register",
      element: <RegistrationPage />,
    },
    {
      path: "/",
      element: <Layout />,
      middleware: [authMiddleware],
      children: [
        {
          index: true,
          element: <Navigate to="/dashboard" replace />,
        },
        {
          path: "/dashboard",
          element: <DashboardPage />,
        },
        {
          path: "courses",
          children: [
            {
              index: true,
              element: <CoursesPage />,
            },
            {
              path: ":id",
              element: <CourseDetailsPage />,
            },
          ],
        },
        {
          path: "/courses/{id}",
          element: <CourseDetailsPage />,
        },
        {
          path: "/mentors",
          element: <MentorsPage />,
        },
      ],
    },
    {
      path: "*",
      element: <NoPage />,
    },
  ]);
  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  );
}

export default App;
