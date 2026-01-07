import React, { useContext, useEffect, useState } from "react";

import { useLocation, useNavigate } from "react-router";

import "./css/courses.css";
import { AuthContext } from "../contexts/AuthContext";
import { CoursesContext } from "../contexts/CoursesContext";

export default function CourseDetailsPage() {
  const [sumOfCompletedCredits, setSumOfCompletedCredits] = useState(0);
  const [countOfCompletedChapters, setCountOfCompletedChapters] = useState(0);
  const [countOfChapters, setCountOfChapters] = useState(0);
  const [sumOfCredits, setSumOfCredits] = useState(0);

  const { selectedCourse, getCourseById, loading, completeChapter } =
    useContext(CoursesContext);
  const { loadUser } = useContext(AuthContext);
  const { state } = useLocation();
  const navigate = useNavigate();
  const course = state?.course;

  useEffect(() => {
    getCourseById(course.id);
  }, [course]);

  useEffect(() => {
    if (selectedCourse?.course) {
      calculatingProgress();
    }
  }, [selectedCourse]);

 useEffect(() => {
    if (window.LinkedInShare) {
      window.LinkedInShare.init({
        container: "#linkedin-share-root",
        theme: "light",
        locale: "en-US",
      });
    }
  }, []);

  if (loading || !selectedCourse || selectedCourse.length == 0) {
    return <div>Az oldal betöltés alatt</div>;
  }
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

  function share(chapter) {
    if (
      window.LinkedInShare &&
      typeof window.LinkedInShare.open === "function"
    ) {
      window.LinkedInShare.open({
        url: window.location.href,
        title: `Course: ${chapter.courseTitle}`,
        summary: `I just completed "${chapter.title}"!`,
        source: "SkillShare Academy",
        tags: ["learning", "skills"],
      });
    } else {
      console.warn("LinkedInShare widget még nem elérhető");
    }
  }

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
                    share(ch);
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
