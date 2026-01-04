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