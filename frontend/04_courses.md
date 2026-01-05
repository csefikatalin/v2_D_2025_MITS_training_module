# Courses oldal elkészítése


## 1. CoursesContext elkészítése

A szűrés és a keresés  miatt szükség lesz egy filteredList state-re is.
A végpont kérésekor ne felejtsd el az authHeaders függvényünk segítéségel a tokent is elküldeni. 

Megírjuk a get kérést a Cursus és az adott id-vel rendelkező kurzus lekéréshez

```javascript
import myAxios, { getAuthHeaders } from "../services/api";
import { createContext, useEffect, useState } from "react";

// 1. Context létrehozása
export const CoursesContext = createContext();

// 2. Provider komponens
export function CoursesProvider({ children }) {
  const [coursesList, setCoursesList] = useState([]);
  const [filteredList, setFilteredList] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState([]);
  const [serverError, setServerError] = useState([]);
  const [loading, setLoading] = useState(true);
  
  function getCourses() {
    setLoading(true);
    myAxios
      .get("/courses", { headers: getAuthHeaders() })
      .then((response) => {
        setCoursesList(response.data.courses);
        setFilteredList(response.data.courses);
    
      })
      .catch((error) => {
        console.log(error);
        setServerError(error)
      })
      .finally(() => setLoading(false));
  }
  function getCourseById(id) {
      console.log(id)
    setLoading(true);
    myAxios
      .get(`/courses/${id}`, { headers: getAuthHeaders() })
      .then((response) => {
          
          setSelectedCourse(response.data)
      })
      .catch((error) => {
          console.log(error);
          setServerError(error)
      })
      .finally(() => setLoading(false));
  }
  

  return (
    <CoursesContext.Provider
      value={{ getCourses, filteredList, loading, szuro,completeChapter, enrollCourse, selectedCourse,getCourseById }}
    >
      {children}
    </CoursesContext.Provider>
  );
}
```
Az App.js-ben ne felejtsd el körbeölelgetni a routert!


## 2. CoursesPage oldalon a kurzusok betöltése

Használjuk a kontextünket!
useffecttel ívjuk meg a getCourses függvényt. 
Betöltés alatt az oldal drótvázát jelenítse meg!

Ha sikeres a betöltés, akkor mapelj végig a filteredList-listátn, és jelenítsd meg a Course komponenst!

```javascript
return (
    <>
      <CourseSearch />
      <div className="courses ">
        {filteredList.map((course) => {
          return <Course course={course} key={course.id} />;
        })}
      </div>
    </>
  );
```

## 3. Course komponens

A componens a props-án keresztül kapja meg a megjelenítendő adatokat. 

A gombokon vizuálisan jelezni kell, hoyg az illető be van-e iratkozva a kurzusra: 

```javascript
<button
style={{ background: course.isEnrolled ? "lightGreen" : "beige" }}
className="nagy"
onClick={() => {
    enroll();
}}
>
{course.isEnrolled ? "continue learning" : "enroll"}
</button>

//Illetve használhatunk ilyen feltételes vizuális jelölőt is a kártyák jobb sarkában:
<p className="beiratkozva"> {course.isEnrolled ? "✔" : "📝"}</p>
```

### 4. Szűrés elkészítése

#### 1. A CourseSearch komponens űrlapmezői adják a szűrési feltételeket. 

Az alap űrlap így néz ki: 

```javascript
import React, { useContext, useEffect, useState } from "react";


export default function CourseSearch() {
  
  const [search, setSearch] = useState("");
  const [difficulties, setDifficulties] = useState("all");


  return (
    <div className="p-3 keret">
      <h1 className="nagy">Course Catalog</h1>
      <p>Discover and enroll in courses to advance your skills</p>
      <div className="szuro">
        <input
          className=""
          type="text"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
          }}
          placeholder="Search courses by title or description ..."
        />
        <select
          className="nagy"
          value={difficulties}
          onChange={(e) => {
            setDifficulties(e.target.value);
          }}
          name="difficulties"
          id="difficulties"
        >
          <option value="all">All Difficulties</option>
          <option value="beginner">Beginner</option>
          <option value="intermediate">Intermediate</option>
          <option value="advanced">Advanced</option>
        </select>
      </div>
    </div>
  );
}

```
#### 2. A CoursesContext szuro függvénye fégzi el a lista szűrését. 

```javascript

  function szuro(difficulty, search) {
    const szurtLista = coursesList.filter((c) => {
      const difficultyOk = difficulty === "all" || c.difficulty === difficulty;

      const searchOk =
        search === "" ||
        c.description.toLowerCase().includes(search.toLowerCase())||
        c.title.toLowerCase().includes(search.toLowerCase());

      return difficultyOk && searchOk;
    });

    setFilteredList(szurtLista);
  }
```

#### 3. A CourseSearch komponensben 

A useEffect figyeli a szűrő és a keresőmező váltzását, és hívja a context szűrő függvényét. 

```javascript
  const { szuro } = useContext(CoursesContext);

  useEffect(() => {
    szuro(difficulties, search);
  }, [difficulties, search]);
```

### 5. Beiratkozás elkészítése

A Course komponensben -en  az enroll metódus fut le, ha a gombra rákattintunk, ami meghívja a contextből az erollCourse függvényt. Fontos, hogy az enrollCourse függvény csak akkor fusson le, ha még a felhasználó nincs beiratkozva a kurzusra. 
Akár be van iratkozva, akár nem az oldal navigáljon el a megfelelő kurzus részletes oldalára. 

#### 1. Gombkattintás enroll eseménye a Course komponensben

```javascript
  function enroll() {
    if (!course.isEnrolled) {
      enrollCourse(course.id);
    }

    navigate(`/courses/${course.id}`, { state: { course } });
  }
```

Ellenőrizd le, hogy az App.js-ben van ehhez a rout-hoz útvonal: 


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

#### 2. CoursesContext enrollCourse függvénye
A kurzusra való beiratkozás egy post kérés a /courses/${courseId}/enroll végpontra. Itt is kell a feljlécben a tokent küdenünk. 

```javascript
function enrollCourse(courseId){
 setLoading(true)
    myAxios.post(
      `/courses/${courseId}/enroll`, { isEnrolled: true },
      {
        headers: getAuthHeaders(),
      }
    )
    .then((response)=>{
      console.log(response)
    })
    .catch((error)=>{console.log(error)})
    .finally(()=>{setLoading(false)});
} 
```


### 6. CourseDetailPage

Egy kurzus részletes oldala. Itt megjelenik a kurzushoz tartozó összes fejezet (chapter). Ezeket meg lehet jelölni befejezettként. 

#### 1. A kurzus részletes adatainak megjelenítése


#### 1. CoursesContext completeChapter függvénye
```javascript
 function completeChapter(courseId, chapterId) {
    setLoading(true)
    return myAxios.post(
      `/courses/${courseId}/chapters/${chapterId}/complete`, { completed: true },
      {
        headers: getAuthHeaders(),
      }
    )
    .then((response)=>{
      console.log(response)
    })
    .catch((error)=>{console.log(error)})
    .finally(()=>{setLoading(false)});
  }
```




```
```
```
```
```
```
```
```


