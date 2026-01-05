import React, { useContext, useEffect } from "react";
import "./css/dashboard.css";
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

export default function DashboardPage() {
  const { user, loadUser, serverError } = useContext(AuthContext);
  useEffect(() => {
    loadUser();
  }, []);

  if (!user || !user.user || !serverError ) {
    console.log(user);
    return (
      <div className=" ">
        <div className="keret nagy padding">
          <h1> Felhasználó lekérése folyamatban ... </h1>

          <p>{serverError ? serverError : " Az oldal betöltés alatt ..."}</p>
          <div className="dobozok">
            <div className="keret">
              <h3>{"enrolledCourses" || 0}</h3>
              <p>enrolled courses</p>
            </div>
            <div className="keret">
              <h3>{"completedChapters"}</h3>
              <p>Completed chapters</p>
            </div>
            <div className="keret">
              <h3>{"totalCreditsEarned"}</h3>
              <p>Total credits earned</p>
            </div>
          </div>
          <div className="diagram">
            <div className="line keret">
              ITT lesz a VONAL diagram
              {/*  <Line options={options} data={data} /> */}
            </div>
            <div className="pie keret">
              ITT lesz a KÖR diagram
              {/*  <Doughnut options={options2} data={data2} /> */}
            </div>
          </div>
        </div>
      </div>
    );
  }

  /* diagram komponensek regisztrálása */
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

  /* diagram konfigurálása  */
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
  /* vonaldiagramhoz */
  //A label az utolós 30 nap legyen
  const labels = [];
  for (let index = 0; index < 30; index++) {
    const d = new Date();
    d.setDate(d.getDate() - (29 - index));
    labels.push(d.toISOString().split("T")[0]);
  }

  /* Előállítjuk a recentActivity listából naponta a crediteket 
  Egy objektumban tároljuk -  map */
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

  /* label és az adatok megadása */
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
  const data2 = {
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

  return (
    <div className=" ">
      <div className="keret nagy padding">
        <h1>Welcome back, {user.user.name ? user.user.name : "Guest"}!</h1>
        <h2 className="alahuzas">
          Current balance <strong>{user.user.creditBalance || 0}</strong>{" "}
          credits
        </h2>

        <div className="dobozok">
          <div className="keret">
            <h3>{user.stats.enrolledCourses || 0}</h3>
            <p>enrolled courses</p>
          </div>
          <div className="keret">
            <h3>{user.stats.completedChapters}</h3>
            <p>Completed chapters</p>
          </div>
          <div className="keret">
            <h3>{user.stats.totalCreditsEarned}</h3>
            <p>Total credits earned</p>
          </div>
        </div>
        <div className="diagram">
          <div className="line keret">
          
          <Line options={options} data={data} /> 
          </div>
          <div className="pie keret">
       
            <Doughnut options={options2} data={data2} />
          </div>
        </div>
      </div>
    </div>
  );
}
