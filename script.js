let weighted = "Harker Weighted";
let semNum = 0;
var nSub = 0;

function readCourse(classDiv) {
    const level = classDiv.querySelector(".course-level").value;
    const gradeIndex = classDiv.querySelector(".course-grade").selectedIndex;
    const credit = (level == "elective") ? 0.5 : 1;
    return {
        credit: credit,
        points: value(level == "smartkid" ? 1 : 0, gradeIndex) * credit
    };
}

function submitForm() {
    var totalSum = 0;
    var totalClasses = 0;
    for (j = 1; j <= semNum; j++) {
        var bySemSum = 0;
        var bySemCount = 0;
        const classDivs = document.getElementById("sem" + j).querySelectorAll(".class");
        classDivs.forEach(classDiv => {
            const course = readCourse(classDiv);
            if (course == null) {
                return;
            }
            totalSum += course.points;
            totalClasses += course.credit;
            bySemSum += course.points;
            bySemCount += course.credit;
        });
        var gpa = bySemCount > 0 ? round(bySemSum / bySemCount, 2) : "—";
        if (semNum != 1) {
            updateSemSummary(document.getElementById("sem" + j), gpa);
        }
    }
            nSub++;
    var gpa = totalClasses > 0 ? round(totalSum / totalClasses, 2) : "—";
    var div = document.getElementById("gpa");

    div.innerHTML = "Your overall " + weighted + " GPA is " + gpa + "!";
}

function addSemester() {
    if (semNum == 1) {
        document.getElementById("removeSemButton").style.display = "inline-block";
    }
    if (semNum == 7) {
        document.getElementById("addSemButton").style.display = "none";
    }
    createNewSemester(++semNum);
}

function removeLastSemester() {
    document.getElementById("sem" + (semNum)).remove();
    semNum--;
    if (semNum == 1) {
        document.getElementById("removeSemButton").style.display = "none";
    }
    document.getElementById("addSemButton").style.display = "inline-block";
}

function value(honors, gradeIndex) {
    var values = [4.3, 4.0, 3.7, 3.3, 3.0, 2.7, 2.3, 2.0, 1.7, 1.3, 1.0, 0.7, 0];
    if (weighted == "Standard Unweighted") {
        values[0] = 4.0;
        values[values.length - 2] = 0;
    }
    var value = 0;
    if (honors == 1 && weighted == "Harker Weighted") {
        value += 0.5;
    }
    value += values[gradeIndex];
    return value;
}

function round(value, precision) {
    var multiplier = Math.pow(10, precision || 0);
    return Math.round(value * multiplier) / multiplier;
}

document.querySelectorAll("#isWeighted input[type=radio]").forEach(radio => {
    radio.onchange = function () {
        weighted = radio.value;
    };
});

const LEVELS = {
    "regular": "Regular",
    "smartkid": "Honors/AP",
    "elective": "Elective"
};

const GRADES = {
    "A+": "aplus", "A": "a", "A-": "aminus",
    "B+": "bplus", "B": "b", "B-": "bminus",
    "C+": "cplus", "C": "c", "C-": "cminus",
    "D+": "dplus", "D": "d", "D-": "dminus", "F/I": "L"
};

function addCourse(courseList, defaultLevel) {
    defaultLevel = defaultLevel || "regular";
    const classDiv = document.createElement("div");
    classDiv.setAttribute("class", "class");

    const courseName = document.createElement("input");
    courseName.type = "text";
    courseName.placeholder = "Enter Course Name";
    classDiv.appendChild(courseName);

    const weight = document.createElement("select");
    weight.setAttribute("class", "course-level");
    Object.keys(LEVELS).forEach(key => {
        const option = document.createElement("option");
        option.value = key;
        option.innerHTML = LEVELS[key];
        option.selected = (key == defaultLevel);
        weight.appendChild(option);
    });
    classDiv.appendChild(weight);

    const grade = document.createElement("select");
    grade.setAttribute("class", "course-grade");
    Object.keys(GRADES).forEach(element => {
        const optiongrade = document.createElement("option");
        optiongrade.innerHTML = element;
        optiongrade.value = GRADES[element];
        optiongrade.selected = (element == "A+");
        grade.appendChild(optiongrade);
    });
    classDiv.appendChild(grade);

    const removeButton = document.createElement("button");
    removeButton.type = "button";
    removeButton.setAttribute("class", "remove-course");
    removeButton.setAttribute("aria-label", "Remove course");
    removeButton.innerHTML = "&times;";
    removeButton.onclick = function () {
        classDiv.remove();
        updateRemoveCourseButtons(courseList);
        updateSemSummary(courseList.closest(".sem"));
    };
    classDiv.appendChild(removeButton);

    courseList.appendChild(classDiv);
    updateRemoveCourseButtons(courseList);
    updateSemSummary(courseList.closest(".sem"));
}

function updateSemSummary(semDiv, gpa) {
    const summary = semDiv.querySelector(".sem-summary");
    const count = semDiv.querySelectorAll(".class").length;
    const courseText = count + (count == 1 ? " course" : " courses");
    if (gpa !== undefined) {
        summary.dataset.gpa = gpa;
    }
    summary.innerHTML = summary.dataset.gpa ? courseText + " · GPA " + summary.dataset.gpa : courseText;
}

function toggleSemester(semDiv, caret) {
    const collapsed = semDiv.classList.toggle("collapsed");
    caret.innerHTML = collapsed ? "&#9656;" : "&#9662;";
}

function updateRemoveCourseButtons(courseList) {
    const classDivs = courseList.querySelectorAll(".class");
    classDivs.forEach(classDiv => {
        classDiv.querySelector(".remove-course").style.visibility =
            (classDivs.length > 1) ? "visible" : "hidden";
    });
}

function createNewSemester(newSemNum) {
    const semList = document.getElementById("semList");
    const semDiv = document.createElement("div");
    semDiv.setAttribute("class", "sem");
    semDiv.setAttribute("id", "sem" + newSemNum.toString());
    semList.appendChild(semDiv);

    const semHeader = document.createElement("div");
    semHeader.setAttribute("class", "sem-header");
    semDiv.appendChild(semHeader);

    const caret = document.createElement("span");
    caret.setAttribute("class", "sem-caret");
    caret.innerHTML = "&#9662;";
    semHeader.appendChild(caret);

    const semText = document.createElement("span");
    semText.innerHTML = "Semester " + newSemNum.toString();
    semText.setAttribute("class", "sem-title");
    semHeader.appendChild(semText);

    const semSummary = document.createElement("span");
    semSummary.setAttribute("class", "sem-summary");
    semHeader.appendChild(semSummary);

    semHeader.onclick = function () {
        toggleSemester(semDiv, caret);
    };

    const semBody = document.createElement("div");
    semBody.setAttribute("class", "sem-body");
    semDiv.appendChild(semBody);

    const colHeads = document.createElement("div");
    colHeads.setAttribute("class", "col-heads");
    ["Course Name", "Course Level", "Course Grade", ""].forEach(heading => {
        const head = document.createElement("span");
        head.setAttribute("class", "col-label");
        head.innerHTML = heading;
        colHeads.appendChild(head);
    });
    semBody.appendChild(colHeads);

    const courseList = document.createElement("div");
    courseList.setAttribute("class", "course-list");
    semBody.appendChild(courseList);
    for (i = 0; i < 7; i++) {
        addCourse(courseList, (i == 6) ? "elective" : "regular");
    }

    const addCourseButton = document.createElement("button");
    addCourseButton.type = "button";
    addCourseButton.setAttribute("class", "add-course");
    addCourseButton.innerHTML = "<span class=\"icon\">+</span> Add Course";
    addCourseButton.onclick = function () {
        addCourse(courseList);
    };
    semBody.appendChild(addCourseButton);

    const separatorLine = document.createElement("hr");
    separatorLine.setAttribute("id", "sLine" + newSemNum);
    semDiv.appendChild(separatorLine);
}

addSemester();
