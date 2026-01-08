## Login és Registration oldalak elkészítése a mintának megfelelően

Készítsd el a LoginPage és RegistrationPage komponenseket a megadott minta alapján.

A formok alján biztosíts navigációt a másik oldalra a NavLink komponens segítségével.

<img src="../assets/wireframes/02-registration.png" alt="login minta">

Formázáshoz külön login.css-t készíts!

Ellenőrizd  a böngészőben, hogy elérhetőek-e az oldalak! pl.:http://localhost:3000/register

### Ne feledd: 

- A formoknak saját state-jük van!
- Az űrlapelemek value értékét mindig a state-ből vezéreljük (controlled input).
- Ne felejtsd el az onChange eseményben frissíteni a state-et!
- A Submit gomb eseménykezelőjét a form tagbe kell tenni!
- Használd az input elemeknél az onChange eseményt!


## Form validáció és hibakezelés

A Login és a Regisztrációs űrlapoknál adjunk hibaüzenetet, ha nem megfelelő a beviteli mezőbe írt érték!

1. error state létrehozása. Az errors objektum kulcsai az input mezők nevei (pl. email, password).

```javascript
 const [errors, setErrors] = useState({});
```

2. Hibaüzenet megjelenítése az input elemek alatt. A hibaüzenet csak akkor jelenik meg, ha az adott mezőhöz tartozik hiba. pl:

```javascript
 {errors.password && (
    <span className="error-text">{errors.password}</span>
  )}
  ```

3. Form validáció elkészítése

A validációt egy külön függvény végzi, amely hibaobjektumot ad vissza:

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

      //ezt majd később a submit eseményben fogjuk frissíteni, ide pedig egy return jön.  return newErrors;
      setErrors({ ...newErrors });
  }
  ```




A validateForm függvényt meghívhatjuk a submit event-re, de meghívhatjuk az input elemek onChange eseményében is. 

