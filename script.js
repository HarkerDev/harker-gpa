let weighted = "Harker Weighted";
let semNum = 0;
var nSub = 0;

function submitForm() {
    var totalSum = 0;
    var totalClasses = 0;
    for (j = 1; j <= semNum; j++) {
        var bySemSum = 0;
        var bySemCount = 0;
        for (i = 1; i < 8; i++) {
            var classID = document.getElementById("sem" + j + "class" + i);
            // No class
            const level = classID.children[1].selectedIndex;
            if ((i == 6 && (level == 3)) || (i == 7 && (level == 1))) {
                continue;
                // Electives
            } else if ((i == 6 && (level == 2)) || (i == 7 && (level == 0))) {
                totalSum += value(level, classID.children[2].selectedIndex) / 2;
                totalClasses += 0.5;
                bySemSum += value(level, classID.children[2].selectedIndex) / 2;
                bySemCount += 0.5;
            } else {
                totalSum += value(level, classID.children[2].selectedIndex);
                bySemSum += value(level, classID.children[2].selectedIndex);
                totalClasses += 1;
                bySemCount += 1;
            }
        }
        var gpa = round(bySemSum / bySemCount, 2);
        if (semNum != 1) {
            var div = document.getElementById("sem" + j);
            document.getElementById("sLine" + j).remove();
            if (document.getElementById("SGPA" + j) != null){
                document.getElementById("SGPA" + j).remove();
            }
            var sGPA = document.createElement('p');
            sGPA.setAttribute("id", "SGPA" + j);
            sGPA.innerHTML = "Your " + weighted + " GPA is " + gpa;
            div.appendChild(sGPA);
            
            const separatorLine = document.createElement("hr");
            separatorLine.setAttribute("id", "sLine" + j);
            separatorLine.style.width = "50%";
            div.appendChild(separatorLine);
        }
    }
            nSub++;
    var gpa = round(totalSum / totalClasses, 2);
    var div = document.getElementById("gpa");

    div.innerHTML = "Your " + weighted + " GPA is " + gpa;
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

document.getElementById("isWeighted").onclick = function () {
    if (document.getElementById("isWeighted").value == "Standard Unweighted") {
        document.getElementById("isWeighted").value = "Harker Weighted";
        weighted = "Harker Weighted";
    } else if (document.getElementById("isWeighted").value == "Harker Weighted") {
        document.getElementById("isWeighted").value = "Harker Unweighted";
        weighted = "Harker Unweighted";
    } else {
        document.getElementById("isWeighted").value = "Standard Unweighted";
        weighted = "Standard Unweighted";
    }

}

function createNewSemester(newSemNum) {
    const form = document.getElementById("classList");
    const semList = document.getElementById("semList");
    const semDiv = document.createElement("div");
    const semText = document.createElement("div");
    semText.innerHTML = "Semester " + newSemNum.toString();
    semDiv.appendChild(semText);
    semDiv.setAttribute("class", "sem");
    semDiv.setAttribute("id", "sem" + newSemNum.toString());
    for (i = 0; i < 7; i++) {
        var classDiv = document.createElement("div");
        classDiv.setAttribute("class", "class");
        var s = "sem" + newSemNum.toString() + "class" + (i + 1).toString();
        classDiv.setAttribute("id", s);
        const courseName = document.createElement("input");
        courseName.type = "text";
        courseName.placeholder = "Enter Course Name";
        classDiv.appendChild(courseName);
        const weight = document.createElement("select");
        if (i == 6) {
            const option3 = document.createElement("option");
            option3.selected = false;
            option3.value = "elective";
            option3.innerHTML = "Elective";
            const option4 = document.createElement("option");
            option4.selected = false;
            option4.value = "none";
            option4.innerHTML = "No Class";
            weight.appendChild(option3);
            weight.appendChild(option4);
        }
        else {
            const option1 = document.createElement("option");
            option1.selected = true;
            option1.value = "regular";
            option1.innerHTML = "Regular";
            const option2 = document.createElement("option");

            option2.selected = false;
            option2.value = "smartkid";
            option2.innerHTML = "Honors/AP";
            weight.appendChild(option1);
            weight.appendChild(option2);
            if (i == 5) {
                const option3 = document.createElement("option");
                option3.selected = false;
                option3.value = "elective";
                option3.innerHTML = "Elective";
                const option4 = document.createElement("option");
                option4.selected = false;
                option4.value = "none";
                option4.innerHTML = "No Class";
                weight.appendChild(option3);
                weight.appendChild(option4);
            }
        }
        classDiv.appendChild(weight);
        const grade = document.createElement("select");
        const grades = {
            "A+": "aplus", "A": "a", "A-": "aminus",
            "B+": "bplus", "B": "b", "B-": "bminus",
            "C+": "cplus", "C": "c", "C-": "cminus",
            "D+": "dplus", "D": "d", "D-": "dminus", "F/I": "L"
        };
        Object.keys(grades).forEach(element => {
            const optiongrade = document.createElement("option");
            optiongrade.innerHTML = element;
            optiongrade.value = grades[element];
            if (element == "A+") {
                optiongrade.selected = true;
            }
            grade.appendChild(optiongrade);
        });

        classDiv.appendChild(grade);
        semDiv.appendChild(classDiv);
        semList.appendChild(semDiv);
    }
    
    const separatorLine = document.createElement("hr");
    separatorLine.setAttribute("id", "sLine" + newSemNum);
    console.log(newSemNum);
    separatorLine.style.width = "50%";
    semDiv.appendChild(separatorLine);
}

addSemester();
