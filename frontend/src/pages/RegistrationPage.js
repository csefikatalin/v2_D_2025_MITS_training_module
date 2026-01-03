import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router";
import "./css/login.css";

export default function RegistrationPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassWord] = useState("");
  const [cpassword, setCPassWord] = useState("");
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  function validateForm() {
    const newErrors = {};
    if (!name) {
      newErrors.name = "A név megadása kötelező";
    } else if (name.length < 3) {
      newErrors.name = "A névnek legalább 3 karakter hosszúnak kell lennie";
    }
    if (!email) {
      newErrors.email = "Az email cím kötelező";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Érvénytelen email formátum";
    }

    if (!password) {
      newErrors.password = "A jelszó kötelező";
    } else if (password.length < 6) {
      newErrors.password =
        "A jelszónak legalább 6 karakter hosszúnak kell lennie";
    }
    if (!cpassword) {
      newErrors.cpassword = "Ismételje meg a jelszót";
    } else if (password !== cpassword) {
      newErrors.cpassword = "A két jelszó nem egyezik!";
    }

    return newErrors;
  }
  function submit(event) {
    event.preventDefault();
    setErrors(validateForm());
    const user = { name, email, password, cpassword };
    console.log(user);
  }
  return (
    <div className="login">
      <h1>CREATE ACCOUNT</h1>
      <form onSubmit={submit}>
        <div>
          <label htmlFor="name">FULL NAME</label>
          <input
            type="text"
            value={name}
            placeholder="Enter your full name"
            onChange={(e) => {
              setName(e.target.value);
            }}
            id="name"
          />
          {errors.name && <span className="error-text">{errors.name}</span>}
        </div>
        <div>
          <label htmlFor="email">EMAIL ADDRESS</label>
          <input
            type="email"
            value={email}
            placeholder="Enter your email"
            onChange={(e) => {
              setEmail(e.target.value);
            }}
            id="email"
          />
          {errors.email && <span className="error-text">{errors.email}</span>}
        </div>
        <div>
          <label htmlFor="password">PASSWORD</label>
          <input
            type="password"
            value={password}
            placeholder="Enter your password"
            onChange={(e) => {
              setPassWord(e.target.value);
            }}
            id="password"
          />
          {errors.password && (
            <span className="error-text">{errors.password}</span>
          )}
        </div>
        <div>
          <label htmlFor="cpassword">CONFIRM PASSWORD</label>
          <input
            type="password"
            autocomplete="cpassword"
            value={cpassword}
            placeholder="Confirm your password"
            onChange={(e) => {
              setCPassWord(e.target.value);
            }}
            id="cpassword"
          />
          {errors.cpassword && (
            <span className="error-text">{errors.cpassword}</span>
          )}
        </div>
        <div>
          <input type="submit" value="CREATE ACCOUNT" />
        </div>
        <div className="szoveg">
          Already have an account?
          <NavLink to="/login">SIGN IN HERE</NavLink>
        </div>
      </form>
    </div>
  );
}
