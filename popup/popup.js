"use strict";

document.addEventListener("DOMContentLoaded", function () {
    // Get elements
    const openLoginBtn = document.getElementById("open_login");
    const openGraphBtn = document.getElementById("open_graph");
    const openOptionsBtn = document.getElementById("open_options");
    const yearInput = document.getElementById("year");
    const semesterInput = document.getElementById("semester");
    const examInput = document.getElementById("exam");
    const quizInput = document.getElementById("quiz");
    const courseNumberInput = document.getElementById("course_number");

    let lang;

    const optionsIcon = `
                <svg xmlns="http://www.w3.org/2000/svg" id="options_icon" viewBox="0 0 16 16">
                    <path d="M8 4.754a3.246 3.246 0 1 0 0 6.492 3.246 3.246 0 0 0 0-6.492M5.754 8a2.246 2.246 0 1 1 4.492 0 2.246 2.246 0 0 1-4.492 0"/>
                    <path d="M9.796 1.343c-.527-1.79-3.065-1.79-3.592 0l-.094.319a.873.873 0 0 1-1.255.52l-.292-.16c-1.64-.892-3.433.902-2.54 2.541l.159.292a.873.873 0 0 1-.52 1.255l-.319.094c-1.79.527-1.79 3.065 0 3.592l.319.094a.873.873 0 0 1 .52 1.255l-.16.292c-.892 1.64.901 3.434 2.541 2.54l.292-.159a.873.873 0 0 1 1.255.52l.094.319c.527 1.79 3.065 1.79 3.592 0l.094-.319a.873.873 0 0 1 1.255-.52l.292.16c1.64.893 3.434-.902 2.54-2.541l-.159-.292a.873.873 0 0 1 .52-1.255l.319-.094c1.79-.527 1.79-3.065 0-3.592l-.319-.094a.873.873 0 0 1-.52-1.255l.16-.292c.893-1.64-.902-3.433-2.541-2.54l-.292.159a.873.873 0 0 1-1.255-.52zm-2.633.283c.246-.835 1.428-.835 1.674 0l.094.319a1.873 1.873 0 0 0 2.693 1.115l.291-.16c.764-.415 1.6.42 1.184 1.185l-.159.292a1.873 1.873 0 0 0 1.116 2.692l.318.094c.835.246.835 1.428 0 1.674l-.319.094a1.873 1.873 0 0 0-1.115 2.693l.16.291c.415.764-.42 1.6-1.185 1.184l-.291-.159a1.873 1.873 0 0 0-2.693 1.116l-.094.318c-.246.835-1.428.835-1.674 0l-.094-.319a1.873 1.873 0 0 0-2.692-1.115l-.292.16c-.764.415-1.6-.42-1.184-1.185l.159-.291A1.873 1.873 0 0 0 1.945 8.93l-.319-.094c-.835-.246-.835-1.428 0-1.674l.319-.094A1.873 1.873 0 0 0 3.06 4.377l-.16-.292c-.415-.764.42-1.6 1.185-1.184l.292.159a1.873 1.873 0 0 0 2.692-1.115z"/>
                </svg>`;

    const loginIcon = `
                <svg xmlns="http://www.w3.org/2000/svg" id="login_icon" viewBox="0 0 16 16">
                    <path d="M8.5 10c-.276 0-.5-.448-.5-1s.224-1 .5-1 .5.448.5 1-.224 1-.5 1"/>
                    <path d="M10.828.122A.5.5 0 0 1 11 .5V1h.5A1.5 1.5 0 0 1 13 2.5V15h1.5a.5.5 0 0 1 0 1h-13a.5.5 0 0 1 0-1H3V1.5a.5.5 0 0 1 .43-.495l7-1a.5.5 0 0 1 .398.117M11.5 2H11v13h1V2.5a.5.5 0 0 0-.5-.5M4 1.934V15h6V1.077z"/>
                </svg>`;

    const graphIcon = `
                <svg xmlns="http://www.w3.org/2000/svg" id="graph_icon" viewBox="0 0 16 16">
                    <path d="M4 11H2v3h2zm5-4H7v7h2zm5-5v12h-2V2zm-2-1a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h2a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1zM6 7a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v7a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1zm-5 4a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1z"/>
                </svg>`;

    const loadingGraphIcon = `
                <svg xmlns="http://www.w3.org/2000/svg" id="graph_icon" viewBox="0 0 16 16">
                    <path d="M4 11H2v3h2zm5-4H7v7h2zm5-5v12h-2V2zm-2-1a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h2a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1zM6 7a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v7a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1zm-5 4a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1z"/>`;

    chrome.storage.local.get("not_first_time", function (result) {
        if (!result.not_first_time) {
            chrome.storage.local.set({ not_first_time: true, last_key_update: 0 });
            chrome.storage.local.set({ lang: 'system', theme: 'system', enable_departmental_details: 0 });
        }
    });

    const translations = {
        en: {
            loadingGraph: "Loading Graph",
            year: "Year:",
            semester: "Semester:",
            options: "Options",
            login: "BGU Site",
            graph: "Graph",
            key: "Key:",
            first_semester: "Fall",
            second_semester: "Spring",
            third_semester: "Summer",
            exam_number: "Exam Number:",
            total_exam: "Total",
            quiz_number: "Quiz Number:",
            course_number: "Course:",
            select_course: "Select Course or add more in options page"
        },
        he: {
            loadingGraph: "טוען גרף",
            year: "שנה:",
            semester: "סמסטר:",
            options: "אפשרויות",
            login: "אתר בנ\"ג",
            graph: "גרף",
            key: "מפתח:",
            first_semester: "סתיו",
            second_semester: "אביב",
            third_semester: "קיץ",
            exam_number: "מספר מבחן:",
            total_exam: "סה\"כ",
            quiz_number: "מספר בוחן:",
            course_number: "קורס:",
            select_course: "בחר קורס או הוסף עוד בדף האפשרויות"
        },
    };

    // Set theme and language
    chrome.storage.local.get(["theme", "lang"], function (result) {
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

        lang = result.lang || 'system';
        if (!lang || lang === 'system') {
            const prefersHebrew = navigator.language.startsWith('he');
            if (lang === 'system') {
                lang = prefersHebrew ? 'he' : 'en';
            }
        }
        document.documentElement.setAttribute("lang", lang);
        const elements = document.querySelectorAll('[data-i18n]');
        elements.forEach(el => {
            const key = el.getAttribute('data-i18n');
            const text = translations[lang][key];
            el.innerHTML = text;
            if (key === 'options') {
                el.innerHTML = optionsIcon + text;
            }
            else if (key === 'login') {
                el.innerHTML = loginIcon + text;
            }
            else if (key === 'graph') {
                el.innerHTML = graphIcon + text;
            }
        });
    });

    chrome.storage.local.get(["user_name", "id", "password"], async function (result) {
        if (!result.user_name || !result.id || !result.password) {
            alertPopup("Please fill in your user credentials in the options page.", "אנא מלא את פרטי המשתמש בדף האפשרויות.");
            chrome.runtime.openOptionsPage();
            return;
        }
    });

    // Load saved values
    chrome.storage.local.get(
        [
            "year",
            "semester",
            "exam_quiz",
            "saved_courses",
            "full_course_number"
        ],
        function (result) {
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
            if (result.saved_courses) {
                const courses = result.saved_courses;
                for (const course_number in courses) {
                    const option = document.createElement("option");
                    option.value = course_number
                    option.textContent = courses[course_number];
                    courseSelect.appendChild(option);
                }
            }
            // check if course number is saved and if saved courses contain the course number
            if (result.full_course_number && result.saved_courses && result.saved_courses[result.full_course_number]) {
                courseSelect.value = result.full_course_number;
            }
        }
    );

    function alertPopup(enMessage, heMessage) {
        if (lang === 'he') {
            alert(heMessage);
        } else {
            alert(enMessage);
        }
    }

    // Open BGU login page
    openLoginBtn.addEventListener("click", function () {
        chrome.tabs.create({
            url: "https://bgu4u22.bgu.ac.il/apex/f?p=104:LOGIN_DESKTOP",
        });
    });

    async function setLoadingGraphStyle(loading) {
        if (loading) {
            openGraphBtn.classList.add("loading");
            openGraphBtn.disabled = true;

            const loadingPaths = [
                '<path d="M1 11a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1z"/>',
                '<path d="M6 7a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v7a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1z"/>',
                '<path d="M11 2a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1h-2a1 1 0 0 1-1-1z"/>'
            ];

            let currentIndex = 0;
            const interval = setInterval(() => {
                openGraphBtn.innerHTML = loadingGraphIcon + loadingPaths[currentIndex] + `</svg> ` + translations[lang].loadingGraph;

                currentIndex = (currentIndex + 1) % loadingPaths.length;
            }, 500);

            // Store interval ID to clear it later
            openGraphBtn.loadingInterval = interval;
        } else {
            openGraphBtn.classList.remove("loading");
            openGraphBtn.disabled = false;
            clearInterval(openGraphBtn.loadingInterval);
            openGraphBtn.innerHTML = graphIcon + translations[lang].graph;
        }
    }

    function waitForKey() {
        return new Promise((resolve, reject) => {
            setLoadingGraphStyle(true);
            const timeout = setTimeout(() => {
                setLoadingGraphStyle(false);
                reject(new Error('Key generation timeout'));
            }, 15000); // 15 second timeout

            chrome.runtime.onMessage.addListener(async function listener(message, sender) {
                if (message.type === "P_KEY_FOUND") {
                    clearTimeout(timeout);
                    chrome.runtime.onMessage.removeListener(listener);
                    await chrome.storage.local.set({ p_key: message.pKey });
                    await chrome.storage.local.set({ last_key_update: new Date().getTime() });
                    await chrome.storage.local.remove("generatePKey");
                    setLoadingGraphStyle(false);
                    resolve(message.pKey);
                    chrome.tabs.remove(sender.tab.id);
                } else if (message.type === "P_KEY_NOT_FOUND") {
                    clearTimeout(timeout);
                    chrome.runtime.onMessage.removeListener(listener);
                    setLoadingGraphStyle(false);
                    chrome.tabs.remove(sender.tab.id);
                    reject(new Error('Key generation failed'));
                    await chrome.storage.local.remove("generatePKey");
                }
            });
        });
    }

    // Open graph
    openGraphBtn.addEventListener("click", async function () {
        setLoadingGraphStyle(true);

        const getStorageData = (key) =>
            new Promise((resolve) => chrome.storage.local.get(key, resolve));

        Promise.all([
            getStorageData("year"),
            getStorageData("semester"),
            getStorageData("exam_quiz"),
            getStorageData("department"),
            getStorageData("degree"),
            getStorageData("course"),
            getStorageData("last_key_update"),
            getStorageData("enable_departmental_details")
        ]).then(async (results) => {
            const [
                year,
                semester,
                exam_quiz,
                department,
                degree,
                course,
                lastKeyUpdate,
                enable_departmental_details
            ] = results.map((r) => Object.values(r)[0]);

            if (!year || !semester || !exam_quiz || !department || !degree || !course) {
                alertPopup("Please fill in all the required fields.", "אנא מלא את כל השדות הנדרשים.");
                setLoadingGraphStyle(false);
                return;
            }
            try {
                const currentTime = new Date().getTime();
                console.log("Current time:", currentTime);
                if (currentTime - lastKeyUpdate > 420000) {
                    await generatePKey();
                    await waitForKey();
                }
            } catch (error) {
                alertPopup("Failed to generate key. Please try again.", "נכשל ביצירת מפתח. אנא נסה שוב.");
                setLoadingGraphStyle(false);
                console.error(error);
                return;
            }

            const { p_key } = await getStorageData("p_key");

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
                `/P_FOR_STUDENT=${enable_departmental_details ? 0 : 1}`;

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
        chrome.storage.local.set({ year: year }, function () {
            console.log("Year saved:", year);
        });
    });

    semesterInput.addEventListener("change", function () {
        const semester = document.querySelector('input[name="semester"]:checked').value;
        chrome.storage.local.set({ semester: semester }, function () {
            console.log("Semester saved:", semester);
        });
    });

    examInput.addEventListener("change", function () {
        const exam_quiz = document.querySelector('input[name="exam_quiz"]:checked').value;
        chrome.storage.local.set({ exam_quiz: exam_quiz }, function () {
            console.log("Exam saved:", exam_quiz);
        });
    });

    quizInput.addEventListener("change", function () {
        const exam_quiz = document.querySelector('input[name="exam_quiz"]:checked').value;
        chrome.storage.local.set({ exam_quiz: exam_quiz }, function () {
            console.log("Quiz saved:", exam_quiz);
        });
    });

    courseNumberInput.addEventListener("change", function () {
        const full_course_number = courseNumberInput.value;
        const course_number = full_course_number.split(".");
        const department = course_number[0];
        const degree = course_number[1];
        const course = course_number[2];
        chrome.storage.local.set({
            full_course_number,
            department,
            degree,
            course,
        }, function () {
            console.log("Course number saved:", full_course_number);
        });
    });

    // Generate primary key
    async function generatePKey() {
        try {
            await chrome.storage.local.set({ generatePKey: 1 });
            const tabId = await openBGU22Tab();
        } catch (error) {
            console.error("Error:", error);
            throw error;
        }
    }

    // Open options page
    openOptionsBtn.addEventListener("click", function () {
        chrome.runtime.openOptionsPage();
    });

    // Mouse-tracking gradient effect
    openGraphBtn.addEventListener('mousemove', (e) => {
        const rect = openGraphBtn.getBoundingClientRect();
        const x = e.clientX - rect.left; // x position within the element
        const y = e.clientY - rect.top;  // y position within the element

        // Calculate the percentage of the mouse position
        const percentX = x / rect.width;
        const percentY = y / rect.height;

        // Update the gradient based on mouse position
        const startColor = getComputedStyle(document.documentElement).getPropertyValue('--button-start-color').trim();
        const endColor = getComputedStyle(document.documentElement).getPropertyValue('--button-end-color').trim();
        openGraphBtn.style.backgroundImage = `radial-gradient(circle at ${percentX * 100}% ${percentY * 100}%, ${endColor}, ${startColor})`;
    });

    openGraphBtn.addEventListener('mouseleave', () => {
        openGraphBtn.style.backgroundImage = '';
    });
});

// Open BGU tab
async function openBGU22Tab() {
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
