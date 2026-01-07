# LinkedIn widget integrálása


A LinkedIn megosztó nem React-komponens, hanem egy klasszikus, globális JavaScript widget, ami:

- a public mappából töltődik be
- a window objektumra tesz fel egy globális API-t: window.LinkedInShare
- belső állapotot tart fenn, ezért initializálni kell
- a React életciklusát nem ismeri.

Ezért:

- nem JSX-ben hozzuk létre
- nem props-szal konfiguráljuk
- nem rendereléskor fut

A widget integráláshoz felhasználjuk a Third-party mappában lévő js és css fájlokat. A teljes mappát mozgasd át a frontend public mappájába! 

A widgethez tartozó CSS és JavaScript fájlok nem moduláris React-eszközök, ezért azokat globálisan, az alkalmazás indulásakor kell betölteni. 

Linkeld be a css fájlt az index.html  fájl head-jében:
```
<link rel="stylesheet" href="/third-party/linkedin-share.css">
```

Helyezd el a widget js fájlját is a body lezárása előtt: 

```
<script src="/third-party/linkedin-share.js"></script>
```

Ezuán már a widget stílusai elérhetők és a window.LinkedInShare objektum létrejön.

A widgetnek szüksége van egy horgnypontra, ezért a komponens returnje végén helyezd el ezt a div-et is: 

```javascript
<div id="linkedin-share-root">LinkedIn widget</div>
```

Ha ez nincs, akkor az init  nem fut le és az open nem fog mködni. 

1. A CourseDetailsPage oldalon helyezz el egy gombot, ami csak akkor jelenik meg, ha a kurzus befejezett. A gombra kattintáskor fog lefutni a a LinkedIn profilon való megosztás. 

```javascript
<div>
    {ch.isCompleted ? (
    <button
        className="keret linkedin"
        onClick={() => {
        share(ch);
        }}
    >
        Share achievement in LinkedIn
    </button>
    ) : (
    ""
    )}
</div>
```
2. A Widget inicializálása: 

A widget belső állapotot és DOM-referenciát használ, ezért a használat előtt egyszer inicializálni kell. 

Az init() függvény feladat, hogy összekapcsolja a widgetet egy DOM elemmel, beállítja a megjelenési paramétereket, 
előkészíti az open() függvényt.

 Ehhez egy useEffect hook-ban hívjuk meg, hogy csak egyszer fusson le, és ne inicializálódjon jra minden rendernél. : 

```javascript
 useEffect(() => {
    if (window.LinkedInShare) {
      window.LinkedInShare.init({
        container: "#linkedin-share-root",
        theme: "light",
        locale: "en-US",
      });
    }
  }, []);
```


3. A share függvény 

A függvéyn akkor fut le, amikor rákattintunk a Linkedin megosztás gombra.  A függvényben a megosztás paramétereit állítjuk már be, inicializálásra már nincs szükség. 

```javascript
function share(chapter) {
if (
    window.LinkedInShare &&
    typeof window.LinkedInShare.open === "function"
) {
    window.LinkedInShare.open({
    url: window.location.href,
    title: `Course: ${chapter.courseTitle}`,
    summary: `I just completed "${chapter.title}"!`,
    source: "SkillShare Academy",
    tags: ["learning", "skills"],
    });
} else {
    console.warn("LinkedInShare widget még nem elérhető");
}
}
```

A gombra kattintva egy felugró ablak jelenik meg, amely a LinkedIn megosztási folyamatot szimulálja.
A megoldás demonstrálja, hogyan integrálható egy nem React-alapú, harmadik féltől származó JavaScript widget egy React alkalmazás életciklusába.