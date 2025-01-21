"use strict";

document.addEventListener('DOMContentLoaded', function() {
    const openLoginBtn = document.getElementById("open_login");
    const openGraphBtn = document.getElementById("open_graph");
    const generatePKeyBtn = document.getElementById("generate_p_key");
    const openOptionsBtn = document.getElementById("open_options");
    const form = document.getElementById("popup_form");
    const yearInput = document.getElementById("year");

    chrome.storage.sync.get(['theme', 'lang'], function(result) {
        if (result.theme && result.theme !== 'system') {
            document.documentElement.setAttribute('data-theme', result.theme);
        }
        else {
            const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            document.documentElement.setAttribute('data-theme', prefersDark ? 'dark' : 'light');
        }

        if (result.lang) {
            document.documentElement.setAttribute('data-lang', result.lang);
        }
        else {
            const lang = navigator.language.split('-')[0];
            document.documentElement.setAttribute('data-lang', lang);
        }
    });

    // Load saved values
    chrome.storage.sync.get(['p_key', 'year', 'semester', 'exam_quiz', 'department', 'degree', 'course_number'], function(result) {
        if (result.p_key) document.getElementById('p_key').value = result.p_key;
        if (result.year) yearInput.value = result.year;
        if (result.semester) document.querySelector(`input[name="semester"][value="${result.semester}"]`).checked = true;
        if (result.exam_quiz) document.querySelector(`input[name="exam_quiz"][value="${result.exam_quiz}"]`).checked = true;
    });

    chrome.storage.sync.get(['saved_course_numbers'], function(result) {
        const courseSelect = document.getElementById('course_number');
        if (result.saved_course_numbers) {
            const courseNumbers = result.saved_course_numbers.split(',');
            courseNumbers.forEach(number => {
                const option = document.createElement('option');
                option.value = number;
                option.textContent = number;
                courseSelect.appendChild(option);
            });
        }
    });


    openLoginBtn.addEventListener("click", function() {
        chrome.tabs.create({url: 'https://bgu4u22.bgu.ac.il/apex/f?p=104:LOGIN_DESKTOP'});
    });

    openGraphBtn.addEventListener("click", function() {
        const getStorageData = key => new Promise(resolve => chrome.storage.sync.get(key, resolve));

        Promise.all([
            getStorageData("p_key"),
            getStorageData("year"),
            getStorageData("semester"),
            getStorageData("exam_quiz"),
            getStorageData("department"),
            getStorageData("degree"),
            getStorageData("course_number")
        ]).then(results => {
            const [p_key, year, semester, exam_quiz, department, degree, course_number] = results.map(r => Object.values(r)[0]);

            const url = `https://reports4u22.bgu.ac.il/GeneratePDF.php?server=aristo4stu419c/report=SCRR016w/p_key=${p_key}/p_year=${year}/p_semester=${semester}/out_institution=0/grade=${exam_quiz}/list_department=*${department}@/list_degree_level=*${degree}@/list_course=*${course_number}@/LIST_GROUP=*@/P_FOR_STUDENT=1`;

            chrome.tabs.create({ url: url });
        });
    });

    let savedCount = 0;

    form.addEventListener("submit", function(event) {
        event.preventDefault();
        const formData = {
            p_key: document.getElementById("p_key").value,
            year: yearInput.value,
            semester: document.querySelector('input[name="semester"]:checked')?.value,
            exam_quiz: document.querySelector('input[name="exam_quiz"]:checked')?.value,
            ...document.getElementById("course_number").value.split(".").reduce((acc, val, index) => {
                acc[['department', 'degree', 'course_number'][index]] = val;
                return acc;
            }, {})
        };

        chrome.storage.sync.set(formData, function() {
            let savedMessage = document.getElementById("savedMessage") || document.createElement("p");
            savedMessage.id = "savedMessage";

            if (Object.values(formData).every(val => !val)) {
                savedMessage.textContent = "Saved Nothing";
            } else if (savedCount >= 50) {
                savedMessage.textContent = "Saved! (I gave up counting)";
            } else {
                savedMessage.textContent = `Saved! ${savedCount ? `(${savedCount})` : ""}`;
                savedCount++;
            }

            if (!document.body.contains(savedMessage)) {
                document.body.appendChild(savedMessage);
            }
        });
    });

    generatePKeyBtn.addEventListener("click", function() {
        chrome.scripting.executeScript({file: "scripts/generate_p_key.js"});
    });

    yearInput.addEventListener('wheel', (event) => {
        if (document.activeElement === yearInput) {
            event.preventDefault();
            if (event.deltaY < 0) {
                yearInput.stepUp();
            } else {
                yearInput.stepDown();
            }
        }
    });

    openOptionsBtn.addEventListener("click", function() {
        chrome.runtime.openOptionsPage();
    });
});
