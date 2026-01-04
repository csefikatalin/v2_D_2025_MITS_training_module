import  {myAxios,  getAuthHeaders } from "../services/api";
import { createContext, useState, useEffect } from "react";

// 1. Context létrehozása
export const AuthContext = createContext();

// 2. Provider komponens
export function AuthProvider({ children }) {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [user, setUser] = useState([]);
  const [loading, setLoading] = useState(true);

  function login(adat) {
    setLoading(true);
    myAxios
      .post("/users/login", adat)
      .then(function (response) {
        // handle success
        /* ha sikerült a bejelentkezés elmentjük a  válaszban kapott tokent a lokalstorage-ben.   */
        localStorage.setItem("token", response.data.token);
        /* beállítjuk a tokent */
        setToken(response.data.token);
        //beállítjuk a usert is.
        setUser(response.data.user);
        /* Átnavigálunk a kezdőlapra */
        window.location.href = "/";
      })
      .catch(function (error) {
        // handle error
        console.log(error);
      })
      .finally(function () {
        // always executed
        setLoading(false);
      });
  }
   function register(adat) {
    console.log(adat)
    setLoading(true);
    myAxios
      .post("/users/register", adat)
      .then(function (response) {
        // handle success
        /* ha sikerült a bejelentkezés elmentjük a  válaszban kapott tokent a lokalstorage-ben.   */
        localStorage.setItem("token", response.data.token);
        /* beállítjuk a tokent */
        setToken(response.data.token);
        //beállítjuk a usert is.
        setUser(response.data.user);
        /* Átnavigálunk a kezdőlapra */
        window.location.href = "/";
      })
      .catch(function (error) {
        // handle error
        console.log(error);
      })
      .finally(function () {
        // always executed
        setLoading(false);
      });
  }

  return (
    <AuthContext.Provider value={{ login, register, loading, user }}>
      {children}
    </AuthContext.Provider>
  );
}
