# Oldalak alapszerkezetének kialakítása és formázása css-sel

## Dashboard

<img src="../assets/wireframes/03-dashboard.png" alt="dashboard">

## Courses

<img src="../assets/wireframes/04-courses.png" alt="courses">

Ehhez szükségünk lesz:

- CourseSearch.js komponensre is.
- Course.js komponensre is.

## CoursesDetails

<img src="../assets/wireframes/05-course-details.png" alt="course details">

Az oldal eléréséhez ki kell egészíteni az App.js.ben a router-t.

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

A vissza az előző oldalra gomb:

1. Használjuk hozzá a useNavigate hook-ot.
   const navigate = useNavigate();
2. a gomb eseménykezelőjében pedig a navigate(-1) függvényt.

```javascript
<button className="keret padding" onClick={() => navigate(-1)}>
  Back to course
</button>
```
3. Teszteld, hogy működik-e az oldal:  http://localhost:3000/courses/1
4. Navigáció készítése a Courses oldalon az enroll gombra kattintva. Ehhez a Course.js komponensben kell az alábi kódokat elhelyezni:

- Használd a useNavigate hookot:   const navigate = useNavigate();
 - A gombra: 
```javascript
onClick={() => {
    enroll();
}}
```
- Az enroll függvényben: 
```javascript
 function enroll() {
 
    navigate(`/courses/1`);
  }
```

## Mentors

<img src="../assets/wireframes/06 -mentors.png" alt="mentors">

Ehhez létrehozunk egy Mentor komponenst is.

## Mentors - Booked session

<img src="../assets/wireframes/07-booked-sessions.png" alt="Booked session">
