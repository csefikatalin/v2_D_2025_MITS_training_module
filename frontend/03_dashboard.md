# Dashboard elkészítése

## User lekérése az AuthContextből

Használni kell a useEffectet, hogy az oldalra való belépéskor le tudjuk hívni a felhasználó adatait. 
Ameddig nincs felhasználói adat, jelenítsük meg csak az oldal wireframe-jét. 

```javascript
  const { user, loadUser } = useContext(AuthContext);
  useEffect(() => {
    loadUser();
  }, []);

  if (!user || !user.user  ) {
    return <div>Loading dashboard...</div>;
  }
```

Nézd meg, hogy az AuthContext-ben a users/me végpont hogy hozza le a user objektumot! Most szükségünk lesz a teljes objektumra, ezért   setUser(response.data. user);  helyett a   setUser(response.data); - t kell használni! 


Ezután elhelyezhetjük a user objektumból a megfelelő helyre a megfelelő adatokat. 


# Chart.js integráció

A Chart.js egy népszerű, nyílt forráskódú JavaScript könyvtár diagramok készítésére. React-ben a `react-chartjs-2` wrapper-t használjuk.
<br>
<a href="https://www.chartjs.org/docs/latest/getting-started/">Chart.js dokumentáció </a>
<br>
<a href="https://react-chartjs-2.js.org/">React - chartjs-2 dokumentáció </a>
<br>
<a href="https://github.com/reactchartjs/react-chartjs-2/blob/master/sandboxes/line/default/App.tsx">Vonaldiagram példa a github-on</a>

## Chart.js telepítése

```bash
npm install chart.js react-chartjs-2
```

## Diagramok használata

1. Importálni kell a megfelelő komponenseket a chart.js és a react-chartjs-2 csomagokból. A dokumnetáció példáiban pontosan megmutatja, hogy melyeket. <a href="https://github.com/reactchartjs/react-chartjs-2/blob/master/sandboxes/line/default/App.tsx">Vonaldiagram példa a github-on</a>
2. Regisztrálni kell a felhasznált komponenseket
3. A diagram konfigurálása (options)
4. A vízszintes tengely/cimkék feliratainak megadása (labels)
5. Adatok megadása
6. Diagramkomponens elhelyezése a megfelelő helyre.

### 1. Komponensek importálása

```javascript
import { AuthContext } from "../contexts/AuthContext";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";
import { Chart, ArcElement } from "chart.js";
import { Doughnut } from "react-chartjs-2";
```

### 2. Komponensek regisztrálása

```javascript
/* kördiagramhoz */
ChartJS.register(ArcElement, Tooltip, Legend);
/* vonaldiagramhoz  */
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);
```

### 3. Diagram konfigurálása

```javascript
/* vonaldiagramhoz  */
const options = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: "top",
      display: false,
    },
    title: {
      display: true,
      text: "Credit progress (Last 30 days)",
    },
  },
  scales: {
    y: {
      beginAtZero: true,
      title: {
        display: true,
        text: "Credits",
      },
    },
    x: {
      title: {
        display: false,
        text: "Date",
      },
    },
  },
};
```

```javascript
/* kördiagramhoz  */
  const options2 = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom",
      },
      title: {
        display: true,
        text: "Statisztikák",
      },
    },
  };
```

### 4, 5. Label és az adatok megadása

```javascript
/* kördiagramhoz  */
const data = {
  labels: ["Completed chapters", "Enrolled Courses"],
  datasets: [
    {
      label: "# of Votes",
      data: [user.stats.completedChapters, user.stats.enrolledCourses],
      /* data: [12, 5] */
      backgroundColor: ["rgba(255, 99, 132, 0.2)", "rgba(54, 162, 235, 0.2)"],
      borderColor: ["rgba(255, 99, 132, 1)", "rgba(54, 162, 235, 1)"],
      borderWidth: 2,
    },
  ],
};
/* vonaldiagramhoz */
//A label az utolós 30 nap legyen
const labels = [];
for (let index = 0; index < 30; index++) {
  const d = new Date();
  d.setDate(d.getDate() - (29 - index));
  labels.push(d.toISOString().split("T")[0]);
}

/* Előállítjuk a recentActivity listából naponta a crediteket */
const creditsByDate = {};

  // végigmegyünk az aktivitásokon 
  
   if (user.recentActivity !== undefined) {
    user.recentActivity.forEach((item) => {
      const date = item.timestamp.split("T")[0]; // YYYY-MM-DD
      if (!creditsByDate[date]) {
        creditsByDate[date] = 0;
      }
      creditsByDate[date] += item.creditsEarned;
    });
  }
  // Az utolsó 30 nap dátumát kikeressük az asszociatív tömbből és megnézzük a hozzá tartozó értékeket
  const dataValues = labels.map((date) => creditsByDate[date] || 0);

  const data = {
    labels, // X tengely – utolsó 30 nap
    datasets: [
      {
        labels: "Credits",
        data: dataValues, // Y tengely
        borderColor: "rgb(53, 162, 235)",
        backgroundColor: "rgba(53, 162, 235, 0.5)",
      },
    ],
  };
```

### 6. Diagramok elhelyezése

```javascript
<Line options={options} data={data} />
<Doughnut options={options2} data={data2} />
```

A diagram magassága a szülőelemtől fgg, így érdemes a szülőelemre beállítani egy rugalmas magasságot: height: clamp(250px, 40vh, 400px);
