# Mentor oldal elkészítése

1. MentorContext létrehozása
2. mentorlista és a loading statek létrehozása
3. A contextben  a getMentor()  függvény elkészítése a ""/mentors/sessions" végpontról. Ne felejtsd el küldeni a kérés fejlécében a tokent is a  getAuthHeaders() függvénnyel! Sikeres válasz esetén be tudod állítani a MentorListát.
4. A Provider  value-jában add meg a máshol is hazsnálni akart  függvényeket és változókat. 
5. App.js-ben az ölelgetés. 

6. **MentorsPage** oldalon szükség lesz az AuthContext-re és a useContext-re.
7. a mentorok és a userek lekérdezését useEffect hokkal valósítjuk meg. A betöltés alatt - loading változó - , csak egy helyörő/drótváz jelenjen meg a Betöltés folyamatban .. szöveggel.  

8. Jelenítük meg az oldalon a szükséges értékeket (creditBalane)
9. a mentorLista-n mapeljünk végig és jelenítsük meg a Mentorokat. 

10. **Mentor** komponens elkészítése, adatokat a propson keresztül kapja. 
Dátum megjelenítése formázva: 
```javascript
// DÁTUM
{new Date(mentor.sessionDate).toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "short",
    day: "numeric",
})}

// IDŐ
{new Date(mentor.sessionDate).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
})}
```

Feltételes gomb szín és tartalom megjelenítés:
A classnév is változzon inactive-ra, ha a nem elérhető a mentor.
```javascript
<div className="button">
    <button className={`keret session ${mentor.isAvailable?"available-button":"inactive"}  `} onClick={sessionBooked} disabled={!mentor.isAvailable} >
        {mentor.isAvailable?"Available":"Not available"} 
    </button>
</div>
```
