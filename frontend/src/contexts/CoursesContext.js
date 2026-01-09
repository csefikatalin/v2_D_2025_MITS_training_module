import { myAxios, getAuthHeaders } from "../services/api";
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
      })
      .finally(() => setLoading(false));
  }
  function getCourseById(id) {
    console.log(id);
    setLoading(true);
    myAxios
      .get(`/courses/${id}`, { headers: getAuthHeaders() })
      .then((response) => {
        setSelectedCourse(response.data);
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => setLoading(false));
  }

  function szuro(difficulty, search) {
    const szurtLista = coursesList.filter((c) => {
      const difficultyOk = difficulty === "all" || c.difficulty === difficulty;

      const searchOk =
        search === "" ||
        c.description.toLowerCase().includes(search.toLowerCase()) ||
        c.title.toLowerCase().includes(search.toLowerCase());

      return difficultyOk && searchOk;
    });

    setFilteredList(szurtLista);
  }

  function enrollCourse(courseId) {
    setLoading(true);
    myAxios
      .post(
        `/courses/${courseId}/enroll`,
        { isEnrolled: true },
        {
          headers: getAuthHeaders(),
        }
      )
      .then((response) => {
        console.log(response);
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => {
        setLoading(false);
      });
  }

  function completeChapter(courseId, chapterId) {
    setLoading(true);
    return myAxios
      .post(
        `/courses/${courseId}/chapters/${chapterId}/complete`,
        { completed: true },
        {
          headers: getAuthHeaders(),
        }
      )
      .then((response) => {
        console.log(response);
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => {
        setLoading(false);
      });
  }
  return (
    <CoursesContext.Provider
      value={{
        getCourses,
        filteredList,
        serverError,
        loading,
        szuro,
        completeChapter,
        enrollCourse,
        selectedCourse,
        getCourseById,
      }}
    >
      {children}
    </CoursesContext.Provider>
  );
}
