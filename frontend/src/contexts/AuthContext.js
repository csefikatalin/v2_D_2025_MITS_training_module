import { myAxios, getAuthHeaders } from "../services/api";
import { createContext, useState, useEffect } from "react";

// 1. Context létrehozása
export const AuthContext = createContext();

// 2. Provider komponens
export function AuthProvider({ children }) {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [serverError, setServerError] = useState(null);

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
        hibakezeles(error)
      })
      .finally(function () {
        // always executed
        setLoading(false);
      });
  }
  function register(adat) {
    console.log(adat);
    setLoading(true);
    myAxios
      .post("/users/register", adat)
      .then(function (response) {
        /* Átnavigálunk a login oldalra */
        window.location.href = "/login";
      })
      .catch(function (error) {
        // handle error
        console.log(error);
        hibakezeles(error)
      })
      .finally(function () {
        // always executed
        setLoading(false);
      });
  }
  /* felhasználó betöltése, ha már van token! */
  useEffect(() => {
    loadUser();
  }, []);
  function loadUser() {
    const savedToken = localStorage.getItem("token");

    if (!savedToken) {
      setLoading(false); // nincs token, loading vége
      setUser(null);
      return;
    }

    setToken(savedToken);
    setLoading(true);
    /* ha megvan a token, a végpontról lekérdezzük a felhasználó adatait
a fejléchez mindenképp csatolni kell a tokent. Erre szolgál a getAuthHeaders függvény. */
    myAxios
      .get("/users/me", { headers: getAuthHeaders() })
      .then((response) => {
        setUser(response.data); //  beállítjuk a user-t
      })
      .catch((error) => {
        console.log(error);
        setUser(null); // ha hiba, töröljük a user-t
        localStorage.removeItem("token"); // ha invalid token
      })
      .finally(() => {
        setLoading(false); //  loading vége, user betöltve
      });
  }

  function logout() {
    /* kijelentkezéskor nullára állítjuka  tokent és a felhasználót. */
    setUser(null);
    setToken(null);
    /* töröljük a tokent a localstorage-ból */
    localStorage.removeItem("token");
    /* Újratöltjük az oldalt */
    window.location.reload();
  }

  function hibakezeles(error) {
     const status = error.response?.status;
    if (status === 400) {
      setServerError("A megadott adatok nem szerepelnek az adatbázisban");
    } else if (error.status === 401) {
      setServerError(
        "A hitelesítési token érvénytelen vagy lejárt. Vagy A megadott adatok nem szerepelnek az adatbázisban. Menj a login oldalra!"
      );
      //window.location.href = "/login";
    } else if (status === 403) {
      setServerError("Nincs jogosultsága a kért művelethez!");
    } else if (status === 404) {
      setServerError("A kért erőforrás nem található!");
    } else if (status === 422) {
      setServerError("Validációs hiba");
    } else if (status === 500) {
      setServerError("Szerver hiba történt.");
    } else {
      setServerError("Ismeretlen hiba történt.");
    }
  }

  return (
    <AuthContext.Provider value={{ login, register, loading, user, logout, serverError, loadUser }}>
      {children}
    </AuthContext.Provider>
  );
}
