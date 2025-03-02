"use strict";

document.addEventListener('DOMContentLoaded', function () {
    const userForm = document.getElementById('user_form');
    const coursesForm = document.getElementById('courses_form');
    const theme_select = document.getElementById('theme');
    const lang_select = document.getElementById('language');
    const auto_add_moodle_courses = document.getElementById('enable_moodle_courses');
    const toast = document.getElementById('toast');
    const NewCourseNumberInput = document.getElementById('add_course_number');
    const addCourseButton = document.getElementById('add_course_button');
    const saveButton = document.getElementById('save_button');

    const removeIcon = `
        <svg xmlns="http://www.w3.org/2000/svg" id="remove_icon" viewBox="0 0 16 16">
            <path d="M6.5 1h3a.5.5 0 0 1 .5.5v1H6v-1a.5.5 0 0 1 .5-.5M11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3A1.5 1.5 0 0 0 5 1.5v1H1.5a.5.5 0 0 0 0 1h.538l.853 10.66A2 2 0 0 0 4.885 16h6.23a2 2 0 0 0 1.994-1.84l.853-10.66h.538a.5.5 0 0 0 0-1zm1.958 1-.846 10.58a1 1 0 0 1-.997.92h-6.23a1 1 0 0 1-.997-.92L3.042 3.5zm-7.487 1a.5.5 0 0 1 .528.47l.5 8.5a.5.5 0 0 1-.998.06L5 5.03a.5.5 0 0 1 .47-.53Zm5.058 0a.5.5 0 0 1 .47.53l-.5 8.5a.5.5 0 1 1-.998-.06l.5-8.5a.5.5 0 0 1 .528-.47M8 4.5a.5.5 0 0 1 .5.5v8.5a.5.5 0 0 1-1 0V5a.5.5 0 0 1 .5-.5" />
        </svg>`;

    const editIcon = `
        <svg xmlns="http://www.w3.org/2000/svg" id="edit_course_name_icon" viewBox="0 0 16 16">
            <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z"/>
            <path fill-rule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5z"/>
        </svg>`;

    const translations = {
        en: {
            enable_moodle_courses_description: "Visit <a href='https://moodle.bgu.ac.il/moodle/my/' target='_blank' rel='noopener noreferrer'>Moodle courses page</a> to auto-add displayed courses",
            options: "Options",
            user_name: "User Name:",
            password: "Password:",
            id: "ID Number:",
            theme: "Color Theme:",
            light: "Light",
            dark: "Dark",
            system: "System",
            language: "Language:",
            save: "Save",
            saving: "Saving...",
            forgot_password: "Forgot Password",
            toast_message: "",
            add_course_number: "Add Course Number:",
            enable_moodle_courses: "Auto-Add Moodle Courses:",
            header1: "Options",
            add_course_button: "Add",
            adding_course_button: "Adding...",
            saved_courses: "Saved Courses",
            disclaimer: `Disclaimer: This extension is not affiliated with Ben-Gurion University of the Negev.
            Your details are not stored outside the extension, they are only used for automatic filling of the login form on the BGU4U website.`
        },
        he: {
            enable_moodle_courses_description: "בקר ב<a href='https://moodle.bgu.ac.il/moodle/my/' target='_blank' rel='noopener noreferrer'>דף הקורסים במודל</a> כדי להוסיף אוטומטית קורסים מוצגים",
            options: "אפשרויות",
            user_name: "שם משתמש:",
            password: "סיסמה:",
            id: "מספר תעודת זהות:",
            theme: "ערכת נושא:",
            light: "בהיר",
            dark: "כהה",
            system: "מערכת",
            language: "שפה:",
            save: "שמור",
            saving: "שומר...",
            forgot_password: "שכחתי סיסמה",
            toast_message: "",
            add_course_number: "הוסף מספר קורס:",
            enable_moodle_courses: "הוספת קורסים אוטומטית מהמודל:",
            header1: "אפשרויות",
            add_course_button: "הוסף",
            adding_course_button: "מוסיף...",
            saved_courses: "קורסים שמורים",
            disclaimer: `לידיעתך: התוסף הזה אינו קשור לאוניברסיטת בן-גוריון בנגב.
            הפרטים שלך לא נשמרים מחוץ לתוסף, הם משמשים רק למילוי אוטומטי של טופס ההתחברות באתר BGU4U.`
        }
    };

    let toastTimeout = null;
    function showToast(enMessage, hebMessage, type) {
        if (toastTimeout) {
            clearTimeout(toastTimeout);
        }

        translations['en']['toast_message'] = enMessage;
        translations['he']['toast_message'] = hebMessage;
        apply_lang(document.documentElement.getAttribute('data-lang'));
        let toastType = type === 'success' ? 'success' : type === 'error' ? 'error' : 'other';
        // Set toast shadow color
        document.documentElement.style.setProperty('--toast-color', `var(--${toastType}-color)`);
        toast.classList.add('show');
        toastTimeout = setTimeout(() => {
            toast.classList.remove('show');
            toastTimeout = null;
        }, 5000);
    }

    function apply_theme(theme) {
        if (theme === 'system') {
            const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            document.documentElement.setAttribute('data-theme', prefersDark ? 'dark' : 'light');
        } else {
            document.documentElement.setAttribute('data-theme', theme);
        }
    }

    function apply_lang(lang) {
        const prefersHebrew = navigator.language.startsWith('he');
        if (lang === 'system') {
            lang = prefersHebrew ? 'he' : 'en';
        }
        if (lang === 'he') {
            addButtonText = 'הוסף';
        } else {
            addButtonText = 'Add';
        }
        document.documentElement.setAttribute('data-lang', lang);
        const elements = document.querySelectorAll('[data-i18n]');
        elements.forEach(el => {
            const key = el.getAttribute('data-i18n');
            el.innerHTML = translations[lang][key];
        });
    }

    // Load saved options
    function loadOptions() {
        chrome.storage.local.get(['user_name', 'id', 'theme', 'lang', 'saved_courses', 'password', 'enable_moodle_courses'], function (result) {
            if (result.user_name) document.getElementById('user_name').value = result.user_name;
            if (result.id) document.getElementById('id').value = result.id;
            if (result.password) document.getElementById('password').value = result.password;
            if (result.theme) {
                theme_select.value = result.theme;
                apply_theme(result.theme);
            } else {
                apply_theme('system');
            }
            if (result.lang) {
                lang_select.value = result.lang;
                apply_lang(result.lang);
            } else {
                apply_lang('system');
            }
            if (result.saved_courses) {
                for (const course_number in result.saved_courses) {
                    addCourseLine(course_number, result.saved_courses[course_number]);
                }
            }
            if (result.enable_moodle_courses) {
                auto_add_moodle_courses.checked = result.enable_moodle_courses;
            }
        });
    }

    loadOptions();

    theme_select.addEventListener('change', function () {
        const selectedTheme = this.value;
        apply_theme(selectedTheme);
        chrome.storage.local.set({ theme: selectedTheme });
    });

    lang_select.addEventListener('change', function () {
        const selected_lang = this.value;
        apply_lang(selected_lang);
        chrome.storage.local.set({ lang: selected_lang });
    });

    auto_add_moodle_courses.addEventListener('change', function () {
        chrome.storage.local.set({ enable_moodle_courses: this.checked });
    });

    // user form submission
    userForm.addEventListener('submit', async function (e) {
        e.preventDefault();

        setSaveLoading(true);

        if (!navigator.onLine) {
            handleMessages('No internet connection', 'אין חיבור לאינטרנט', 'error', null, true);
            return;
        }

        userFormData = {};
        const id = document.getElementById('id').value.trim();
        const password = document.getElementById('password').value.trim();
        const user_name = document.getElementById('user_name').value.trim();
        userFormData.id = id;
        userFormData.password = password;
        userFormData.user_name = user_name;

        if (!id || !password || !user_name) {
            handleMessages('Please fill all fields', 'אנא מלא את כל השדות', 'error', null, true);
            return;
        }

        const userDetails = await chrome.storage.local.get(['id', 'password', 'user_name']);
        if (userDetails.id === id && userDetails.password === password && userDetails.user_name === user_name) {
            handleMessages('User details already saved', 'פרטי המשתמש כבר נשמרו', null, null, true);
            return;
        }

        try {
            const tabId = await openBGU4U22Tab();
            try {
                await chrome.scripting.executeScript({
                    target: { tabId: tabId, allFrames: true },
                    func: (id, password, user_name) => {
                        window.userDetails = { id, password, user_name };
                    },
                    args: [id, password, user_name]
                });

                // await chrome.scripting.executeScript({
                //     target: { tabId: tabId, allFrames: true },
                //     files: ["scripts/validate_user_details.js"]
                // });
            } catch (error) {
                handleMessages('Error executing script', 'שגיאה בהרצת הסקריפט', error, tabId, true);
            }
        } catch (error) {
            handleMessages('Error opening BGU tab', 'שגיאה בפתיחת הטאב', error, null, true);
        }
    });

    function setSaveLoading(loading) {
        const saveButton = document.getElementById('save_button');
        if (loading) {
            saveButton.disabled = true;
            saveButton.style.opacity = '0.7';
            saveButton.style.pointerEvents = 'none';
            saveButton.textContent = translations[document.documentElement.getAttribute('data-lang')]['saving'];
        } else {
            translations['en']['save'] = 'Save';
            translations['he']['save'] = 'שמור';
            saveButton.disabled = false;
            saveButton.style.opacity = '1';
            saveButton.style.pointerEvents = 'auto';
            saveButton.textContent = translations[document.documentElement.getAttribute('data-lang')]['save'];
        }
    }

    // Listen for system theme changes
    window.matchMedia('(prefers-color-scheme: dark)').addListener(function () {
        if (theme_select.value === 'system') {
            apply_theme('system');
        }
    });

    window.matchMedia('(prefers-language-scheme: hebrew)').addListener(function () {
        if (lang_select.value === 'system') {
            apply_lang('system');
        }
    });

    // Mouse-tracking gradient effect
    saveButton.addEventListener('mousemove', (e) => {
        const rect = saveButton.getBoundingClientRect();
        const x = e.clientX - rect.left; // x position within the element
        const y = e.clientY - rect.top;  // y position within the element

        // Calculate the percentage of the mouse position
        const percentX = x / rect.width;
        const percentY = y / rect.height;

        // Update the gradient based on mouse position
        const startColor = getComputedStyle(document.documentElement).getPropertyValue('--button-start-color').trim();
        const endColor = getComputedStyle(document.documentElement).getPropertyValue('--button-end-color').trim();
        saveButton.style.backgroundImage = `radial-gradient(circle at ${percentX * 100}% ${percentY * 100}%, ${endColor}, ${startColor})`;
    });

    saveButton.addEventListener('mouseleave', () => {
        saveButton.style.backgroundImage = '';
    });

    // Set initial button state
    addCourseButton.disabled = true;
    let addButtonText = '';
    let courseFormData = {};
    let userFormData = {};
    let courseName;
    let result = {};
    let courseNumber = '';

    NewCourseNumberInput.addEventListener('input', function () {
        const hasValue = this.value.trim() !== '';

        if (hasValue) {
            NewCourseNumberInput.style.width = 'calc(100% - 110px)';
            NewCourseNumberInput.style.transition = 'width 0.07s ease-in-out';
            addCourseButton.textContent = addButtonText;
            addCourseButton.style.width = '26.55%';
            setTimeout(() => { addCourseButton.style.display = 'inline-block'; addCourseButton.disabled = false; }, 70);
        } else {
            addCourseButton.style.display = 'none';
            addCourseButton.disabled = true;
            addCourseButton.textContent = '';
            setTimeout(() => {
                addCourseButton.style.display = 'none';
                addCourseButton.disabled = true;
                addCourseButton.textContent = '';
                NewCourseNumberInput.style.width = '100%';
            }, 70);
        }
    });

    addCourseButton.addEventListener('click', async function (e) {
        e.preventDefault();
        AddingCourseButtonstyle(true);

        if (!navigator.onLine) {
            handleMessages('No internet connection', 'אין חיבור לאינטרנט', 'error', null, false);
            return;
        }

        NewCourseNumberInput.value = NewCourseNumberInput.value.trim();
        courseNumber = NewCourseNumberInput.value;
        // check if course number is in different format
        if (courseNumber.match(/^\d{8}$/)) {
            courseNumber = courseNumber.substring(0, 3) +
                '.' + courseNumber[3] + '.' + courseNumber.substring(4, 8);
        }
        if (courseNumber.match(/^\d{3}-\d{1}-\d{4}$/)) {
            courseNumber = courseNumber.replace(/-/g, '.');
        }
        // check if course number is only digits and 2 points
        if (!courseNumber.match(/^\d{3}\.\d{1}\.\d{4}$/)) {
            handleMessages('Invalid course number', 'מספר קורס לא תקין', 'error', null, false);
            return;
        }

        try {
            result = await chrome.storage.local.get(['saved_courses']);

            if (result.saved_courses && result.saved_courses[courseNumber]) {
                handleMessages('Course number already exists', 'מספר הקורס כבר קיים', 'error', null, false);
                return;
            }
        } catch (error) {
            handleMessages('Error getting saved courses', 'שגיאה בקבלת הקורסים', error, null, false);
            return;
        }

        try {
            await chrome.storage.local.set({ allowCourseValidation: true });
            const tabId = await openBGU4UTab(courseNumber);
        } catch (error) {
            handleMessages('Error opening BGU tab', 'שגיאה בפתיחת הטאב', error, null, false);
            return;
        }
    });

    chrome.runtime.onMessage.addListener(function (message, sender) {
        const tabId = sender.tab.id;
        if (message.type === 'COURSE_FOUND') {
            chrome.storage.local.remove('allowCourseValidation');
            if (message.courseName) {
                courseName = message.courseName;
                if (!result.saved_courses) {
                    courseFormData.saved_courses = { [courseNumber]: courseName };
                } else {
                    courseFormData.saved_courses = { ...result.saved_courses, [courseNumber]: courseName };
                }
                chrome.storage.local.set(courseFormData);
                // Clear input
                NewCourseNumberInput.value = '';
                const event = new Event('input', {
                    bubbles: true,
                    cancelable: true,
                });
                NewCourseNumberInput.dispatchEvent(event);

                addCourseLine(courseNumber, courseName);
                handleMessages('Course added', 'הקורס נוסף', null, tabId, false);
            } else {
                handleMessages('Course number is invalid', 'מספר הקורס לא תקין', 'error', tabId, false);
            }
        }
        else if (message.type === 'CONNECTION_ERROR') {
            handleMessages('Connection error', 'שגיאת חיבור', 'error', tabId, false);
            chrome.storage.local.remove('allowCourseValidation');
        }
        else if (message.type === 'COURSE_NOT_FOUND') {
            handleMessages('Course not found', 'הקורס לא נמצא', 'error', tabId, false);
            chrome.storage.local.remove('allowCourseValidation');
        }
        else if (message.type === 'LOGIN_FAILED') {
            handleMessages('Invalid user details', 'פרטי משתמש לא תקינים', 'error', tabId, true);
        }
        else if (message.type === 'FORM_FIELDS_NOT_FOUND') {
            handleMessages('Website not loaded', 'האתר לא נטען', 'error', tabId, true);
        }
        else if (message.type === 'LOGIN_SUCCESS') {
            handleMessages('User details saved', 'פרטי המשתמש נשמרו', null, tabId, true);
            chrome.storage.local.set(userFormData);
        }
    });

    function addCourseLine(course_number, course_name) {
        // Get or create courses form
        let coursesList = document.getElementById("courses_list");
        if (!coursesList) {
            // Create fieldset container
            const coursesFieldset = document.createElement("fieldset");
            coursesFieldset.id = "courses_fieldset";

            // Create legend
            const coursesLegend = document.createElement("legend");
            coursesLegend.setAttribute('data-i18n', 'saved_courses');
            coursesLegend.textContent = translations[document.documentElement.getAttribute('data-lang')]['saved_courses'];

            // Create form container
            coursesList = document.createElement("div");
            coursesList.id = "courses_list";
            coursesList.setAttribute("role", "form");
            coursesList.setAttribute("aria-label", "Courses selection list");

            // Assemble structure
            coursesFieldset.appendChild(coursesLegend);
            coursesFieldset.appendChild(coursesList);
            coursesForm.insertBefore(coursesFieldset, coursesForm.children[-1]);
        }

        // Create line container
        const lineContainer = document.createElement("div");
        lineContainer.className = "course_line";

        // create label and course box container
        const courseLabelContainer = document.createElement("div");
        courseLabelContainer.className = "course_label_container";

        // Create course box
        const courseNameElement = document.createElement("input");
        courseNameElement.type = "text";
        courseNameElement.value = course_name;
        courseNameElement.className = "course_name_input";
        courseNameElement.style.textAlign = 'center';
        courseNameElement.id = "course_name_input" + course_number;
        courseNameElement.setAttribute("aria-label", "Course name");

        courseNameElement.addEventListener('input', function () {
            const hasValue = this.value.trim() !== '';
            const courseNumber = this.id.replace('course_name_input', '');
            const editCourseNameButton = document.getElementById("edit_course_name_button" + courseNumber);
            if (hasValue) {
                editCourseNameButton.style.display = 'inline-block';
            } else {
                editCourseNameButton.style.display = 'none';
            }
        });

        // create label as course number
        const courseLabel = document.createElement("label");
        courseLabel.textContent = course_number;
        courseLabel.className = "course_label";
        courseLabel.setAttribute("aria-label", "Course number");

        // Create edit button
        const editCourseNameButton = document.createElement("button");
        editCourseNameButton.innerHTML = editIcon;
        editCourseNameButton.className = "edit_course_name_button";
        editCourseNameButton.id = "edit_course_name_button" + course_number;
        editCourseNameButton.style.display = 'none';
        editCourseNameButton.addEventListener('click', function (e) {
            e.preventDefault();
            // save course name
            const course_name = document.getElementById("course_name_input" + course_number).value.trim();
            chrome.storage.local.get(['saved_courses'], function (result) {
                result.saved_courses[course_number] = course_name;
                chrome.storage.local.set({ saved_courses: result.saved_courses });
            });
            handleMessages('Course name saved', 'שם הקורס נשמר', null, null, false);
            this.style.display = 'none';
        });

        // Create remove button
        const removeCourseButton = document.createElement("button");
        removeCourseButton.innerHTML = removeIcon;
        removeCourseButton.className = "remove_course_button";
        removeCourseButton.id = "remove_course_button" + course_name;

        // Add remove functionality
        removeCourseButton.addEventListener('click', function (e) {
            e.preventDefault();
            chrome.storage.local.get(['saved_courses'], function (result) {
                if (result.saved_courses) {
                    // Remove result.saved_courses[course_number] from saved courses
                    delete result.saved_courses[course_number];
                    chrome.storage.local.set({ saved_courses: result.saved_courses });
                    lineContainer.remove();
                    courseLabel.remove();
                }
                // Remove courses form and label if no courses are left
                if (document.getElementById("courses_list").childElementCount === 0) {
                    document.getElementById("courses_fieldset").remove();
                }
            });
            // Show toast message of the removed course number
            handleMessages('Course ' + course_number + ' removed', 'הקורס ' + course_number + ' הוסר', null, null, false);
        });

        // Append elements
        courseLabelContainer.appendChild(courseLabel);
        courseLabelContainer.appendChild(courseNameElement);
        lineContainer.appendChild(courseLabelContainer);
        lineContainer.appendChild(editCourseNameButton);
        lineContainer.appendChild(removeCourseButton);
        coursesList.appendChild(lineContainer);
    }

    // Handle enter key press on course number input
    NewCourseNumberInput.addEventListener('keyup', function (event) {
        if (event.key === 'Enter' && !addCourseButton.disabled) {
            event.preventDefault();
            addCourseButton.click();
        }
    });

    // Prevent form submission on enter key press in course number input
    coursesForm.addEventListener('keydown', function (event) {
        if (event.key === 'Enter' && document.activeElement === NewCourseNumberInput) {
            event.preventDefault();
        }
    });

    document.getElementById("forgot_password").addEventListener("click", function () {
        const url = "https://bgu4u.bgu.ac.il/remind/login.php";
        chrome.tabs.create({ url: url });
    });

    const handleMessages = (enMessage, hebMessage, error, tabId, isSave) => {
        if (tabId !== null) chrome.tabs.remove(tabId);

        if (isSave) setSaveLoading(false);
        else AddingCourseButtonstyle(false);

        let type;
        if (error && error === 'error') {
            console.log(enMessage);
            type = 'error';
        } else if (error) {
            console.log(error);
            type = 'error';
        } else {
            console.log(enMessage);
            type = 'success';
        }

        showToast(enMessage, hebMessage, type);
    };

    const AddingCourseButtonstyle = (adding) => {
        if (adding) {
            addCourseButton.classList.add('adding_course');
            addCourseButton.innerHTML = translations[document.documentElement.getAttribute('data-lang')]['adding_course_button'];
        } else {
            addCourseButton.classList.remove('adding_course');
            addCourseButton.textContent = translations[document.documentElement.getAttribute('data-lang')]['add_course_button'];
        }
    }

});

// Open BGU tab
async function openBGU4U22Tab() {
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

async function openBGU4UTab(courseNumber) {
    try {
        const ex_department = courseNumber.substring(0, 3);
        const ex_degree_level = courseNumber[4];
        const ex_course = courseNumber.substring(6, 10);
        // Create new tab
        const tab = await chrome.tabs.create({
            url: "https://bgu4u.bgu.ac.il/pls/scwp/!app.ann?lang=he&step=999&ex_department="
                + ex_department + "&ex_degree_level=" + ex_degree_level + "&ex_institution=0&ex_course=" + ex_course,
            active: false,
        });
        console.log("Tab loaded and ready:", tab.id);
        return tab.id;
    } catch (error) {
        console.error("Failed to create tab:", error);
        throw error;
    }
}
