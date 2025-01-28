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
            year: "Year",
            semester: "Semester",
            generate_key: "Generate Primary Key",
            options: "Options",
            login: "Login",
            graph: "Graph",
            key: "Key",
            first_semester: "Fall",
            second_semester: "Spring",
            third_semester: "Summer",
            exam_number: "Exam Number",
            total_exam: "Total",
            quiz_number: "Quiz Number",
            course_number: "Course Number",
            select_course: "Select Course"
        },
        he: {
            year: "שנה:",
            semester: "סמסטר:",
            generate_key: "צור מפתח",
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
            course_number: "מספר קורס:",
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
            el.textContent = translations[lang][key];
        });
    });

    // Load saved values
    chrome.storage.sync.get(
        [
            "p_key",
            "year",
            "semester",
            "exam_quiz",
            "saved_course_numbers",
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

    form.addEventListener("submit", function (event) {
        event.preventDefault();
        const formData = {
            p_key: document.getElementById("key").value,
            year: yearInput.value,
            semester: document.querySelector('input[name="semester"]:checked')?.value,
            exam_quiz: document.querySelector('input[name="exam_quiz"]:checked')?.value,
            ...document
                .getElementById("course_number")
                .value.split(".")
                .reduce((acc, val, index) => {
                    acc[["department", "degree", "course"][index]] = val;
                    return acc;
                }, {}),
            full_course_number: document.getElementById("course_number").value,
        };

        chrome.storage.sync.set(formData, function () {
            let savedMessage =
                document.getElementById("savedMessage") || document.createElement("p");
            savedMessage.id = "savedMessage";

            if (Object.values(formData).every((val) => !val)) {
                savedMessage.textContent = "Saved Nothing";
            } else if (savedCount >= 50) {
                savedMessage.textContent = "Saved! (I gave up counting)";
            } else {
                savedMessage.textContent = `Saved! ${savedCount ? `(${savedCount})` : ""
                    }`;
                savedCount++;
            }

            if (!document.body.contains(savedMessage)) {
                document.body.appendChild(savedMessage);
            }
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
            generatePKeyBtn.textContent = "Generating...";
        } else {
            generatePKeyBtn.classList.remove("generating");
            generatePKeyBtn.textContent = "Generate Primary Key";
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
