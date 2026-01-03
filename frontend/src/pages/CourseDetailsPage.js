import React, { useContext, useEffect, useState } from "react";

import { useLocation, useNavigate } from "react-router";

import "./css/courses.css";

export default function CourseDetailsPage() {
    const navigate = useNavigate();
  return (
    <div className=" padding courseone">
      <div className="keret">
        <button className="keret padding" onClick={() => navigate(-1)}>
          Back to course
        </button>
        <h1>{"title"}</h1>
        <p>{"description"}</p>
        <p>{"difficulty"}</p>

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
      <div className="keret" key={1}>
        <h2 className="nagy alahuzas">
          Chapter {2}: {"title"}
        </h2>
        <p>{"description"}</p>
        <div className="keret nagy szelesseg padding">{34} credits</div>
        <button className="inactive" style={{ background: "ligthGray" }}>
          View chapter
        </button>
        <button className="keret" onClick={() => {}}>
          "Chapter completed"
        </button>
        <div>
          <button className="keret linkedin" onClick={() => {}}>
            Share achievement in LinkedIn
          </button>
        </div>
      </div>

      <div id="linkedin-share-root"> LinkedIn widget</div>
    </div>
  );
}
