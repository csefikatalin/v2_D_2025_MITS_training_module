import React from "react";
import { useNavigate } from "react-router";


export default function Course({
  course = { title: "teszt", description: "leírás", isEnrolled:false, difficulty:"medium" },
}) {
  const navigate = useNavigate();
  function enroll(){

  }
  return (
    <div className="course keret ">
      <div className="header">
        <h2 className="nagy"> {"Kurzus címe"}</h2>
        <p className="beiratkozva"> {course.isEnrolled ? "✔" : "📝"}</p>
      </div>

      <p>{"course.description"}</p>
      <div className="course-details  ">
        <div className=" keret nagy kozep">{"difficulty"}</div>
        <div className="keret nagy kozep">
          chapter <br />
          {"totalChapters"}
        </div>
        <div className="keret nagy kozep">
          total credit <br />
          {"totalCredits"}
        </div>
      </div>
      <button
        style={{ background: course.isEnrolled ? "lightGreen" : "beige" }}
        className="nagy"
        onClick={() => {
          enroll();
        }}
      >
        {course.isEnrolled ? "continue learning" : "enroll"}
      </button>
    </div>
  );
}
