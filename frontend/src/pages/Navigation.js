import React, {  } from "react";
import { NavLink } from "react-router";
import "./css/navigation.css";


export default function Navigation() {
  const loading = false;
  const user = {};
  function logout() {}

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
            { "0"} credits
          </li>
          <li>Welcome {user ? "Név" : "Guest"}</li>
          <li className="kiemelt" onClick={logout}>
            Logout
          </li>
        </ul>
      </nav>
    </header>
  );
}
