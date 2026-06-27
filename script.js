const semestersData = [
    {
        name: "Semester 1",
        subjects: [
            { name: "Programming for Problem Solving", credit: 5 },
            { name: "Statistical Methods", credit: 3 },
            { name: "Practical", credit: 5 }
        ]
    },
    {
        name: "Semester 2",
        subjects: [
            { name: "Python Programming", credit: 5 },
            { name: "Discrete Mathematics", credit: 3 },
            { name: "Python Lab", credit: 5 }
        ]
    },
    {
        name: "Semester 3",
        subjects: [
            { name: "Artificial Intelligence", credit: 5 },
            { name: "IoT and Applications", credit: 3 },
            { name: "AI Lab", credit: 5 }
        ]
    },
    {
        name: "Semester 4",
        subjects: [
            { name: "R Programming", credit: 5 },
            { name: "Cloud Computing", credit: 3 },
            { name: "R Lab", credit: 5 }
        ]
    },
    {
        name: "Semester 5",
        subjects: [
            { name: "Machine Learning", credit: 4 },
            { name: "RDBMS", credit: 3 },
            { name: "Cryptography", credit: 3 },
            { name: "ML Lab", credit: 3 },
            { name: "RDBMS Lab", credit: 3 },
            { name: "Naan Mudhalvan", credit: 2 },
            { name: "Project", credit: 4 }
        ]
    },
    {
        name: "Semester 6",
        subjects: [
            { name: "TF", credit: 3 },
            { name: "DF", credit: 3 },
            { name: "Robot", credit: 3 },
            { name: "BIGDATA", credit: 3 },
            { name: "TF lab", credit: 3 },
            { name: "DF lab", credit: 3 }
        ]
    }
];

function createUI() {
    const container = document.getElementById("semesters");

    semestersData.forEach((sem, sIndex) => {
        const div = document.createElement("div");
        div.className = "semester";

        div.innerHTML = `<h3>${sem.name} - GPA: <span id="gpa${sIndex}" style="visibility: hidden;">0.00</span></h3>`;

        sem.subjects.forEach((sub, subIndex) => {
            div.innerHTML += `
                <div class="subject">
                    <label>${sub.name} (Credit: ${sub.credit})</label>
                    <input type="number" min="0" max="100" placeholder="Marks"
                        oninput="calculateSemester(${sIndex})"
                        id="sem${sIndex}sub${subIndex}">
                </div>
            `;
        });

        container.appendChild(div);
    });
}

function calculateSemester(index) {
    let totalPoints = 0;
    let totalCredits = 0;
    let allFilled = true;

    semestersData[index].subjects.forEach((sub, i) => {
        const mark = document.getElementById(`sem${index}sub${i}`).value;

        if (mark !== "") {
            const grade = mark / 10;
            totalPoints += grade * sub.credit;
            totalCredits += sub.credit;
        } else {
            allFilled = false;
        }
    });

    const gpaSpan = document.getElementById(`gpa${index}`);
    if (allFilled) {
        let gpa = totalCredits ? (totalPoints / totalCredits).toFixed(2) : 0;
        gpaSpan.innerText = gpa;
        gpaSpan.style.visibility = "visible";
    } else {
        gpaSpan.style.visibility = "hidden";
    }

    calculateCGPA();
}

function calculateCGPA() {
    let totalPoints = 0;
    let totalCredits = 0;

    semestersData.forEach((sem, sIndex) => {
        sem.subjects.forEach((sub, subIndex) => {
            const mark = document.getElementById(`sem${sIndex}sub${subIndex}`).value;
            if (mark !== "") {
                const grade = mark / 10;
                totalPoints += grade * sub.credit;
                totalCredits += sub.credit;
            }
        });
    });

    let cgpa = totalCredits ? (totalPoints / totalCredits).toFixed(2) : 0;
    document.getElementById("cgpa").innerText = cgpa;

    // Percentage calculation (CGPA * 10)
    let percentage = (cgpa * 10).toFixed(2);
    const percentageEl = document.getElementById("percentage");
    if (percentageEl) {
        percentageEl.innerText = percentage + "%";
    }
}

async function sendToGoogle(data) {
    const response = await fetch("https://script.google.com/macros/s/AKfycbziKHPHyX9OLjni2XzOaSxuMJXmcqtGt0Q3so2Ek7AVu_j5rIzQQnlygxrZkzU0aCyK/exec", {
        method: "POST",
        body: JSON.stringify(data)
    });

    return response.json();
}

function showSummary() {
    const name = document.getElementById("name").value;
    const regNo = document.getElementById("regNo").value;

    if (!name || !regNo) {
        alert("Enter Name and Register Number");
        return;
    }

    // Ensure all calculations are up-to-date
    semestersData.forEach((_, index) => calculateSemester(index));

    const submitBtn = document.querySelector('button[onclick="showSummary()"]');
    const originalText = submitBtn.innerText;
    submitBtn.innerHTML = '<span class="spinner"></span> Saving...';
    submitBtn.classList.add("loading");
    submitBtn.disabled = true;

    const semGPAs = [];
    semestersData.forEach((sem, index) => {
        const gpaEl = document.getElementById(`gpa${index}`);
        const gpa = gpaEl ? gpaEl.innerText : "0.00";
        semGPAs.push(gpa);
    });

    const cgpa = document.getElementById("cgpa").innerText;

    const data = {
        name: name,
        regNo: regNo,
        sem1: semGPAs[0] || "0.00",
        sem2: semGPAs[1] || "0.00",
        sem3: semGPAs[2] || "0.00",
        sem4: semGPAs[3] || "0.00",
        sem5: semGPAs[4] || "0.00",
        sem6: semGPAs[5] || "0.00",
        cgpa: cgpa,
        percentage: (parseFloat(cgpa) * 10).toFixed(2) + "%"
    };

    sendToGoogle(data)
        .then(() => {
            alert("Data Saved Successfully");
        })
        .catch(() => {
            alert("Error Saving Data");
        })
        .finally(() => {
            submitBtn.innerHTML = originalText;
            submitBtn.classList.remove("loading");
            submitBtn.disabled = false;
        });
}


function resetForm() {
    location.reload();
}

createUI();
