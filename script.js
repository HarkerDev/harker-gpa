function submitForm() {

	/*
		var weightedIndex = document.forms[0].uww.selectedIndex;
		var weighted=true;
		if (weightedIndex == 0) {
			weighted=false;
		}
	*/

	var totalSum = 0;
	var totalClasses = 7;

	for (i = 1; i < 8; i++) {
		var classs = document.getElementById("class" + i);
		if ((i == 6 || i == 7) && (classs.children[0].selectedIndex == 0)) {
			totalClasses--;
			continue;
		}
		totalSum += value(classs.children[0].selectedIndex, classs.children[1].selectedIndex);
		/*
		if (!weighted) {
			totalSum += value(false, classs.children[1].selectedIndex);
		} else {
			totalSum += value(classs.children[0].selectedIndex, classs.children[1].selectedIndex);
		}
		*/
	}

	var gpa = round(totalSum / totalClasses, 2);
	var div = document.getElementById("gpa");

	div.innerHTML = "Your Harker GPA is " + gpa;
}

function value(honors, gradeIndex) {
	var values = [4.3, 4.0, 3.7, 3.3, 3.0, 2.7, 2.3, 2.0, 1.7, 1.3, 1.0, 0.7, 0];
	var value = 0;
	if (honors == 1) {
		value += 0.5;
	}
	value += values[gradeIndex];
	return value;
}

function round(value, precision) {
	var multiplier = Math.pow(10, precision || 0);
	return Math.round(value * multiplier) / multiplier;
}
