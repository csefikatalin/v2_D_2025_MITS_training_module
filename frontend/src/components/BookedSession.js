
import "../pages/css/mentor.css";




export default function BookedSession({ session, mentor }) {

  return (
    <div className="sessions keret padding">
      <h3>{session.session.mentorName}</h3>
        <div className="button">
        <button className={session.status==="rejected"?"rejected-button":session.status==="pending"?"pending-button":session.status==="cancelled"?"canceled-button":"confirmed-button"} >
        {session.status}
        </button>
      </div>
      <div className="mentor-container">
        <div className="keret">
          <p>date</p>
          <p>
            {new Date(session.session.sessionDate).toLocaleDateString("en-US", {
              weekday: "long",
              year: "numeric",
              month: "short",
              day: "numeric",
            })}{" "}
          </p>
        </div>
        <div className="keret">
          <p>time</p>
          <p>
            {new Date(session.session.sessionDate).toLocaleTimeString("en-US", {
              hour: "numeric",
              minute: "2-digit",
              hour12: true,
            })}
          </p>
        </div>
        <div className="keret">
          <p>duration</p>
          <p>{session.session.durationMinutes} minutes</p>
        </div>
        <div className="keret">
          <p>cost</p>
          <p>{session.session.creditCost} credists</p>
        </div>
      </div>
     

    
    </div>
  );
}
