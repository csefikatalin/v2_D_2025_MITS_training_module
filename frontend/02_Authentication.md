# Autentikáció és bejelentkezés

A tokenes autentikáció egy olyan mechanizmus, ahol:

- a felhasználó egyszer bejelentkezik
- a backend kiállít egy tokent
- a kliens ezt a tokent minden további kérésnél elküldi

a szerver a token alapján azonosítja a felhasználót, ezért nem kell újra bejelentkezni minden kérésnél

A szerver nem tárol sessiont, ezért ez REST-kompatibilis, **stateless** .

### Tehát a folyamat:

1. A felhasználó bejelentkezik/regisztrál. Elküldi a backendnek a bejelentkezési adatokat.
2. A backend megkeresi a felhasználót az adatbázisban, ellenőrzi a jelszót. Ha nincs felhasználó, vagy hibás a jelző a **401-es Unauthorized** hibaüzenetet kapunk. Ha **helyesek** a bejelentkezési adatok, akkor a **generál egy tokent**, amit visszaküld a frontendnek.
3. A tokent le kell menteni a LocalStorage-ba. A token azonosítja a felhasználót, id, email, role. Nem titkosított, csak aláírt, ezért érzékeny adat nem kerülhet bele.
4. Minden további (védett végpont) kérésnél a frontend elküldi a tokent a backend felé.
5. A beckend kiolvassa a tokent, ellenprzi a helyességét. kinyeri a felhasználó adataot, ésha monden Ok, akkor a kérést kiszolgálja. Így minden kérés önállóan tartalmazza az autentikációt.

### Hátrányok

- token visszavonása nehézkes
- a localStorage sebezhető
- lejárati időt jól kell beállítani

## Védett route implementálása middleware-rel

A React Router v7 **middleware** funkciója lehetővé teszi, hogy központosított logikát futtassunk le route-ok előtt. Ez ideális hitelesítés kezelésére.

**Mi az a middleware?**

A middleware egy függvény, amely:

- A route komponens renderelése **előtt** fut le
- Ellenőrizheti a hitelesítést
- Átirányíthat más route-ra (pl. login oldalra)
- Több route-ra is alkalmazható

Jelen pillanatban minden menüpont elérhető bármelyik felhasználónak. De a menüpontokat védhetjük is úgy, hogy bizonyos menüpontokat csak bizonyos felhasználók láthassanak. Ehhez létre kell hoznunk egy middleware fájlt.

Az autMiddlewaret loaderként használjuk.
A **loader** egy olyan függvény a React Routerben, amely az adott útvonal betöltése előtt fut le, és eldöntheti, hogy az oldal renderelődjön-e, illetve adatot tölthet be hozzá.

```txt
src/
└── middleware/
└── authMiddleware.js
```

Az autMiddleware fájl tartalma:

```javascript
import { redirect } from "react-router";
/* A redirect egy React Router helper függvény, amelyet loaderben vagy actionben lehet használni. kivételt (throw) dob, amit a router kezel */

async function authMiddleware({ request }) {
  /* Ez a függvény egy route loaderként használt „middleware”. Minden védett oldal betöltése előtt lefut. Ellenőrzi, hogy van-e érvényes token
   ha nincs → átirányít a /login oldalra */
  const token = localStorage.getItem("token");

  if (!token) {
    throw redirect("/login");
  }
}

export default authMiddleware;
```

Azután az Api.js-ben be kell állítanuk a védett menüpontokra a védelmet.
**middleware: [authMiddleware],**

```javascript
   {
      path: "/",
      element: <Layout />,
      /* ezek védett végpontok lesznek, csak azoknak a felahsználóknak látszódnak, akik be vannak jelentkezve! */
      middleware: [authMiddleware],
      children: [
        {
          index: true,
          element: <Navigate to="/dashboard" replace />,
        },
        ...
```

**Middleware előnyei:**

- **Központosított logika:** Egy helyen van a hitelesítési ellenőrzés
- **Tisztább kód:** Nincs szükség wrapper komponensekre
- **Futási sorrend:** Lefut a komponens renderelése előtt
- **Újrafelhasználható:** Több route-ra is alkalmazható
- **Láncolható:** Több middleware is használható egyszerre

**Middleware működése:**

```
1. Felhasználó megpróbál elérni /dashboard-ot
   ↓
2. authMiddleware lefut
   ↓
3. Ellenőrzi a localStorage-ban a token-t
   ↓
4. Ha nincs token → throw redirect("/login")
   ↓
5. Ha van token → a navigáció folytatódik
   ↓
6. DashboardPage komponens renderelődik
```

## A regisztráció és a bejelentkezés megvalósítása

Ha minden jól ment, akkor most már csak a /login, vagy a /register routokat tudjuk elérni a böngészőnkben.

### 1. AuthContext létrehozása

Jöhet az alap context szerkezet.

```javascript
import myAxios, { getAuthHeaders } from "../services/api";
import { createContext, useState, useEffect } from "react";

// 1. Context létrehozása
export const AuthContext = createContext();

// 2. Provider komponens
export function AuthProvider({ children }) {
  return <AuthContext.Provider value={{}}>{children}</AuthContext.Provider>;
}
```

Két state-re lesz szükségünk, a token és a user számára.
Illetve használjunk még egy loading statet is, amivel jelezhetjük a felahsználónak, hoyg az oldal még betöltés alatt van.

```javascript
const [token, setToken] = useState(localStorage.getItem("token"));
const [user, setUser] = useState([]);
const [loading, setLoading] = useState(true);
```

2 axios post kérés lesz. Az egyik a login a másik a register végpontokra.

Érdemes külön service fájlba kiszervezni a a HTTP kérések beállításait.

### services

Hozz létre egy services mappát és abban egy api.js fájlt.

Az api.js tartalma:

```javascript
import axios from "axios";

//Létrehozok egy saját axios példányt, a továbbiakban ezt használom az api hívásoknál, így az alapértelmezett header és végpont információkat tartalmazza.

const myAxios = axios.create({
  baseURL: "http://localhost:5000/api/v1",
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

/* minden kérésnél a header-hez hozzá kell tenni a tokent.  */
export function getAuthHeaders() {
  const token = localStorage.getItem("token");
  return {
    "X-API-TOKEN": token,
    "Content-Type": "application/json",
  };
}
```

### AuthContext függvényei

Az alábbiakban a login függvényt láthatjuk. A register függvény teljesen hasonló módon működik.

```javascript
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
```

### App.js-ben az AuthProvider körbeöleli a RouterProvidert

### a LoginPage komponens átalakítása

1. validateForm függvénynek legyen a visszatérési értéke -**return newErrors**;
2. A submit függvény hívja a context login függvényét, így ne feljetsd el useContexttel behozni a komponensbe! **const { login } = useContext(AuthContext);**
3. A submit fvény:

```javascript
function submit(event) {
  event.preventDefault();

  const validationErrors = validateForm();
  if (Object.keys(validationErrors).length > 0) {
    setErrors(validationErrors);
    return;
  }
  const data = { email, password };
  login(data);
}
```

4. A RegistrationPage hasonló módon oldaható meg. Itt a regisztráció után a login oldalra kell navigálni, mivel a register végpont nem adja vissz aaz autentikációs tokent. Azt csak a bejelentkezés után kapjuk meg.

Ha eddig mindent jól csináltál, akkor az oldal kezdetben csak a login formot mutatja. Átlépve a regisztrációra, beregisztrálsz, majd átirányít a login oldalra. Bejelntekezés után megjelennek a Layoutban meghatározott menüpontok és oldalak.  
Ellenőrizd, hogy a böngészőben az Application fülön a localstorage-ban megjelent a token.

### Felhasználó adatainak megjelenítése

1. AuthContextben:

```javascript
/* beolvassuk a localstorage-ból a tokent és beállítjuk a felahsználót
 */
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
  /* ha megvan a token, a végpontról lekérdezzk a felhasználó adatait
a fejléchez mindenképp csatolni kell a tokent. Erre szolgál a getAuthHeaders függvény. */
  myAxios
    .get("/users/me", { headers: getAuthHeaders() })
    .then((response) => {
      setUser(response.data.user); //  beállítjuk a user-t
    })
    .catch((error) => {
      console.log(error);
      setUser(null); // ha hiba, töröljük a user-t
      //localStorage.removeItem("token"); // ha invalid token
    })
    .finally(() => {
      setLoading(false); //  loading vége, user betöltve
    });
}
```

2. A value-hoz hozzá kell adni a user - t is.

3. Navigation.js-ben módosítani kell a felhasználó adatait megjelenítő részt.

```javascript
<ul>
  <li className="kiemelt">
    {user.creditBalance ? user.creditBalance : "0"} credits
  </li>
  <li>Welcome {user.name ? user.name : "Guest"}</li>
</ul>
```

### A logout megvalósítása

1. Az AuthContextben létrehozom a függvényt

```javascript
function logout() {
  /* kijelentkezéskor nullára állítjuka  tokent és a felhasználót. */
  setUser(null);
  setToken(null);
  /* töröljük a tokent a localstorage-ból */
  localStorage.removeItem("token");
  /* Újratöltjük az oldalt */
  window.location.reload();
}
```

2. A value-hoz hozzá kell adni a logout-ot is.

3. Navigation.js-ben módosítani kell a Logout menüponthoz tartoz részt

```javascript
<ul>
  <li className="kiemelt">
    {user.creditBalance ? user.creditBalance : "0"} credits
  </li>
  <li>Welcome {user.name ? user.name : "Guest"}</li>
  <li className="kiemelt" onClick={logout}>
    Logout
  </li>
</ul>
```

## Hibakezelés

Az API különböző hibákat adhat vissza működés során. A frontendnek kezelnie kell ezeket a hibákat és érthető módon meg kell jelenítenie őket a felhasználónak. A következő hibákat kell kezelni:

- 400 Bad Request – A kérés hibás volt. A felhasználót értesíteni kell, hogy érvénytelen adatokat adott meg.
- 401 Unauthorized – A hitelesítési token érvénytelen vagy lejárt. A felhasználót át kell irányítani a bejelentkezési oldalra.
- 403 Forbidden – A felhasználónak nincs jogosultsága a kért művelethez. A felhasználót értesíteni kell a hiányzó jogosultságokról.
- 404 Not Found – A kért erőforrás nem található. A felhasználót értesíteni kell, hogy a tartalom nem elérhető.
- 422 Unprocessable Entity – Validációs hibák történtek. Meg kell jeleníteni a specifikus mező hibát, hogy a felhasználó javítani tudja.
- 500 Internal Server Error – Szerver hiba történt. A felhasználót értesíteni kell egy ideiglenes rendszerhibáról.

A **serverError** state-ben fogjuk tárolni a hibaüzeneteket.

const [serverError, setServerError] = useState(true);

1. Hibakezeles függvény az AuthContext-ben

```javascript
function hibakezeles(error) {
  if (error.status === 400) {
    setServerError("A megadott adatok nem szerepelnek az adatbázisban");
  } else if (error.status === 401) {
    setServerError(
      "A hitelesítési token érvénytelen vagy lejárt. Menj a login oldalra!"
    );
    window.location.href = "/login";
  } else if (error.status === 403) {
    setServerError("Nincs jogosultsága a kért művelethez!");
  } else if (error.status === 404) {
    setServerError("A kért erőforrás nem található!");
  } else if (error.status === 422) {
    setServerError("Validációs hiba");
  } else if (error.status === 500) {
    setServerError("Szerver hiba történt.");
  } else {
    setServerError("Ismeretlen hiba történt.");
  }
}
```

Ne felejtsd el a value-ban átadni a serverError változót.

2. Ezt a függvényt az API hívások catch ágában hívhatjuk!

3. pl a login oldalon felhasználhatjuk a serverError értékét a hiba jelzésére.

A serverError változót használd a contextben!

```javascript
{
  serverError && <div className="alert-error">{serverError}</div>;
}
```
