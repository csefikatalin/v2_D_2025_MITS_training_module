import React, { useContext, useEffect, useState } from "react";
import { CoursesContext } from "../contexts/CoursesContext";

export default function CourseSearch() {
  const [search, setSearch] = useState("");
  const [difficulties, setDifficulties] = useState("all");

  const { szuro } = useContext(CoursesContext);

  useEffect(() => {
    szuro(difficulties, search);
  }, [difficulties, search]);

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
