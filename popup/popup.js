"use strict";

document.addEventListener("DOMContentLoaded", function () {
    // Get elements
    const openLoginBtn = document.getElementById("open_login");
    const openGraphBtn = document.getElementById("open_graph");
    const openOptionsBtn = document.getElementById("open_options");
    const yearInput = document.getElementById("year");
    const courseSelect = document.getElementById("course_number");
    const startYearInput = document.getElementById("start_year");
    const endYearInput = document.getElementById("end_year");
    const enableYearSpanToggle = document.getElementById("enable_year_span");
    const singleYearContainer = document.querySelector(".single_year");
    const yearSpanContainer = document.querySelector(".year_span_container");
    const yearSpanSwitch = document.getElementById("year_span_switch");
    const yearSemesterContainer = document.querySelector(".year_semester_container");

    // Single selection elements (radio buttons)
    const semesterRadioContainer = document.getElementById("semester_radio");
    const examRadioContainer = document.getElementById("exam_radio");
    const quizRadioContainer = document.getElementById("quiz_radio");
    const semesterRadios = document.querySelectorAll('input[name="semester_radio"]');
    const examQuizRadios = document.querySelectorAll('input[name="exam_quiz_radio"]');

    // Multiple selection elements (checkboxes)
    const semesterCheckboxContainer = document.getElementById("semester_checkbox");
    const examCheckboxContainer = document.getElementById("exam_checkbox");
    const quizCheckboxContainer = document.getElementById("quiz_checkbox");
    const semesterCheckboxes = document.querySelectorAll('input[name="semester"]');
    const examCheckboxes = document.querySelectorAll('input[name="exam"]');
    const quizCheckboxes = document.querySelectorAll('input[name="quiz"]');

    const courseInput = document.getElementById("course_number");
    const messageElement = document.getElementById("message");

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
            first_semester: "Fall",
            second_semester: "Spring",
            third_semester: "Summer",
            exam_number: "Exam Number:",
            total_exam: "Total",
            quiz_number: "Quiz Number:",
            course_number: "Course:",
            select_course: "Select Course or add more in options page",
            message: "Please fill your user details in the options page.",
            enable_year_span: "Enable multiple graphs",
            enable_year_span_description: "Open multiple graphs or export to Excel",
            start_year: "Year:",
            end_year: "To Year:"
        },
        he: {
            loadingGraph: "טוען גרף",
            year: "שנה:",
            semester: "סמסטר:",
            options: "אפשרויות",
            login: "אתר בנ\"ג",
            graph: "גרף",
            first_semester: "סתיו",
            second_semester: "אביב",
            third_semester: "קיץ",
            exam_number: "מספר מבחן:",
            total_exam: "סה\"כ",
            quiz_number: "מספר בוחן:",
            course_number: "קורס:",
            select_course: "בחר קורס או הוסף עוד בדף האפשרויות",
            message: "אנא מלא את פרטי המשתמש בדף האפשרויות.",
            enable_year_span: "אפשר גרפים מרובים",
            enable_year_span_description: "פתח גרפים מרובים או ייצא לאקסל",
            start_year: "משנה:",
            end_year: "לשנה:"
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
        updateTexts();
    });

    function updateTexts() {
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
    }

    loadSavedValues();

    function loadSavedValues () {
        chrome.storage.local.get(
            [
                "year",
                "start_year",
                "end_year",
                "enable_year_span",
                "semester",
                "exam_quiz",
                "selected_semesters",
                "selected_exams",
                "selected_quizzes",
                "saved_courses",
                "full_course_number"
            ],
            function (result) {
                // Handle year span toggle
                const isYearSpanEnabled = result.enable_year_span;
                if (isYearSpanEnabled) {
                    enableYearSpanToggle.checked = true;
                    singleYearContainer.style.display = "none";
                    yearSpanContainer.style.display = "flex";

                    // Show checkbox selectors
                    toggleSelectionMode(true);
                }

                // Set year values
                if (result.year) yearInput.value = result.year;
                if (result.start_year) startYearInput.value = result.start_year;
                if (result.end_year) endYearInput.value = result.end_year;

                // Set semester values
                if (isYearSpanEnabled) {
                    // Multiple selection mode
                    if (result.selected_semesters && result.selected_semesters.length > 0) {
                        semesterCheckboxes.forEach(checkbox => {
                            if (result.selected_semesters.includes(checkbox.value)) {
                                checkbox.checked = true;
                            }
                        });
                    }
                } else {
                    // Single selection mode
                    if (result.semester) {
                        const semesterRadio = document.querySelector(`input[name="semester_radio"][value="${result.semester}"]`);
                        if (semesterRadio) semesterRadio.checked = true;
                    } else {
                        // Default to first semester
                        document.getElementById("first_semester_radio").checked = true;
                    }
                }

                // Set exam/quiz values
                if (isYearSpanEnabled) {
                    // Multiple selection mode
                    if (result.selected_exams && result.selected_exams.length > 0) {
                        examCheckboxes.forEach(checkbox => {
                            if (result.selected_exams.includes(checkbox.value)) {
                                checkbox.checked = true;
                            }
                        });
                    }
                    if (result.selected_quizzes && result.selected_quizzes.length > 0) {
                        quizCheckboxes.forEach(checkbox => {
                            if (result.selected_quizzes.includes(checkbox.value)) {
                                checkbox.checked = true;
                            }
                        });
                    }
                } else {
                    // Single selection mode
                    if (result.exam_quiz) {
                        const examQuizRadio = document.querySelector(`input[name="exam_quiz_radio"][value="${result.exam_quiz}"]`);
                        if (examQuizRadio) examQuizRadio.checked = true;
                    }
                }

                while (courseSelect.options.length > 1) {
                    courseSelect.remove(1);
                }
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
    }

    chrome.storage.local.get(["user_name", "id", "password"], async function (result) {
        if (!result.user_name || !result.id || !result.password) {
            const popupForm = document.getElementById("popup_form");
            popupForm.style.display = "none";
            yearSpanSwitch.style.display = "none";
            messageElement.style.display = "block";
            messageElement.innerHTML = translations[lang].message;
            openOptionsBtn.classList.add("clickMe");
        }
    });


    function sendMessage(enMessage, heMessage, type) {
        translations['en'].message = enMessage;
        translations['he'].message = heMessage;
        messageElement.innerHTML = translations[lang].message;
        messageElement.style.display = "flex";
        messageElement.classList.add(type);
        setTimeout(() => {
            messageElement.style.display = "none";
            messageElement.classList.remove(type);
        }, 10000);
    }

    // Function to toggle between radio buttons and checkboxes
    function toggleSelectionMode(enableMultiple) {
        // Toggle semester selectors
        semesterRadioContainer.style.display = enableMultiple ? "none" : "flex";
        semesterCheckboxContainer.style.display = enableMultiple ? "flex" : "none";

        // Toggle exam selectors
        examRadioContainer.style.display = enableMultiple ? "none" : "flex";
        examCheckboxContainer.style.display = enableMultiple ? "flex" : "none";

        // Toggle quiz selectors
        quizRadioContainer.style.display = enableMultiple ? "none" : "flex";
        quizCheckboxContainer.style.display = enableMultiple ? "flex" : "none";

        if (enableMultiple) yearSemesterContainer.style.flexDirection = "column";
        else yearSemesterContainer.style.flexDirection = "row";

        //change the name of labels
        if (enableMultiple) {
        translations['en'].loadingGraph = "Loading Graphs";
        translations['he'].loadingGraph = "טוען גרפים";
        translations['en'].semester = "Semesters:";
        translations['he'].semester = "סמסטרים:";
        translations['en'].exam_number = "Exam Numbers:";
        translations['he'].exam_number = "מספרי מבחנים:";
        translations['en'].quiz_number = "Quiz Numbers:";
        translations['he'].quiz_number = "מספרי בחנים:";
        translations['en'].graph = "Graphs";
        translations['he'].graph = "גרפים";
        } else {
        translations['en'].loadingGraph = "Loading Graph";
        translations['he'].loadingGraph = "טוען גרף";
        translations['en'].semester = "Semester:";
        translations['he'].semester = "סמסטר:";
        translations['en'].exam_number = "Exam Number:";
        translations['he'].exam_number = "מספר מבחן:";
        translations['en'].quiz_number = "Quiz Number:";
        translations['he'].quiz_number = "מספר בוחן:";
        translations['en'].graph = "Graph";
        translations['he'].graph = "גרף";
        }
        updateTexts();
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
                '<path d="M1 11a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1z"/>',
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
                } else if (message.type === "P_KEY_NOT_FOUND") {
                    clearTimeout(timeout);
                    chrome.runtime.onMessage.removeListener(listener);
                    setLoadingGraphStyle(false);
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
            getStorageData("enable_year_span"),
            getStorageData("year"),
            getStorageData("start_year"),
            getStorageData("end_year"),
            getStorageData("semester"),
            getStorageData("exam_quiz"),
            getStorageData("selected_semesters"),
            getStorageData("selected_exams"),
            getStorageData("selected_quizzes"),
            getStorageData("department"),
            getStorageData("degree"),
            getStorageData("course"),
            getStorageData("last_key_update"),
            getStorageData("enable_departmental_details")
        ]).then(async (results) => {
            const [
                enable_year_span,
                year,
                start_year,
                end_year,
                semester,
                exam_quiz,
                selected_semesters,
                selected_exams,
                selected_quizzes,
                department,
                degree,
                course,
                lastKeyUpdate,
                enable_departmental_details
            ] = results.map((r) => Object.values(r)[0]);

            // Validate selections
            const isYearSpan = enable_year_span;
            let years, semesters, examTypes;

            // Get year values
            if (isYearSpan) {
                years = (start_year && end_year) ?
                    Array.from({ length: end_year - start_year + 1 }, (_, i) => parseInt(start_year) + i) : null;
            } else {
                years = year ? [year] : null;
            }

            // Get semester values
            if (isYearSpan) {
                semesters = selected_semesters && selected_semesters.length > 0 ?
                    selected_semesters : null;
            } else {
                semesters = semester ? [semester] : null;
            }

            // Get exam/quiz values
            if (isYearSpan) {
                examTypes = [];
                if (selected_exams && selected_exams.length > 0) {
                    examTypes.push(...selected_exams);
                }
                if (selected_quizzes && selected_quizzes.length > 0) {
                    examTypes.push(...selected_quizzes);
                }
            } else {
                examTypes = exam_quiz ? [exam_quiz] : null;
            }

            if (!years || !semesters || !examTypes || examTypes.length === 0 || !course_number || courseSelect.value === "") {
                sendMessage("Please fill in all the required fields.", "אנא מלא את כל השדות הנדרשים.", "error");
                setLoadingGraphStyle(false);

                // Mark missing fields
                if (isYearSpan) {
                    if (!start_year || !end_year) {
                        if (!start_year) startYearInput.classList.add("missing");
                        if (!end_year) endYearInput.classList.add("missing");
                    }
                } else {
                    if (!year) yearInput.classList.add("missing");
                }
                if (!semesters || semesters.length === 0) {
                    if (isYearSpan) {
                        semesterCheckboxContainer.classList.add("missing");
                    } else {
                        semesterRadioContainer.classList.add("missing");
                    }
                }
                if (!examTypes || examTypes.length === 0) {
                    if (isYearSpan) {
                        examCheckboxContainer.classList.add("missing");
                        quizCheckboxContainer.classList.add("missing");
                    } else {
                        examRadioContainer.classList.add("missing");
                        quizRadioContainer.classList.add("missing");
                    }
                }

                if (!course_number || courseSelect.value === "")
                    courseInput.classList.add("missing");

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
                sendMessage("Failed to generate key. Please try again.", "נכשל ביצירת מפתח. אנא נסה שוב.", "error");
                setLoadingGraphStyle(false);
                console.error(error);
                return;
            }

            const { p_key } = await getStorageData("p_key");

            // Generate URLs for each combination
            const urls = [];

            for (const yr of years) {
                for (const sem of semesters) {
                    for (const examType of examTypes) {
                        const url =
                            `https://reports4u22.bgu.ac.il/GeneratePDF.php?` +
                            `server=aristo4stu419c` +
                            `/report=SCRR016w` +
                            `/p_key=${p_key}` +
                            `/p_year=${yr}` +
                            `/p_semester=${sem}` +
                            `/out_institution=0` +
                            `/grade=${examType}` +
                            `/list_department=*${department}@` +
                            `/list_degree_level=*${degree}@` +
                            `/list_course=*${course}@` +
                            `/LIST_GROUP=*@` +
                            `/P_FOR_STUDENT=${enable_departmental_details ? 0 : 1}`;

                        urls.push(url);
                    }
                }
            }

            // Open the URLs in new tabs
            setLoadingGraphStyle(false);
            for (let i = 0; i < urls.length; i++) {
                chrome.tabs.create({ url: urls[i] });
            }
        });
    });

    // Year span toggle event
    enableYearSpanToggle.addEventListener("change", function () {
        const isEnabled = enableYearSpanToggle.checked;
        singleYearContainer.style.display = isEnabled ? "none" : "block";
        yearSpanContainer.style.display = isEnabled ? "flex" : "none";

        // Toggle selection mode
        toggleSelectionMode(isEnabled);

        chrome.storage.local.set({ enable_year_span: isEnabled }, function () {
            console.log("Year span enabled:", isEnabled);
        });
        loadSavedValues();
    });

    function handleYearInputWheel(event, inputElement) {
        if (document.activeElement === inputElement) {
            event.preventDefault();
            if (event.deltaY < 0) {
                inputElement.stepUp();
            } else {
                inputElement.stepDown();
            }
            inputElement.dispatchEvent(new Event("change"));
        }
    }

    // Attach wheel event listeners to year inputs
    yearInput.addEventListener("wheel", (event) => handleYearInputWheel(event, yearInput));
    startYearInput.addEventListener("wheel", (event) => handleYearInputWheel(event, startYearInput));
    endYearInput.addEventListener("wheel", (event) => handleYearInputWheel(event, endYearInput));

    // Save year inputs
    yearInput.addEventListener("change", function () {
        yearInput.classList.remove("missing");
        const year = yearInput.value;
        if (year < 1970 || year > new Date().getFullYear()) {
            return;
        }
        chrome.storage.local.set({ year: year }, function () {
            console.log("Year saved:", year);
        });
    });
    startYearInput.addEventListener("change", function () {
        startYearInput.classList.remove("missing");
        const startYear = startYearInput.value;
        if (startYear < 1970 || startYear > new Date().getFullYear()) {
            return;
        }
        chrome.storage.local.set({ start_year: startYear }, function () {
            console.log("Start year saved:", startYear);
        });
    });
    endYearInput.addEventListener("change", function () {
        endYearInput.classList.remove("missing");
        const endYear = endYearInput.value;
        if (endYear < 1970 || endYear > new Date().getFullYear()) {
            return;
        }
        chrome.storage.local.set({ end_year: endYear }, function () {
            console.log("End year saved:", endYear);
        });
    });

    // Save single selection semester
    semesterRadios.forEach(radio => {
        radio.addEventListener("change", function () {
            const semester = document.querySelector('input[name="semester_radio"]:checked').value;
            chrome.storage.local.set({ semester: semester }, function () {
                console.log("Semester saved:", semester);
            });
        });
    });

    // Save single selection exam/quiz
    examQuizRadios.forEach(radio => {
        radio.addEventListener("change", function () {
            const examQuiz = document.querySelector('input[name="exam_quiz_radio"]:checked').value;
            chrome.storage.local.set({ exam_quiz: examQuiz }, function () {
                console.log("Exam/Quiz saved:", examQuiz);
            });
        });
    });

    // Save multiple selection semester
    semesterCheckboxes.forEach(checkbox => {
        checkbox.addEventListener("change", function () {
            const selectedSemesters = Array.from(document.querySelectorAll('input[name="semester"]:checked'))
                .map(input => input.value);

            chrome.storage.local.set({ selected_semesters: selectedSemesters }, function () {
                console.log("Selected semesters saved:", selectedSemesters);
            });
        });
    });

    // Save multiple selection exam
    examCheckboxes.forEach(checkbox => {
        checkbox.addEventListener("change", function () {
            const selectedExams = Array.from(document.querySelectorAll('input[name="exam"]:checked'))
                .map(input => input.value);

            chrome.storage.local.set({ selected_exams: selectedExams }, function () {
                console.log("Selected exams saved:", selectedExams);
            });
        });
    });

    // Save multiple selection quiz
    quizCheckboxes.forEach(checkbox => {
        checkbox.addEventListener("change", function () {
            const selectedQuizzes = Array.from(document.querySelectorAll('input[name="quiz"]:checked'))
                .map(input => input.value);

            chrome.storage.local.set({ selected_quizzes: selectedQuizzes }, function () {
                console.log("Selected quizzes saved:", selectedQuizzes);
            });
        });
    });

    courseInput.addEventListener("change", function () {
        courseInput.classList.remove("missing");
        const full_course_number = courseInput.value;
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
