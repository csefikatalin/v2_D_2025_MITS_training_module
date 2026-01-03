import React from 'react'
import "./css/dashboard.css"


export default function DashboardPage() {
 return (
    <div className=" ">
      <div className="keret nagy padding">
        <h1>Welcome back, { "user name"}!</h1>
        <h2 className="alahuzas">
          Current balance <strong>{"credit" || 0}</strong>{" "}
          credits
        </h2>

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
          <div className="line keret" >
            ITT lesz a VONAL diagram
           {/*  <Line options={options} data={data} /> */}
          </div>
          <div className="pie keret" >
            ITT lesz a KÖR diagram
           {/*  <Doughnut options={options2} data={data2} /> */}
          </div>
        </div>
      </div>
    </div>)
}
