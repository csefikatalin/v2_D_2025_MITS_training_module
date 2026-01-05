# A feladat megoldásának lépései - instrukciók

## Telepítés

1. react projekt létrehozása
2. axios
3. react-router

## Mappa és fájlstruktúra

```text
src/
├── pages/
│   ├── Layout.js
│   ├── Navigation.js
│   │
│   ├── LoginPage.js
│   ├── RegistrationPage.js
│   │
│   ├── NoPage.js
│   │
│   ├── DashboardPage.js
│   ├── CoursesPage.js
│   ├── CourseDetailsPage.js
│   ├── BookedSessionPage.js
│   └── MentorsPage.js
│
├── components/
│
└── contexts/
```

## Layout és a navigáció kialakítása

<img src="../assets/wireframes/03-dashboard.png" alt="dashboard">

1. navigáció: a-tag helyett NavLink to
2. Layout - a Navigation komponens kerüljön pl a header-be, **Outlet** kerüljön a **main**-be
3. App.js- createBrowserRouter és a RouterProvider használata

**nyilvános route**-ok: **login** és a **regisztráció**, ezért ezek nem a Layout alatt vannak! Nem lesznek tokennel védve, míg a layout alatt lévő menüpontokat majd tokennel védjk.

```javascript
import logo from "./logo.svg";
import "./App.css";
import { createBrowserRouter, Navigate, RouterProvider } from "react-router";
import Layout from "./pages/Layout";
import NoPage from "./pages/NoPage";
import DashboardPage from "./pages/DashboardPage";
import CoursesPage from "./pages/CoursesPage";
import MentorsPage from "./pages/MentorsPage";
import LoginPage from "./pages/LoginPage";
import RegistrationPage from "./pages/RegistrationPage";
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
          path: "/courses",
          element: <CoursesPage />,
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
  return <RouterProvider router={router} />;
}

export default App;
```

4. Lesz egy CourseDetailPage oldalunk. Itt a konkrét kurzus részleteit olvashatjuk majd. A curzust az ID-vel azonosítjuk.
   Ezért kell egy újabb route. A "courses" path ígymódosul:

```javascript
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
```

## Formázás készítése a mintának megfelelelően

Külön navigation.css-t készíts!

# 1. Login és regisztrációs űrlapok

<a href="01_login_es_regisztracio.md">Login és regisztrációs formok elkészítése validációval</a>

# 2. Oldalak drótvázai

<a href="01_oldalak_wireframe.md">Az egyes oldalak vázának elkészítése (pages és components)</a>

# 3. Autentikáció és bejelentkezés

<a href="02_Authentication.md">Login és regisztráció, autentikáció megvalósítása context segítségével</a>

# 4. Dashboard elkésztése,  Chart.js használata

<a href="03_dashboard.md">Dashboard user adatok lekérdezése és a Chart.js használata</a>

# 5. Courses és a CourseDetailspage

# 7. MentorsPage és a BookedSessionPage

# 8. LinkedIn beillesztése

# 9. Polling


