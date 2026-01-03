import React, { useContext } from "react";


import { useNavigate } from "react-router";


export default function Mentor({ mentor }) {
  const navigate = useNavigate();

  function sessionBooked() {
   
  }
  return (
    <div className="sessions keret padding">
      <h3>{"mentorName"}</h3>
      <p>
        <strong>Expertise:</strong>
        {"expertise"}
      </p>
      <p>
        {"experienceLevel"} Developer with {34} years experience
      </p>
      <div className="mentor-container">
        <div className="keret">
          <p>date</p>
          <p>
            2025.12.23
          </p>
        </div>
        <div className="keret">
          <p>time</p>
          <p>
            12:30
          </p>
        </div>
        <div className="keret">
          <p>duration</p>
          <p>{30} minutes</p>
        </div>
        <div className="keret">
          <p>cost</p>
          <p>{15} credists</p>
        </div>
      </div>
      <div className="button">
        <button className="keret profile inactive">View profile</button>
      </div>

      <div className="button">
        <button className={`keret session ${mentor.isAvailable?"available-button":"inactive"}  `} onClick={sessionBooked} disabled={!mentor.isAvailable} >
         {mentor.isAvailable?"Available":"Not available"} 
        </button>
      </div>
    </div>
  );
}
