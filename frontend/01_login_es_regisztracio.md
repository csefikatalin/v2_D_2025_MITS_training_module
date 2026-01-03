## Login és Registration oldalak elkészítése a mintának megfelelően

A formok alján át lehet navigálni a RegistrationPage / LoginPage oldalra. Használd a NavLink - et!

<img src="../assets/wireframes/02-registration.png" alt="login minta">

Formázáshoz külön login.css-t készíts!

Teszteld a böngészőben, hogy elérhetőek-e az oldalak! pl.:http://localhost:3000/register

### Ne feledd: 

- A formoknak saját state-jük van!
- Az űrlapelemek value értékemindig a state
- Ne feldd onChange eseményben frissíteni a value értékét!
- A Submit gomb eseménykezelőjét a form tagbe kell tenni!
- Használd az input elemeknél az on


## Form validáció és hibakezelés

A Login és a Regisztrációs űrlapoknál adjunk hibaüzenetet, ha nem megfelelő a beviteli mezőbe írt érték!

1. error state létrehozása 
```javascript
 const [errors, setErrors] = useState({});
```
2. errortext elem létrehozása minden űrlapelem alatt. pl:
```javascript
 {errors.password && (
    <span className="error-text">{errors.password}</span>
  )}
  ```
3. Form validáció elkészítése

  ```javascript
  function validateForm() {
      const newErrors = {};

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

      setErrors({ ...newErrors });
  }
  ```
A validateForm függvényt meghívhatjuk a submit event-re, de meghívhatjuk az input elemek onChange eseményében is. 

