import React, { useContext } from "react";
import { NavLink } from "react-router";
import "./css/navigation.css";
import { AuthContext } from "../contexts/AuthContext";

export default function Navigation() {
  const { logout, user, loading } = useContext(AuthContext);

  if (loading || !user) {
    return <nav>Betöltés folyamatban...</nav>;
  }

  return (
    <header>
      <nav>
        <ul>
          <li className="kiemelt">
            <strong>Skillshare Academy</strong>
          </li>
        </ul>
        <ul>
          <li>
            <NavLink to="/dashboard">Dashboard</NavLink>
          </li>
          <li>
            <NavLink to="/courses">Courses</NavLink>
          </li>
          <li>
            <NavLink to="/mentors">Mentors</NavLink>
          </li>
        </ul>
        <ul>
          <li className="kiemelt">
            {user.user.creditBalance ? user.user.creditBalance : "0"} credits
          </li>
          <li>Welcome {user.user.name ? user.user.name : "Guest"}</li>
          <li className="kiemelt" onClick={logout}>
            Logout
          </li>
        </ul>
      </nav>
    </header>
  );
}
