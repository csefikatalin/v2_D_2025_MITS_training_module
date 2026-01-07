import BookedSession from "../components/BookedSession";
import React, { useContext, useEffect } from "react";

import { AuthContext } from "../contexts/AuthContext";
import { useNavigate } from "react-router";
import { usePolling } from "../hooks/usePolling";

export default function BookedSessionPage() {
  const navigate = useNavigate();
  const { loadUser, user, loading } = useContext(AuthContext);

  useEffect(() => {
    loadUser();
    console.log(user.sessions);
  }, []);

  // Polling - frissítés 30 másodpercenként (elérhető és foglalt időpontok)
  usePolling(() => {
    loadUser();
  }, 30000);

  if (loading || user.sessions.length == 0) {
    // Betöltés alatt ezt jeleníti meg
    return (
      <>
        <div>Betöltés folyamatban, vagy nincs felvett mentor...</div>
      </>
    );
  }
  return (
    <div>
      <button className="keret padding" onClick={() => navigate(-1)}>
        Back to Mentors
      </button>
      {user.sessions.map((s, i) => {
        return <BookedSession session={s} key={i} mentor={{}} />;
      })}
    </div>
  );
}
