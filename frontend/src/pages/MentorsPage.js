import React from "react";
import Mentor from "../components/Mentor";
import "./css/mentor.css";
export default function MentorsPage() {
  return (
    <>
      <div className="keret padding">
        <h1>Mentor Session Booking</h1>
        <p>Book one-on-one session...</p>
        <div className="keret padding" style={{ background: "lightblue" }}>
          <strong>
            Your Current Balance:
            {"creditBalance 12"  } Credits
          </strong>
          <br />
          <span>
            Session are automaticly checked for confirmation every 30 seconds
          </span>
        </div>
      </div>
      <div className="sessions keret padding">
        <h2>Available Sessions</h2>
        <Mentor mentor={{}} key={1} />
        <Mentor mentor={{}} key={2} />
        <Mentor mentor={{}} key={3} />
        <Mentor mentor={{}} key={4} />
      </div>
    </>
  );
}
