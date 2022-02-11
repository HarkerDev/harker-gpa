let weighted = "Harker Weighted";

function submitForm() {
    var totalSum = 0;
    var totalClasses = 0;

    for (i = 1; i < 8; i++) {
        var classID = document.getElementById("class" + i);
        // No class
        if ((i == 6 && (classID.children[0].selectedIndex == 3)) || (i == 7 && (classID.children[0].selectedIndex == 1))) {
            continue;
        // Electives
      } else if ((i == 6 && (classID.children[0].selectedIndex == 2)) || (i == 7 && (classID.children[0].selectedIndex == 0))) {
          totalSum += value(classID.children[0].selectedIndex, classID.children[1].selectedIndex)/2;
          totalClasses += 0.5;
        } else {
          totalSum += value(classID.children[0].selectedIndex, classID.children[1].selectedIndex);
          totalClasses += 1;
        }
    }

    var gpa = round(totalSum / totalClasses, 2);
    var div = document.getElementById("gpa");

    div.innerHTML = "Your " + weighted + " GPA is " + gpa;
}

function value(honors, gradeIndex) {
    var values = [4.3, 4.0, 3.7, 3.3, 3.0, 2.7, 2.3, 2.0, 1.7, 1.3, 1.0, 0.7, 0];
    if(weighted == "Standard Unweighted") {
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

document.getElementById("isWeighted").onclick = function() {
   if(document.getElementById("isWeighted").value == "Standard Unweighted") {
        document.getElementById("isWeighted").value = "Harker Weighted";
        weighted = "Harker Weighted";
    } else if(document.getElementById("isWeighted").value == "Harker Weighted") {
        document.getElementById("isWeighted").value = "Harker Unweighted";
        weighted = "Harker Unweighted";
    } else {
        document.getElementById("isWeighted").value = "Standard Unweighted";
        weighted = "Standard Unweighted";
    }

}
