document.getElementById("open_login").addEventListener("click", function() {
    chrome.tabs.create({url: 'https://bgu4u22.bgu.ac.il/apex/f?p=104:LOGIN_DESKTOP'});
});

document.addEventListener('DOMContentLoaded', function() {
    // Retrieve saved values from Chrome storage and populate the form fields
    chrome.storage.sync.get(['p_key', 'year', 'semester', 'exam_quiz', 'department', 'degree', 'course_number'], function(result) {
        if (result.p_key) {
            document.getElementById('p_key').value = result.p_key;
        }
        if (result.year) {
            document.getElementById('year').value = result.year;
        }
        switch (result.semester) {
            case "1":
                document.getElementById('first_semester').checked = true;
                break;
            case "2":
                document.getElementById('second_semester').checked = true;
                break;
            case "3":
                document.getElementById('third_semester').checked = true;
                break;
        }
        switch (result.exam_quiz) {
            case "1":
                document.getElementById('first_exam').checked = true;
                break;
            case "2":
                document.getElementById('second_exam').checked = true;
                break;
            case "3":
                document.getElementById('third_exam').checked = true;
                break;
            case "4":
                document.getElementById('fourth_exam').checked = true;
                break;
            case "5":
                document.getElementById('total_exam').checked = true;
                break;
            case "11":
                document.getElementById('first_quiz').checked = true;
                break;
            case "12":
                document.getElementById('second_quiz').checked = true;
                break;
            case "13":
                document.getElementById('third_quiz').checked = true;
                break;
            case "14":
                document.getElementById('fourth_quiz').checked = true;
                break;
        }
        if (result.department && result.degree && result.course_number) {
            document.getElementById('course_number').value = result.department + "." + result.degree + "." + result.course_number;
        }
    });
});

document.getElementById("open_graph").addEventListener("click", function() {
    Promise.all([
        new Promise((resolve) => chrome.storage.sync.get("p_key", resolve)),
        new Promise((resolve) => chrome.storage.sync.get("year", resolve)),
        new Promise((resolve) => chrome.storage.sync.get("semester", resolve)),
        new Promise((resolve) => chrome.storage.sync.get("exam_quiz", resolve)),
        new Promise((resolve) => chrome.storage.sync.get("department", resolve)),
        new Promise((resolve) => chrome.storage.sync.get("degree", resolve)),
        new Promise((resolve) => chrome.storage.sync.get("course_number", resolve))
    ]).then((results) => {
        const p_key = results[0].p_key;
        const year = results[1].year;
        const semester = results[2].semester;
        const exam_quiz = results[3].exam_quiz;
        const department = results[4].department;
        const degree = results[5].degree;
        const course_number = results[6].course_number;

        const url = 'https://reports4u22.bgu.ac.il/GeneratePDF.php?server=aristo4stu419c/report=SCRR016w/' +
            'p_key=' + p_key +
            '/p_year=' + year +
            '/p_semester=' + semester +
            '/out_institution=0/grade=' + exam_quiz +
            '/list_department=*' + department +
            '@/list_degree_level=*' + degree +
            '@/list_course=*' + course_number +
            '@/LIST_GROUP=*@/P_FOR_STUDENT=1';

        chrome.tabs.create({ url: url });
    });
});

let savedCount = 0;

document.getElementById("popup_form").addEventListener("submit", function() {
    event.preventDefault();
    let p_key = document.getElementById("p_key").value;
    let year = document.getElementById("year").value;
    let semesterInput = document.querySelector('input[name="semester"]:checked');
    let semester = semesterInput ? semesterInput.value : null;
    let exam_quizInput = document.querySelector('input[name="exam_quiz"]:checked');
    let exam_quiz = exam_quizInput ? exam_quizInput.value : null;
    let course = document.getElementById("course_number").value.split(".");
    let department = course[0];
    let degree = course[1];
    let course_number = course[2];

    if(p_key) chrome.storage.sync.set({p_key: p_key});
    if(year) chrome.storage.sync.set({year: year});
    if(semester) chrome.storage.sync.set({semester: semester});
    if(exam_quiz) chrome.storage.sync.set({exam_quiz: exam_quiz});
    if(department) chrome.storage.sync.set({department: department});
    if(degree) chrome.storage.sync.set({degree: degree});
    if(course_number) chrome.storage.sync.set({course_number: course_number});

    let existingMessage = document.getElementById("savedMessage");
    if (existingMessage) {
        existingMessage.remove();
    }
    let savedMessage = document.createElement("p");
    savedMessage.id = "savedMessage";
    savedMessage.style.marginTop = "5px";
    if(!p_key && !year && !semester && !exam_quiz && !department && !degree && !course_number) {
        savedMessage.textContent = "Saved Nothing";
    }
    else if(savedCount >= 50){
        savedMessage.textContent = "Saved! (I gave up counting)";
    }
    else {
        savedMessage.textContent = "Saved! "+(savedCount ? "("+savedCount+")" : "");
        savedCount++;
    }
    document.body.appendChild(savedMessage);

});

document.getElementById("generate_p_key").addEventListener("click", function() {
    //activate script from scripts/generate_p_key.js
    chrome.scripting.executeScript({file: "scripts/generate_p_key.js"});
});

year_input = document.getElementById("year");
year_input.addEventListener('wheel', (event) => {
    event.preventDefault(); // Prevent the page from scrolling
    if (event.deltaY < 0) {
        year_input.stepUp(); // Scroll up to increase
    } else {
        year_input.stepDown(); // Scroll down to decrease
    }
});
