"use strict";

document.addEventListener("DOMContentLoaded", function () {
    // Get elements
    const openLoginBtn = document.getElementById("open_login");
    const openGraphBtn = document.getElementById("open_graph");
    const generatePKeyBtn = document.getElementById("generate_key");
    const openOptionsBtn = document.getElementById("open_options");
    const form = document.getElementById("popup_form");
    const yearInput = document.getElementById("year");
    const semesterInput = document.getElementById("semester");
    const examInput = document.getElementById("exam");
    const quizInput = document.getElementById("quiz");
    const courseNumberInput = document.getElementById("course_number");

    const translations = {
        en: {
            year: "Year:",
            semester: "Semester:",
            options: "Options",
            login: "Login",
            graph: "Graph",
            key: "Key:",
            first_semester: "Fall",
            second_semester: "Spring",
            third_semester: "Summer",
            exam_number: "Exam Number:",
            total_exam: "Total",
            quiz_number: "Quiz Number:",
            course_number: "Course:",
            select_course: "Select Course"
        },
        he: {
            year: "שנה:",
            semester: "סמסטר:",
            options: "אפשרויות",
            login: "כניסה",
            graph: "גרף",
            key: "מפתח:",
            first_semester: "סתיו",
            second_semester: "אביב",
            third_semester: "קיץ",
            exam_number: "מספר מבחן:",
            total_exam: "סה\"כ",
            quiz_number: "מספר בוחן:",
            course_number: "קורס:",
            select_course: "בחר קורס"
        },
    };

    // Set theme and language
    chrome.storage.sync.get(["theme", "lang"], function (result) {
        if (result.theme && result.theme !== "system") {
            document.documentElement.setAttribute("data-theme", result.theme);
        } else {
            const prefersDark = window.matchMedia(
                "(prefers-color-scheme: dark)"
            ).matches;
            document.documentElement.setAttribute(
                "data-theme",
                prefersDark ? "dark" : "light"
            );
        }

        let lang = result.lang;
        if (!lang || lang === 'system') {
            const prefersHebrew = window.matchMedia('(prefers-language-scheme: hebrew)').matches;
            if (lang === 'system') {
                lang = prefersHebrew ? 'he' : 'en';
            }
        }
        document.documentElement.setAttribute("lang", lang);
        const elements = document.querySelectorAll('[data-i18n]');
        elements.forEach(el => {
            const key = el.getAttribute('data-i18n');
            if (key === 'options') {
                el.innerHTML = `
                <svg xmlns="http://www.w3.org/2000/svg" id="options_icon" viewBox="0 0 16 16">
                    <path d="M8 4.754a3.246 3.246 0 1 0 0 6.492 3.246 3.246 0 0 0 0-6.492M5.754 8a2.246 2.246 0 1 1 4.492 0 2.246 2.246 0 0 1-4.492 0"/>
                    <path d="M9.796 1.343c-.527-1.79-3.065-1.79-3.592 0l-.094.319a.873.873 0 0 1-1.255.52l-.292-.16c-1.64-.892-3.433.902-2.54 2.541l.159.292a.873.873 0 0 1-.52 1.255l-.319.094c-1.79.527-1.79 3.065 0 3.592l.319.094a.873.873 0 0 1 .52 1.255l-.16.292c-.892 1.64.901 3.434 2.541 2.54l.292-.159a.873.873 0 0 1 1.255.52l.094.319c.527 1.79 3.065 1.79 3.592 0l.094-.319a.873.873 0 0 1 1.255-.52l.292.16c1.64.893 3.434-.902 2.54-2.541l-.159-.292a.873.873 0 0 1 .52-1.255l.319-.094c1.79-.527 1.79-3.065 0-3.592l-.319-.094a.873.873 0 0 1-.52-1.255l.16-.292c.893-1.64-.902-3.433-2.541-2.54l-.292.159a.873.873 0 0 1-1.255-.52zm-2.633.283c.246-.835 1.428-.835 1.674 0l.094.319a1.873 1.873 0 0 0 2.693 1.115l.291-.16c.764-.415 1.6.42 1.184 1.185l-.159.292a1.873 1.873 0 0 0 1.116 2.692l.318.094c.835.246.835 1.428 0 1.674l-.319.094a1.873 1.873 0 0 0-1.115 2.693l.16.291c.415.764-.42 1.6-1.185 1.184l-.291-.159a1.873 1.873 0 0 0-2.693 1.116l-.094.318c-.246.835-1.428.835-1.674 0l-.094-.319a1.873 1.873 0 0 0-2.692-1.115l-.292.16c-.764.415-1.6-.42-1.184-1.185l.159-.291A1.873 1.873 0 0 0 1.945 8.93l-.319-.094c-.835-.246-.835-1.428 0-1.674l.319-.094A1.873 1.873 0 0 0 3.06 4.377l-.16-.292c-.415-.764.42-1.6 1.185-1.184l.292.159a1.873 1.873 0 0 0 2.692-1.115z"/>
                </svg>
                ${translations[lang][key]}`;
            }
            else if (key === 'login') {
                el.innerHTML = `
                <svg xmlns="http://www.w3.org/2000/svg" id="login_icon" viewBox="0 0 16 16">
                    <path d="M8.5 10c-.276 0-.5-.448-.5-1s.224-1 .5-1 .5.448.5 1-.224 1-.5 1"/>
                    <path d="M10.828.122A.5.5 0 0 1 11 .5V1h.5A1.5 1.5 0 0 1 13 2.5V15h1.5a.5.5 0 0 1 0 1h-13a.5.5 0 0 1 0-1H3V1.5a.5.5 0 0 1 .43-.495l7-1a.5.5 0 0 1 .398.117M11.5 2H11v13h1V2.5a.5.5 0 0 0-.5-.5M4 1.934V15h6V1.077z"/>
                </svg>
                ${translations[lang][key]}`;
            }
            else if (key === 'graph') {
                el.innerHTML = `
                <svg xmlns="http://www.w3.org/2000/svg" id="graph_icon" viewBox="0 0 16 16">
                    <path d="M4 11H2v3h2zm5-4H7v7h2zm5-5v12h-2V2zm-2-1a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h2a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1zM6 7a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v7a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1zm-5 4a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1z"/>
                </svg>
                ${translations[lang][key]}`;
            }
            else {
                el.textContent = translations[lang][key];
            }
        });
    });

    // Load saved values
    chrome.storage.sync.get(
        [
            "p_key",
            "year",
            "semester",
            "exam_quiz",
            "saved_courses",
            "full_course_number"
        ],
        function (result) {
            if (result.p_key) document.getElementById("key").value = result.p_key;
            if (result.year) yearInput.value = result.year;
            if (result.semester)
                document.querySelector(
                    `input[name="semester"][value="${result.semester}"]`
                ).checked = true;
            if (result.exam_quiz)
                document.querySelector(
                    `input[name="exam_quiz"][value="${result.exam_quiz}"]`
                ).checked = true;

            const courseSelect = document.getElementById("course_number");
            if (result.saved_course_numbers) {
                const courseNumbers = result.saved_course_numbers.split(",");
                courseNumbers.forEach((number) => {
                    const option = document.createElement("option");
                    option.value = number;
                    option.textContent = number;
                    courseSelect.appendChild(option);
                });
            }
            if (result.saved_courses) {
                const courses = result.saved_courses;
                for (const [key, value] of Object.entries(courses)) {
                    const option = document.createElement("option");
                    option.value = key;
                    option.textContent = value;
                    courseSelect.appendChild(option);
                }
            }
            if (result.full_course_number) {
                courseSelect.value = result.full_course_number;
            }
        }
    );

    // Open login page
    openLoginBtn.addEventListener("click", function () {
        chrome.tabs.create({
            url: "https://bgu4u22.bgu.ac.il/apex/f?p=104:LOGIN_DESKTOP",
        });
    });

    // Open graph
    openGraphBtn.addEventListener("click", function () {
        const getStorageData = (key) =>
            new Promise((resolve) => chrome.storage.sync.get(key, resolve));

        Promise.all([
            getStorageData("p_key"),
            getStorageData("year"),
            getStorageData("semester"),
            getStorageData("exam_quiz"),
            getStorageData("department"),
            getStorageData("degree"),
            getStorageData("course"),
        ]).then((results) => {
            const [
                p_key,
                year,
                semester,
                exam_quiz,
                department,
                degree,
                course
            ] = results.map((r) => Object.values(r)[0]);

            const url =
                `https://reports4u22.bgu.ac.il/GeneratePDF.php?` +
                `server=aristo4stu419c` +
                `/report=SCRR016w` +
                `/p_key=${p_key}` +
                `/p_year=${year}` +
                `/p_semester=${semester}` +
                `/out_institution=0` +
                `/grade=${exam_quiz}` +
                `/list_department=*${department}@` +
                `/list_degree_level=*${degree}@` +
                `/list_course=*${course}@` +
                `/LIST_GROUP=*@` +
                `/P_FOR_STUDENT=1`;

            chrome.tabs.create({ url: url });
        });
    });

    // Year input wheel event
    yearInput.addEventListener("wheel", (event) => {
        if (document.activeElement === yearInput) {
            event.preventDefault();
            if (event.deltaY < 0) {
                yearInput.stepUp();
            } else {
                yearInput.stepDown();
            }
            yearInput.dispatchEvent(new Event("change"));
        }
    });
    // Save year input
    yearInput.addEventListener("change", function () {
        const year = yearInput.value;
        if (year < 1970 || year > new Date().getFullYear()) {
            return;
        }
        chrome.storage.sync.set({ year: year }, function () {
            console.log("Year saved:", year);
        });
    });

    semesterInput.addEventListener("change", function () {
        const semester = document.querySelector('input[name="semester"]:checked').value;
        chrome.storage.sync.set({ semester: semester }, function () {
            console.log("Semester saved:", semester);
        });
    });

    examInput.addEventListener("change", function () {
        const exam_quiz = document.querySelector('input[name="exam_quiz"]:checked').value;
        chrome.storage.sync.set({ exam_quiz: exam_quiz }, function () {
            console.log("Exam saved:", exam_quiz);
        });
    });

    quizInput.addEventListener("change", function () {
        const exam_quiz = document.querySelector('input[name="exam_quiz"]:checked').value;
        chrome.storage.sync.set({ exam_quiz: exam_quiz }, function () {
            console.log("Quiz saved:", exam_quiz);
        });
    });

    courseNumberInput.addEventListener("change", function () {
        const full_course_number = courseNumberInput.value;
        const course_number = full_course_number.split(".");
        const department = course_number[0];
        const degree = course_number[1];
        const course = course_number[2];
        chrome.storage.sync.set({
            full_course_number,
            department,
            degree,
            course,
        }, function () {
            console.log("Course number saved:", full_course_number);
        });
    });

    // Generate primary key
    generatePKeyBtn.addEventListener("click", async function () {
        chrome.storage.sync.get(["user_name", "id", "password"], function (result) {
            if (!result.user_name || !result.id || !result.password) {
                alert("Please fill in your credentials in the options page.");
                chrome.runtime.openOptionsPage();
                return;
            }
        });
        try {
            setGenerateStyle(true);
            const tabId = await openBGUTab();
            try {
                chrome.scripting.executeScript({
                    target: { tabId: tabId },
                    files: ["scripts/generate_p_key.js"],
                });
            } catch (error) {
                console.error(error);
                chrome.tabs.remove(tabId);
            }
        } catch (error) {
            console.error("Error:", error);
        }
    });

    // Listen for primary key generation
    chrome.runtime.onMessage.addListener(function (message) {
        if (message.type === "P_KEY_FOUND") {
            document.getElementById("key").value = message.pKey;
            setGenerateStyle(false);
        }
        else if (message.type === "P_KEY_NOT_FOUND") {
            alert("Failed to generate primary key. Please try again.");
            setGenerateStyle(false);
        }
    });

    // Set loading style for generate primary key button
    const setGenerateStyle = (loading) => {
        if (loading) {
            generatePKeyBtn.classList.add("generating");
        } else {
            generatePKeyBtn.classList.remove("generating");
        }
    };

    // Open options page
    openOptionsBtn.addEventListener("click", function () {
        chrome.runtime.openOptionsPage();
    });
});

// Open BGU tab
async function openBGUTab() {
    try {
        // Create new tab
        const tab = await chrome.tabs.create({
            url: "https://bgu4u22.bgu.ac.il/apex/10g/r/f_login1004/login_desktop?p_lang=",
            active: false,
        });
        console.log("Tab loaded and ready:", tab.id);
        return tab.id;
    } catch (error) {
        console.error("Failed to create tab:", error);
        throw error;
    }
}
