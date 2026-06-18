// ======================================
// EduPredict Student Directory
// students.js
// ======================================

const students = [];

const names = [
"Rahul Sharma","Aarav Gupta","Ishita Verma","Karan Mehta",
"Priya Kapoor","Rohan Bansal","Ananya Singh","Harsh Yadav",
"Nikita Arora","Aman Gupta","Sakshi Jain","Ritesh Kumar",
"Priya Yadav","Mohit Sharma","Tanya Khanna","Ritika Sharma",
"Arjun Sethi","Neha Gupta","Yash Malhotra","Dev Sharma",
"Ankit Verma","Simran Kaur","Vansh Bhatia","Aditi Saxena",
"Sarthak Jain","Muskan Arora","Shivam Agarwal","Kashish Mehra",
"Raghav Singhal","Sneha Arora","Aditya Sharma","Vivek Gupta",
"Nikhil Verma","Aditi Mehra","Sarthak Kapoor","Tanya Bansal",
"Riya Arora","Abhishek Jain","Kritika Sharma","Rohit Singh",
"Pooja Gupta","Aryan Malhotra","Manav Arora","Kunal Sethi",
"Nandini Khanna","Shreya Jain","Laksh Gupta","Harshit Bhatia",
"Anjali Kapoor","Yash Aggarwal"
];

const departments = [
"B.Tech CSE",
"B.Tech IT",
"B.Tech ECE",
"Mechanical Engineering",
"Electrical Engineering",
"Biotechnology",
"MBA",
"BBA"
];

// ======================================
// Generate 50 Students
// ======================================

for(let i=0;i<50;i++){

    const risk =
    Math.floor(Math.random()*100);

    let riskLevel = "low";

    if(risk >= 70){
        riskLevel = "high";
    }
    else if(risk >= 40){
        riskLevel = "medium";
    }

    students.push({

        id:
        `2024U${String(i+1).padStart(4,"0")}`,

        name:
        names[i],

        department:
        departments[
            Math.floor(
                Math.random()*
                departments.length
            )
        ],

        attendance:
        Math.floor(
            40 + Math.random()*55
        ),

        cgpa:
        (
            5 +
            Math.random()*4
        ).toFixed(1),

        risk:risk,

        riskLevel:riskLevel

    });

}

// ======================================
// Render Students
// ======================================

function renderStudents(data){

    const grid =
    document.getElementById(
        "studentGrid"
    );

    if(!grid) return;

    grid.innerHTML = "";

    data.forEach(student => {

        grid.innerHTML += `

        <div class="student-card">

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

            <div class="metrics">

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

            <div class="actions">

                <button
                class="view-btn">

                    View Profile

                </button>

                <button
                class="predict-btn"
                onclick="location.href='index.html'">

                    Predict

                </button>

            </div>

        </div>

        `;

    });

}

// ======================================
// Filters
// ======================================

function applyFilters(){

    const search =
    document
    .getElementById("searchBox")
    .value
    .toLowerCase();

    const risk =
    document
    .getElementById("riskFilter")
    .value;

    const dept =
    document
    .getElementById("departmentFilter")
    .value;

    const filtered =
    students.filter(student => {

        const searchMatch =

            student.name
            .toLowerCase()
            .includes(search)

            ||

            student.id
            .toLowerCase()
            .includes(search)

            ||

            student.department
            .toLowerCase()
            .includes(search);

        const riskMatch =

            risk === "all"

            ||

            student.riskLevel === risk;

        const deptMatch =

            dept === "all"

            ||

            student.department === dept;

        return (
            searchMatch &&
            riskMatch &&
            deptMatch
        );

    });

    renderStudents(filtered);

}

// ======================================
// Theme Toggle
// ======================================

const themeToggle =
document.getElementById(
    "themeToggle"
);

if(themeToggle){

    themeToggle.addEventListener(
        "click",
        () => {

            const html =
            document.documentElement;

            const currentTheme =
            html.getAttribute(
                "data-theme"
            );

            if(currentTheme === "dark"){

                html.setAttribute(
                    "data-theme",
                    "light"
                );

                themeToggle.innerHTML =
                "🌙";

                localStorage.setItem(
                    "theme",
                    "light"
                );

            }
            else{

                html.setAttribute(
                    "data-theme",
                    "dark"
                );

                themeToggle.innerHTML =
                "☀️";

                localStorage.setItem(
                    "theme",
                    "dark"
                );

            }

        }
    );

}

const savedTheme =
localStorage.getItem(
    "theme"
);

if(savedTheme){

    document.documentElement
    .setAttribute(
        "data-theme",
        savedTheme
    );

    if(themeToggle){

        themeToggle.innerHTML =
        savedTheme === "dark"
        ? "☀️"
        : "🌙";

    }

}

// ======================================
// Initialize
// ======================================

document.addEventListener(
    "DOMContentLoaded",
    () => {

        renderStudents(students);

        document
        .getElementById("searchBox")
        ?.addEventListener(
            "input",
            applyFilters
        );

        document
        .getElementById("riskFilter")
        ?.addEventListener(
            "change",
            applyFilters
        );

        document
        .getElementById("departmentFilter")
        ?.addEventListener(
            "change",
            applyFilters
        );

    }
);