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
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [serverError, setServerError] = useState(null);
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
      value={{ getCourses, filteredList, loading, completeChapter, enrollCourse, selectedCourse,getCourseById, serverError }}
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
A backend dönti el véglegesen, hogy a beiratkozás sikeres volt-e.

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

A példában feltételezzük, hogy az oldalra navigációval érkezünk.

#### 1. A kurzus részletes adatainak megjelenítése

Az oldalon egyrészt szükségünk van a user adataira, úgyhogy itt újra lekérjük őket Másrészt tudnunk kell, hoyg melyik kurzus adatait kell lekérnünk a szerverről. Ezt az információt a useNavigate/useLocation információkból kaphatjuk meg. 

```javascript
  const { selectedCourse, getCourseById, loading, completeChapter } =  useContext(CoursesContext);
  const { loadUser } = useContext(AuthContext);
  const { state } = useLocation();
  const navigate = useNavigate();
  const course = state?.course;
```
Az aktuális kurzus lekérdezése a szerverről useEffect hookkal: 

```javascript
  useEffect(() => {
    getCourseById(course.id);
  }, [course]);
```
Ha még nem érkeztek meg az adatok, jelenjen meg erről üzenet: 
```javascript
 if (loading || !selectedCourse || selectedCourse.length == 0) {
    return <div>Az oldal betöltés alatt</div>;
  }
```
Jelen pillanatban így néz ki a kód:

```javascript
import React, { useContext, useEffect, useState } from "react";

import { useLocation, useNavigate } from "react-router";

import "./css/courses.css";
import { AuthContext } from "../contexts/AuthContext";
import { CoursesContext } from "../contexts/CoursesContext";

export default function CourseDetailsPage() {
  const { selectedCourse, getCourseById, loading, completeChapter } =
    useContext(CoursesContext);
  const { loadUser } = useContext(AuthContext);
  const { state } = useLocation();
  const navigate = useNavigate();
  const course = state?.course;

  useEffect(() => {
    getCourseById(course.id);
  }, [course]);

  if (loading || !selectedCourse || selectedCourse.length == 0) {
    return <div>Az oldal betöltés alatt</div>;
  }
  function markAsComleted(){}
  return (
    <div className=" padding courseone">
      <div className="keret">
        <button className="keret padding" onClick={() => navigate(-1)}>
          Back to course
        </button>
        <h1>{selectedCourse.course.title}</h1>
        <p>{selectedCourse.course.description}</p>
        <p>{selectedCourse.course.difficulty}</p>
        {selectedCourse.course.id}

        <div className="progress">
          <div className="chapter-progress keret">
            <h3>Chapter progress</h3>
            <div className="progress-container">
              <div className="progressbar"></div>
            </div>
            <p>
              {3} of {12} chapters completed (40 %)
            </p>
          </div>
          <div className="credit-progress keret">
            <h3>Credit progress</h3>
            <div className="progress-container">
              <div className="progressbar"></div>
            </div>
            <p>
              {23} of {35} credits earned (62 %)
            </p>
          </div>
        </div>
      </div>
      {selectedCourse.course.chapters.map((ch, i) => {
        return (
          <div className="keret" key={i}>
            <h2 className="nagy alahuzas">
              Chapter {i + 1}: {ch.title}
            </h2>
            <p>{ch.description}</p>
            <div className="keret nagy szelesseg padding">
              {ch.credits} credits
            </div>
            <button className="inactive" style={{ background: "ligthGray" }}>
              {" "}
              View chapter
            </button>
            <button
              className="keret"
              style={{
                background: ch.isCompleted ? "lightGreen" : "beige",
                cursor: ch.isCompleted ? "not-allowed" : "pointer",
              }}
              onClick={() => {
                markAsComleted(ch.id, ch.isCompleted);
              }}
            >
              {ch.isCompleted ? "Chapter completed" : "Mark as Completed"}
            </button>
            <div>
              {ch.isCompleted ? (
                <button
                  className="keret linkedin"
                  onClick={() => {
                    //share(ch);
                  }}
                >
                  Share achievement in LinkedIn
                </button>
              ) : (
                ""
              )}
            </div>
          </div>
        );
      })}

      {/* linkedin widget
      
      */}
      <div id="linkedin-share-root"> LinkedIn widget</div>
    </div>
  );
}

```

#### 2. Egy fejezet befejezése

A "Mark As Completed" gombra kattintva kell lefutnia a markAsCompleted függvénynek, ami meghívja a context completeChapter függvényét. 
Amikor a post kérés sikeresen lefutott, akkor frissíteni kell a user adatait és újra be kell tölteni a curzus adatokat is.
Ezért a  CoursesContext completeChapter függvényében az axios hívás esetén szükség lesz a visszatérési értékre, ezért returnt írunk elé. 
Ez után használhatunk then sé catch ágakat a sikeres hívás ellenőrzésére. 

```javascript
   function markAsComleted(chapterId, isCompleted) {
    console.log("mark", chapterId);
    if (!isCompleted) {
      completeChapter(selectedCourse.course.id, chapterId)
        .then(() => {
          /* frissíteni kell a usert! */
          loadUser();
          getCourseById(selectedCourse.course.id);
          //calculatingProgress();
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }
```

#### 3. CoursesContext completeChapter függvénye

Figyeld meg a return-t a myAxios hívás előtt!

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

### 6. ProgressBar elkészítése

A progress bár elkészítéséhez és az előrehaladás értékeinek kiírásához szükség lesz az alábbi statek-re:

```javascript
  const [sumOfCompletedCredits, setSumOfCompletedCredits] = useState(0);
  const [countOfCompletedChapters, setCountOfCompletedChapters] = useState(0);
  const [countOfChapters, setCountOfChapters] = useState(0);
  const [sumOfCredits, setSumOfCredits] = useState(0);
```

A calculatingProgress függvény kiszámolja az előrehaladáshoz szükséges értékeket.
Mivel ez a logika nem a megjelenítéshez, hanem az adatok feldolgozásához kapcsolódik, akár ki is emelhetjük a komponensből.
Ha más komponenseknek is szükségük van erre az információra, akkor célszerű a context-be helyezni.

```javascript
  /* progress bar */
  function calculatingProgress() {
    const totalChapters = selectedCourse.course.chapters.length;
    let completedChapters = 0;
    let totalCredits = 0;
    let completedCredits = 0;

    selectedCourse.course.chapters.forEach((ch) => {
      totalCredits += ch.credits;
      if (ch.isCompleted) {
        completedChapters += 1;
        completedCredits += ch.credits;
      }
    });

    setCountOfChapters(totalChapters);
    setCountOfCompletedChapters(completedChapters);
    setSumOfCredits(totalCredits);
    setSumOfCompletedCredits(completedCredits);
  }
```

Most már csak fel kell használni a folyamat kijelzésére:

```javascript
 <div className="progress">
          <div className="chapter-progress keret">
            <h3>Chapter progress</h3>
            <div className="progress-container">
              <div
                className="progressbar"
                style={{
                  background: "grey",
                  width: `${
                    (countOfCompletedChapters / countOfChapters) * 100
                  }%`,
                }}
              ></div>
            </div>
            <p>
              {countOfCompletedChapters} of {countOfChapters} chapters completed
              ({((countOfCompletedChapters / countOfChapters) * 100).toFixed(2)}{" "}
              %)
            </p>
          </div>
          <div className="credit-progress keret">
            {" "}
            <h3>Credit progress</h3>
            <div className="progress-container">
              <div
                className="progressbar"
                style={{
                  background: "grey",
                  width: `${(sumOfCompletedCredits / sumOfCredits) * 100}%`,
                }}
              ></div>
            </div>
            <p>
              {sumOfCompletedCredits} of {sumOfCredits} credits earned (
              {((sumOfCompletedCredits / sumOfCredits) * 100).toFixed(2)} %)
            </p>
          </div>
        </div>
      </div>
```

Illetve a függvény meghívsát egy useEffect-ben helyezzük el. Ne felejtsd el a dependency tömbbe elhelyeznia  selectedCourse-t!

```javascript
useEffect(() => {
if (selectedCourse?.course) {
    calculatingProgress();
}
}, [selectedCourse]);
```


