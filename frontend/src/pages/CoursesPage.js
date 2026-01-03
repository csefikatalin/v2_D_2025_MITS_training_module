import React from "react";
import Course from "../components/Course";
import "./css/courses.css"
import CourseSearch from "../components/CourseSearch";

export default function CoursesPage() {
  return (
    <>
       <CourseSearch /> 
      <div className="courses ">
      <Course course={{}} key={1} />
      <Course course={{}} key={2} />
      <Course course={{}} key={3} />
      <Course course={{}} key={4} />
      <Course course={{}} key={5} />
    </div>
    </>
  );
}
