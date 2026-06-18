// ================================
// EduPredict Dean Dashboard
// dashboard.js
// ================================

const students = [
{
    id:"2024UCS001",
    name:"Rahul Sharma",
    department:"B.Tech CSE",
    attendance:48,
    cgpa:6.1,
    risk:87,
    riskLevel:"high"
},
{
    id:"2024UEC021",
    name:"Ananya Singh",
    department:"B.Tech ECE",
    attendance:62,
    cgpa:7.0,
    risk:64,
    riskLevel:"medium"
},
{
    id:"2024UIT013",
    name:"Karan Verma",
    department:"B.Tech IT",
    attendance:89,
    cgpa:8.7,
    risk:14,
    riskLevel:"low"
},
{
    id:"2024UME032",
    name:"Aman Gupta",
    department:"Mechanical Engineering",
    attendance:52,
    cgpa:6.4,
    risk:79,
    riskLevel:"high"
},
{
    id:"2024UEE015",
    name:"Priya Yadav",
    department:"Electrical Engineering",
    attendance:71,
    cgpa:7.5,
    risk:41,
    riskLevel:"medium"
},
{
    id:"2024UBT004",
    name:"Ritika Sharma",
    department:"Biotechnology",
    attendance:92,
    cgpa:9.0,
    risk:8,
    riskLevel:"low"
}
];


// ================================
// THEME TOGGLE
// ================================

const themeToggle =
document.getElementById("themeToggle");

if(themeToggle){

    themeToggle.addEventListener("click",()=>{

        const html =
        document.documentElement;

        const currentTheme =
        html.getAttribute("data-theme");

        if(currentTheme === "dark"){

            html.setAttribute(
                "data-theme",
                "light"
            );

            themeToggle.innerHTML = "🌙";

        }
        else{

            html.setAttribute(
                "data-theme",
                "dark"
            );

            themeToggle.innerHTML = "☀️";

        }

    });

}


// ================================
// HIGH RISK STUDENTS SECTION
// ================================

function renderStudents(){

    const container =
    document.getElementById(
        "studentContainer"
    );

    if(!container) return;

    const highRiskStudents =
    students.filter(
        s => s.risk >= 60
    );

    container.innerHTML = "";

    highRiskStudents.forEach(student => {

        container.innerHTML += `

        <div class="student-item">

            <div class="student-top">

                <div>

                    <h3>
                        ${student.name}
                    </h3>

                    <p>
                        ${student.id}
                    </p>

                </div>

                <span class="badge ${student.riskLevel}">
                    ${student.riskLevel.toUpperCase()}
                </span>

            </div>

            <div class="student-metrics">

                <div>

                    <strong>
                        ${student.attendance}%
                    </strong>

                    <span>
                        Attendance
                    </span>

                </div>

                <div>

                    <strong>
                        ${student.cgpa}
                    </strong>

                    <span>
                        CGPA
                    </span>

                </div>

                <div>

                    <strong>
                        ${student.risk}%
                    </strong>

                    <span>
                        Risk
                    </span>

                </div>

            </div>

        </div>

        `;

    });

}


// ================================
// RECENT PREDICTIONS TABLE
// ================================

function renderPredictionTable(data){

    const table =
    document.getElementById(
        "predictionTable"
    );

    if(!table) return;

    table.innerHTML = "";

    data.forEach(student => {

        table.innerHTML += `

        <tr>

            <td>
                ${student.id}
            </td>

            <td>
                ${student.name}
            </td>

            <td>
                ${student.department}
            </td>

            <td>
                ${student.attendance}%
            </td>

            <td>
                ${student.cgpa}
            </td>

            <td>
                ${student.risk}%
            </td>

            <td>

                <span class="badge ${student.riskLevel}">

                    ${student.riskLevel.toUpperCase()}

                </span>

            </td>

        </tr>

        `;

    });

}


// ================================
// SEARCH STUDENTS
// ================================

function setupSearch(){

    const search =
    document.getElementById(
        "searchBox"
    );

    if(!search) return;

    search.addEventListener(
        "input",
        function(){

            const query =
            this.value.toLowerCase();

            const filtered =
            students.filter(student =>

                student.name
                .toLowerCase()
                .includes(query)

                ||

                student.id
                .toLowerCase()
                .includes(query)

                ||

                student.department
                .toLowerCase()
                .includes(query)

            );

            renderPredictionTable(
                filtered
            );

        }
    );

}


// ================================
// DASHBOARD METRICS
// ================================

function calculateMetrics(){

    const total =
    students.length;

    const high =
    students.filter(
        s => s.risk >= 70
    ).length;

    const medium =
    students.filter(
        s => s.risk >= 40 &&
             s.risk < 70
    ).length;

    const low =
    students.filter(
        s => s.risk < 40
    ).length;

    console.log(
        `Students:${total}
         High:${high}
         Medium:${medium}
         Low:${low}`
    );

}


// ================================
// MODEL STATUS SIMULATION
// ================================

function updateModelStatus(){

    const metricCards =
    document.querySelectorAll(
        ".metric-card h3"
    );

    if(metricCards.length < 2)
        return;

    metricCards[0].textContent =
    "Active";

    metricCards[1].textContent =
    "91.2%";

}


// ================================
// INIT
// ================================

document.addEventListener(
    "DOMContentLoaded",
    () => {

        renderStudents();

        renderPredictionTable(
            students
        );

        setupSearch();

        calculateMetrics();

        updateModelStatus();

        console.log(
            "EduPredict Dean Dashboard Loaded"
        );

    }
);