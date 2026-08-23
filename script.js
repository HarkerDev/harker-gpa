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
    const semDivs = document.querySelectorAll("#semList .sem");
    semDivs.forEach(semDiv => {
        var bySemSum = 0;
        var bySemCount = 0;
        semDiv.querySelectorAll(".class").forEach(classDiv => {
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
        if (semDivs.length != 1) {
            updateSemSummary(semDiv, gpa);
        }
    });
    nSub++;
    var gpa = totalClasses > 0 ? round(totalSum / totalClasses, 2) : "—";
    var div = document.getElementById("gpa");

    div.innerHTML = "Your overall " + weighted + " GPA is " + gpa + "!";
}

const MAX_SEMESTERS = 8;

const SVG_OPEN = "<svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" " +
    "stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\" focusable=\"false\">";

const ICON_DUPLICATE = SVG_OPEN +
    "<rect x=\"9\" y=\"9\" width=\"11\" height=\"11\" rx=\"2\"></rect>" +
    "<path d=\"M5 15V6a2 2 0 0 1 2-2h9\"></path></svg>";

const ICON_CLOSE = SVG_OPEN + "<path d=\"M6 6l12 12M18 6L6 18\"></path></svg>";

function addSemester(courses) {
    if (semNum >= MAX_SEMESTERS) {
        return;
    }
    const semDiv = createNewSemester(courses);
    document.getElementById("semList").appendChild(semDiv);
    renumberSemesters();
}

function duplicateSemester(semDiv) {
    if (semNum >= MAX_SEMESTERS) {
        return;
    }
    const courses = [];
    semDiv.querySelectorAll(".class").forEach(classDiv => {
        courses.push({
            name: classDiv.querySelector(".course-name").value.trim(),
            level: classDiv.querySelector(".course-level").value,
            grade: classDiv.querySelector(".course-grade").value
        });
    });
    const newSemDiv = createNewSemester(courses.length ? courses : null);
    semDiv.after(newSemDiv);
    renumberSemesters();
}

function removeSemester(semDiv) {
    if (semNum <= 1) {
        return;
    }
    semDiv.remove();
    renumberSemesters();
}

function renumberSemesters() {
    const semDivs = document.querySelectorAll("#semList .sem");
    semNum = semDivs.length;
    semDivs.forEach((semDiv, index) => {
        const num = index + 1;
        semDiv.id = "sem" + num;
        semDiv.querySelector(".sem-title").innerHTML = "Semester " + num;
        semDiv.querySelector(".remove-sem").style.display = (semNum > 1) ? "" : "none";
        semDiv.querySelector(".duplicate-sem").style.display =
            (semNum < MAX_SEMESTERS) ? "" : "none";
    });
    document.getElementById("addSemButton").style.display =
        (semNum < MAX_SEMESTERS) ? "inline-flex" : "none";
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

const GRADE_VALUES = Object.keys(GRADES).map(key => GRADES[key]);

function addCourse(courseList, course) {
    course = course || {};
    const defaultLevel = LEVELS[course.level] ? course.level : "regular";
    const defaultGrade = GRADE_VALUES.indexOf(course.grade) >= 0 ? course.grade : "aplus";
    const classDiv = document.createElement("div");
    classDiv.setAttribute("class", "class");

    const courseName = document.createElement("input");
    courseName.type = "text";
    courseName.placeholder = "Enter Course Name";
    courseName.setAttribute("class", "course-name");
    courseName.value = course.name || "";
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
        optiongrade.selected = (GRADES[element] == defaultGrade);
        grade.appendChild(optiongrade);
    });
    classDiv.appendChild(grade);

    const removeButton = document.createElement("button");
    removeButton.type = "button";
    removeButton.setAttribute("class", "remove-course");
    removeButton.setAttribute("aria-label", "Remove course");
    removeButton.innerHTML = ICON_CLOSE;
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

function createNewSemester(courses) {
    const semDiv = document.createElement("div");
    semDiv.setAttribute("class", "sem");

    const semHeader = document.createElement("div");
    semHeader.setAttribute("class", "sem-header");
    semDiv.appendChild(semHeader);

    const caret = document.createElement("span");
    caret.setAttribute("class", "sem-caret");
    caret.innerHTML = "&#9662;";
    semHeader.appendChild(caret);

    const semText = document.createElement("span");
    semText.setAttribute("class", "sem-title");
    semHeader.appendChild(semText);

    const semSummary = document.createElement("span");
    semSummary.setAttribute("class", "sem-summary");
    semHeader.appendChild(semSummary);

    const semActions = document.createElement("span");
    semActions.setAttribute("class", "sem-actions");
    semHeader.appendChild(semActions);

    const duplicateSemButton = document.createElement("button");
    duplicateSemButton.type = "button";
    duplicateSemButton.setAttribute("class", "sem-icon-button duplicate-sem");
    duplicateSemButton.setAttribute("aria-label", "Duplicate semester");
    duplicateSemButton.setAttribute("title", "Duplicate semester");
    duplicateSemButton.innerHTML = ICON_DUPLICATE;
    duplicateSemButton.onclick = function (event) {
        event.stopPropagation();
        duplicateSemester(semDiv);
    };
    semActions.appendChild(duplicateSemButton);

    const removeSemButton = document.createElement("button");
    removeSemButton.type = "button";
    removeSemButton.setAttribute("class", "sem-icon-button remove-sem");
    removeSemButton.setAttribute("aria-label", "Remove semester");
    removeSemButton.setAttribute("title", "Remove semester");
    removeSemButton.innerHTML = ICON_CLOSE;
    removeSemButton.onclick = function (event) {
        event.stopPropagation();
        removeSemester(semDiv);
    };
    semActions.appendChild(removeSemButton);

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
    if (courses && courses.length) {
        courses.forEach(course => addCourse(courseList, course));
    } else {
        for (i = 0; i < 7; i++) {
            addCourse(courseList, { level: (i == 6) ? "elective" : "regular" });
        }
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
    semDiv.appendChild(separatorLine);

    return semDiv;
}

const FILE_FORMAT = "harker-gpa";
const FILE_VERSION = 1;

function serializeState() {
    const semesters = [];
    for (var s = 1; s <= semNum; s++) {
        const courses = [];
        document.getElementById("sem" + s).querySelectorAll(".class").forEach(classDiv => {
            courses.push({
                name: classDiv.querySelector(".course-name").value.trim(),
                level: classDiv.querySelector(".course-level").value,
                grade: classDiv.querySelector(".course-grade").value
            });
        });
        semesters.push({ courses: courses });
    }
    return {
        format: FILE_FORMAT,
        version: FILE_VERSION,
        gradingSystem: weighted,
        semesters: semesters
    };
}

function loadState(data) {
    if (!data || data.format !== FILE_FORMAT || !Array.isArray(data.semesters) || !data.semesters.length) {
        throw new Error("This doesn't look like a Harker GPA file.");
    }

    const radio = document.querySelector("#isWeighted input[value=\"" + (data.gradingSystem || "") + "\"]");
    if (radio) {
        radio.checked = true;
        weighted = radio.value;
    }

    document.getElementById("semList").innerHTML = "";
    semNum = 0;
    document.getElementById("gpa").innerHTML = "";

    data.semesters.slice(0, MAX_SEMESTERS).forEach(semester => {
        const courses = Array.isArray(semester && semester.courses) ? semester.courses : [];
        addSemester(courses.length ? courses : null);
    });

    submitForm();
}

function exportData() {
    const blob = new Blob([JSON.stringify(serializeState(), null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "harker-gpa-" + new Date().toISOString().slice(0, 10) + ".json";
    document.body.appendChild(link);
    link.click();
    link.remove();
    setTimeout(function () { URL.revokeObjectURL(url); }, 1000);
    showStatus("Exported " + semNum + (semNum == 1 ? " semester" : " semesters"));
}

function importData() {
    document.getElementById("importFile").click();
}

function readImportFile(file) {
    if (!file) {
        return;
    }
    const reader = new FileReader();
    reader.onload = function () {
        try {
            loadState(JSON.parse(reader.result));
            showStatus("Imported " + file.name);
        } catch (err) {
            showStatus(err instanceof SyntaxError ? "Couldn't read that file." : err.message, true);
        }
    };
    reader.readAsText(file);
}

function resetData() {
    if (!confirm("Clear all courses and start over?")) {
        return;
    }
    document.getElementById("semList").innerHTML = "";
    semNum = 0;
    document.getElementById("gpa").innerHTML = "";
    addSemester();
    showStatus("Cleared");
}

function showStatus(message, isError) {
    const status = document.getElementById("toolStatus");
    status.innerHTML = "";
    status.appendChild(document.createTextNode(message));
    status.classList.toggle("error", !!isError);
    status.classList.add("visible");
}

document.getElementById("importFile").onchange = function () {
    readImportFile(this.files[0]);
    this.value = "";
};

addSemester();
