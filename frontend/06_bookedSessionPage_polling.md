# BookedSessionPage

A BookedSession Page-re akkor jutunk el, ha a MentrosPage-n rákattintunk egy elérhető mentorra. Tehát a továbbiakban a Mentor komponensben fogunk először dolgozni. Illetve szükségünk lesz még egy post kérésre a `/mentors/sessions/${id}/book` végpontra. Erre a végpontra küldött post kéréssel iratkozunk be a mentorhoz. A feliratkozás csak akkor lehetséges, ha van elegendő kreditünk a mentorhoz.

1. MentorContext-ben hozd létre a bookedSession függvényt a post kéréssel a fenti végpontra. A fejlécben küldd el a tokent is. A provider valu-ban helyezd el a függvény nevét.
2. A Mentor componensben hívd be a contextben a függvényt.
3. Az Available gombra kell egy eseménykezelő, melynek hatására egyrészt feljelentkezhetünk a mentorhoz meghívódik a bookedSession függvény (onClick={sessionBooked} ) másrészt elnavigálunk a megfelelő egyedi mentor oldalra. Ehhez pedig a useNavigate hook-ot fogjuk használni.

```javascript
const { bookedSession } = useContext(MentorContext);

const navigate = useNavigate();
function sessionBooked() {
  bookedSession(mentor.id);
  navigate(`/bookedsession`);
}
```

4. Szükség lesz a BookedSessionPage oldalra is, illetve regisztrálnunk kell az oldalt az Appjs-ben a roote-ok között.

```javascript
{
    path: "/bookedsession",
    element: <BookedSessionPage />,
},
```

5. A BookedSessionPage oldal oln useEffect-tel betöltjük az aktuális usert. Az aktuális user objektum tartalmazza a session kulcsában azokat a mentorokat, ahova a user feljelentkezett. Ezeket kell most megjeleníteni. 

```javascript
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

```

6. A BookedSession egy komponens, ahol az adott mentor adatait jelenítjük meg. A megjelenítendő adatokat a propson keresztül kapja. 


# Polling

## 1. usePolling hook

Egy hook, amit saját magunk írunk. Ez egy újrafelhasználható  függvény a react hook-ok mintájára, aminek a feladata, hogy adott időközönként lefusson.

```javascript
import { useEffect, useRef, useCallback } from "react";

export function usePolling(callback, interval = 30000) {
  const savedCallback = useRef(callback);
  const intervalIdRef = useRef(null);

  // Mindig a legfrissebb callback-et használjuk
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  const startPolling = useCallback(() => {
    if (intervalIdRef.current) return; // Már fut

    // Azonnal meghívjuk egyszer
    savedCallback.current();

    // Elindítjuk az intervallumot
    intervalIdRef.current = setInterval(() => {
      savedCallback.current();
    }, interval);
  }, [interval]);

  const stopPolling = useCallback(() => {
    if (intervalIdRef.current) {
      clearInterval(intervalIdRef.current);
      intervalIdRef.current = null;
    }
  }, []);

  // Automatikus indítás és cleanup
  useEffect(() => {
    startPolling();
    return () => stopPolling();
  }, [startPolling, stopPolling]);

  return { startPolling, stopPolling };
}

```

## 2. usePolling hook felhasználás a mentorhoz való jelentkezés állapotának automatikus 30 mp-es frissítésére: 

A BookedSessionPage komponensben dolgozunk tovább, itt helyezzük el egy usePolling hookban (a useEffect mintájára) a user adatainak lekérését 30 másodpercenként. 

```javascript
// Polling - frissítés 30 másodpercenként (elérhető és foglalt időpontok)
usePolling(() => {

    loadUser();
}, 30000); 
```

Ezután, ha van elég kreditünk, akkor feljelentkezhetünk egy mentorhoz. A jelentkezéskor a session állapota **pending**, majd kb 30 másodperc elteltével frissül az oldal, és ekkor az állapot **confirmed** -re vagy **cancelled** -re vált. Ezeket az értékeket a backend állítja be az adatbázisban. Információt csak akkor kapunk róla, ha frissítjük az oldalt. Ezt oldottuk meg a Polling hook megírásával. 

A módszer hátránya, hogy a 30mp-kénti kérésekkel nagyon leterheli a rendszert. 


