import React, { useContext, useEffect } from "react";
import "../pages/css/mentor.css";
import { MentorContext } from "../contexts/MentorContext";
import { useNavigate } from "react-router";

export default function Mentor({ mentor }) {
  const { bookedSession } = useContext(MentorContext);

  const navigate = useNavigate();

  function sessionBooked() {
    bookedSession(mentor.id)
      .then((resp) => {
   
        navigate(`/bookedsession`);
      })
      .catch((error) => {
        if (error.response?.status === 403) {
          alert("Insufficient credits to book this session");
        } else {
          console.error(error);
        }
      });
  }



  if (!mentor) {
    return (
      <div className="sessions keret padding">
        <h3>A tartalom betöltés alatt ... </h3>
      </div>
    );
  }
  return (
    <div className="sessions keret padding">
      <h3>{mentor.mentorName}</h3>
      <p>
        <strong>Expertise:</strong>
        {mentor.expertise}
      </p>
      <p>
        {mentor.experienceLevel} Developer with {} years experience
      </p>
      <div className="mentor-container">
        <div className="keret">
          <p>date</p>
          <p>
            {new Date(mentor.sessionDate).toLocaleDateString("en-US", {
              weekday: "long",
              year: "numeric",
              month: "short",
              day: "numeric",
            })}
          </p>
        </div>
        <div className="keret">
          <p>time</p>
          <p>
            {new Date(mentor.sessionDate).toLocaleTimeString("en-US", {
              hour: "numeric",
              minute: "2-digit",
              hour12: true,
            })}
          </p>
        </div>
        <div className="keret">
          <p>duration</p>
          <p>{mentor.durationMinutes} minutes</p>
        </div>
        <div className="keret">
          <p>cost</p>
          <p>{mentor.creditCost} credists</p>
        </div>
      </div>
      <div className="button">
        <button className="keret profile inactive">View profile</button>
      </div>

      <div className="button">
        <button
          className={`keret session ${
            mentor.isAvailable ? "available-button" : "inactive"
          }  `}
          onClick={sessionBooked}
          disabled={!mentor.isAvailable}
        >
          {mentor.isAvailable ? "Available" : "Not available"}
        </button>
      </div>
    </div>
  );
}
