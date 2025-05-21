"use strict";

document.addEventListener('DOMContentLoaded', function () {
    const userForm = document.getElementById('user_form');
    const coursesForm = document.getElementById('courses_form');
    const themeSelect = document.getElementById('theme');
    const langSelect = document.getElementById('language');
    const autoAddMoodleCourses = document.getElementById('auto_add_moodle_courses');
    const toast = document.getElementById('toast');
    const NewCourseNumberInput = document.getElementById('add_course_number');
    const addCourseButton = document.getElementById('add_course_button');
    const saveButton = document.getElementById('save_button');

    let toastTimeout = null;

    const darkModeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const hebrewLanguageMediaQuery = window.matchMedia('(prefers-language-scheme: hebrew)');

    // Set initial button state
    addCourseButton.disabled = true;
    let addButtonText = '';
    let courseFormData = {};
    let userFormData = {};
    let courseName;
    let result = {};
    let courseNumber = '';

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
            // Course-related messages
            add_course_button: "Add",
            adding_course_button: "Adding...",
            add_course_number: "Add Course Number:",
            saved_courses: "Saved Courses",

            // User authentication
            user_name: "User Name:",
            password: "Password:",
            id: "ID Number:",
            forgot_password: "Forgot Password",
            save: "Save",
            saving: "Saving...",

            // Interface settings
            options: "Options",
            theme: "Color Theme:",
            light: "Light",
            dark: "Dark",
            system: "System",
            language: "Language:",
            user_container_header: "User",
            courses_container_header: "Courses",
            general_options_container_header: "General",

            // Feature toggles
            auto_add_moodle_courses: "Auto-Add Moodle Courses:",
            enable_departmental_details: "Enable Departmental Details: ",
            auto_add_moodle_courses_description: "Visit <a href='https://moodle.bgu.ac.il/moodle/my/' target='_blank' rel='noopener noreferrer'>Moodle courses page</a> to auto-add displayed courses",
            enable_departmental_details_description: "See grade distribution for each department separately",

            // System messages
            toast_message: "",
            disclaimer: `Disclaimer: This extension is not affiliated with Ben-Gurion University of the Negev.
            Your details are not stored outside the extension, they are only used for automatic filling of the login form on the BGU4U website.`,

            // Tooltips
            title_general_header: "General settings for the extension",
            title_theme: "Choose the color theme for the extension interface",
            title_system_theme: "Use your system's default theme",
            title_light_theme: "Use light theme",
            title_dark_theme: "Use dark theme",
            title_language: "Choose the display language for the extension",
            title_system_language: "Use your system's default language",
            title_he_language: "Change language to Hebrew",
            title_en_language: "Change language to English",
            title_enable_departmental: "Toggle to see grade distribution for each department separately",
            title_user_header: "User account settings",
            title_username: "Enter your BGU username",
            title_password: "Enter your BGU password",
            title_id: "Enter your ID number",
            title_save: "Save your user details",
            title_forgot_password: "Go to password reset page",
            title_disclaimer: "Important information about data privacy",
            title_courses_header: "Manage your course list",
            title_moodle_sync: "Automatically add courses from your Moodle page",
            title_course_number: "Enter a course number in format XXX.X.XXXX",
            title_add_course: "Add this course to your tracked courses",
            title_edit_course: "Save course name changes",
            title_remove_course: "Remove this course",
            title_course_name: "Edit course name",
            title_course_number_label: "Course number: "
        },
        he: {
            // Course-related messages
            add_course_button: "הוסף",
            adding_course_button: "מוסיף...",
            add_course_number: "הוסף מספר קורס:",
            saved_courses: "קורסים שמורים",

            // User authentication
            user_name: "שם משתמש:",
            password: "סיסמה:",
            id: "מספר תעודת זהות:",
            forgot_password: "שכחתי סיסמה",
            save: "שמור",
            saving: "שומר...",

            // Interface settings
            options: "אפשרויות",
            theme: "ערכת נושא:",
            light: "בהיר",
            dark: "כהה",
            system: "מערכת",
            language: "שפה:",
            user_container_header: "משתמש",
            courses_container_header: "קורסים",
            general_options_container_header: "כללי",

            // Feature toggles
            auto_add_moodle_courses: "הוספת קורסים אוטומטית מהמודל:",
            enable_departmental_details: "אפשר פירוט מחלקתי: ",
            auto_add_moodle_courses_description: "בקר ב<a href='https://moodle.bgu.ac.il/moodle/my/' target='_blank' rel='noopener noreferrer'>דף הקורסים במודל</a> כדי להוסיף אוטומטית קורסים מוצגים",
            enable_departmental_details_description: "לראות את התפלגות הציונים לכל מחלקה בנפרד",

            // System messages
            toast_message: "",
            disclaimer: `לידיעתך: התוסף הזה אינו קשור לאוניברסיטת בן-גוריון בנגב.
            הפרטים שלך לא נשמרים מחוץ לתוסף, הם משמשים רק למילוי אוטומטי של טופס ההתחברות באתר BGU4U.`,

            // Tooltips
            title_general_header: "הגדרות כלליות של התוסף",
            title_theme: "בחר ערכת נושא לממשק התוסף",
            title_system_theme: "השתמש בערכת הנושא של המערכת שלך",
            title_light_theme: "השתמש בערכת נושא בהירה",
            title_dark_theme: "השתמש בערכת נושא כהה",
            title_language: "בחר שפת תצוגה לתוסף",
            title_system_language: "השתמש בשפת המערכת שלך",
            title_he_language: "שנה שפה לעברית",
            title_en_language: "שנה שפה לאנגלית",
            title_enable_departmental: "הפעל כדי לראות התפלגות ציונים לכל מחלקה בנפרד",
            title_user_header: "הגדרות חשבון משתמש",
            title_username: "הזן את שם המשתמש שלך ב-BGU",
            title_password: "הזן את הסיסמה שלך ב-BGU",
            title_id: "הזן את מספר תעודת הזהות שלך",
            title_save: "שמור את פרטי המשתמש שלך",
            title_forgot_password: "עבור לדף איפוס סיסמה",
            title_disclaimer: "מידע חשוב על פרטיות הנתונים",
            title_courses_header: "נהל את רשימת הקורסים שלך",
            title_moodle_sync: "הוסף אוטומטית קורסים מדף המודל שלך",
            title_course_number: "הזן מספר קורס בפורמט XXX.X.XXXX",
            title_add_course: "הוסף קורס זה לקורסים המעוקבים שלך",
            title_edit_course: "שמור שינויים בשם הקורס",
            title_remove_course: "הסר קורס זה",
            title_course_name: "ערוך את שם הקורס",
            title_course_number_label: "מספר קורס: "
        }
    };

    // Load saved options
    loadOptions();

    function showToast(enMessage, hebMessage, type) {
        if (toastTimeout) {
            clearTimeout(toastTimeout);
        }

        translations['en']['toast_message'] = enMessage;
        translations['he']['toast_message'] = hebMessage;
        applyLang(document.documentElement.getAttribute('data-lang'));
        let toastType = type === 'success' ? 'success' : type === 'error' ? 'error' : 'other';
        // Set toast shadow color
        document.documentElement.style.setProperty('--toast-color', `var(--${toastType}-color)`);
        toast.classList.add('show');
        toastTimeout = setTimeout(() => {
            toast.classList.remove('show');
            toastTimeout = null;
        }, 5000);
    }

    function applyTheme(theme) {
        if (theme === 'system') {
            const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            document.documentElement.setAttribute('data-theme', prefersDark ? 'dark' : 'light');
        } else {
            document.documentElement.setAttribute('data-theme', theme);
        }
    }

    function applyLang(lang) {
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

        // Update title attributes
        document.querySelector('h1[data-i18n="general_options_container_header"]').title = translations[lang]['title_general_header'];
        document.querySelector('h1[data-i18n="user_container_header"]').title = translations[lang]['title_user_header'];
        document.querySelector('h1[data-i18n="courses_container_header"]').title = translations[lang]['title_courses_header'];

        // Form elements
        document.getElementById('theme').title = translations[lang]['title_theme'];
        document.getElementById('language').title = translations[lang]['title_language'];
        document.getElementById('enable_departmental_details').title = translations[lang]['title_enable_departmental'];
        document.getElementById('user_name').title = translations[lang]['title_username'];
        document.getElementById('password').title = translations[lang]['title_password'];
        document.getElementById('id').title = translations[lang]['title_id'];
        document.getElementById('save_button').title = translations[lang]['title_save'];
        document.getElementById('forgot_password').title = translations[lang]['title_forgot_password'];
        document.querySelector('.disclaimer').title = translations[lang]['title_disclaimer'];
        document.getElementById('auto_add_moodle_courses').title = translations[lang]['title_moodle_sync'];
        document.getElementById('add_course_number').title = translations[lang]['title_course_number'];
        document.getElementById('add_course_button').title = translations[lang]['title_add_course'];

        // Selection options
        document.querySelector('option[value="system"][data-i18n="system"]').title = translations[lang]['title_system_theme'];
        document.querySelector('option[value="light"][data-i18n="light"]').title = translations[lang]['title_light_theme'];
        document.querySelector('option[value="dark"][data-i18n="dark"]').title = translations[lang]['title_dark_theme'];
        document.querySelector('option[value="system"][data-i18n="system"]').title = translations[lang]['title_system_language'];
        document.querySelector('option[value="he"]').title = translations[lang]['title_he_language'];
        document.querySelector('option[value="en"]').title = translations[lang]['title_en_language'];

        // Update tooltips for dynamically created course elements
        const courseNameInputs = document.querySelectorAll('.course_name_input');
        courseNameInputs.forEach(input => {
            input.title = translations[lang]['title_course_name'];
        });

        const courseLabels = document.querySelectorAll('.course_label');
        courseLabels.forEach(label => {
            const courseNumber = label.textContent;
            label.title = translations[lang]['title_course_number_label'] + courseNumber;
        });

        const editCourseButtons = document.querySelectorAll('.edit_course_name_button');
        editCourseButtons.forEach(button => {
            button.title = translations[lang]['title_edit_course'];
        });

        const removeCourseButtons = document.querySelectorAll('.remove_course_button');
        removeCourseButtons.forEach(button => {
            button.title = translations[lang]['title_remove_course'];
        });
    }

    function loadOptions() {
        chrome.storage.local.get(['user_name', 'id', 'theme', 'lang', 'saved_courses', 'password', 'auto_add_moodle_courses', 'enable_departmental_details'], function (result) {
            if (result.user_name) document.getElementById('user_name').value = result.user_name;
            if (result.id) document.getElementById('id').value = result.id;
            if (result.password) document.getElementById('password').value = result.password;
            if (result.theme) {
                themeSelect.value = result.theme;
                applyTheme(result.theme);
            } else {
                applyTheme('system');
            }
            if (result.lang) {
                langSelect.value = result.lang;
                applyLang(result.lang);
            } else {
                applyLang('system');
            }
            if (result.saved_courses) {
                for (const course_number in result.saved_courses) {
                    addCourseLine(course_number, result.saved_courses[course_number]);
                }
            }
            if (result.auto_add_moodle_courses) {
                autoAddMoodleCourses.checked = result.auto_add_moodle_courses;
            }
            if (result.enable_departmental_details) {
                enable_departmental_details.checked = result.enable_departmental_details;
            }
        });
    }

    themeSelect.addEventListener('change', function () {
        const selectedTheme = this.value;
        applyTheme(selectedTheme);
        chrome.storage.local.set({ theme: selectedTheme });
    });

    langSelect.addEventListener('change', function () {
        const selected_lang = this.value;
        applyLang(selected_lang);
        chrome.storage.local.set({ lang: selected_lang });
    });

    autoAddMoodleCourses.addEventListener('change', function () {
        chrome.storage.local.set({ auto_add_moodle_courses: this.checked });
    });

    enable_departmental_details.addEventListener('change', function () {
        chrome.storage.local.set({ enable_departmental_details: (this.checked ? 1 : 0) });
    });

    // user form submission
    userForm.addEventListener('submit', async function (e) {
        e.preventDefault();

        setSaveLoading(true);

        if (!navigator.onLine) {
            handleMessages('No internet connection', 'אין חיבור לאינטרנט', 'error', true);
            return;
        }

        userFormData = {};
        const idElement = document.getElementById('id');
        const passwordElement = document.getElementById('password');
        const userNameElement = document.getElementById('user_name');
        const id = idElement.value.trim();
        const password = passwordElement.value.trim();
        const userName = userNameElement.value.trim();
        userFormData.id = id;
        userFormData.password = password;
        userFormData.user_name = userName;

        idElement.classList.remove('error');
        passwordElement.classList.remove('error');
        userNameElement.classList.remove('error');
        if (!id || !password || !userName) {
            handleMessages('Please fill all fields', 'אנא מלא את כל השדות', 'error', true);
            if (!id) idElement.classList.add('error');
            if (!password) passwordElement.classList.add('error');
            if (!userName) userNameElement.classList.add('error');
            return;
        }

        const userDetails = await chrome.storage.local.get(['id', 'password', 'user_name']);
        if (userDetails.id === id && userDetails.password === password && userDetails.user_name === userName) {
            handleMessages('User details already saved', 'פרטי המשתמש כבר נשמרו', null, true);
            return;
        }

        if (!IDValidator(id)) {
            handleMessages('Invalid ID', 'תעודת זהות לא תקינה', 'error', true);
            idElement.classList.add('error');
            return;
        }

        try {
            const checkedUserDetails = { id, password, user_name: userName };
            await chrome.storage.local.set({ allowUserValidation: 1 });
            await chrome.storage.local.set({ checkedUserDetails: checkedUserDetails });
            try {
                const tabId = await openBGU4U22Tab();
            } catch (error) {
                handleMessages('Error opening BGU tab', 'שגיאה בפתיחת הטאב', error, true);
            }
        } catch (error) {
            handleMessages('Error saving', 'שגיאה בשמירה', error, true);
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
    darkModeMediaQuery.addEventListener('change', function () {
        if (themeSelect.value === 'system') {
            applyTheme('system');
        }
    });

    hebrewLanguageMediaQuery.addEventListener('change', function () {
        if (langSelect.value === 'system') {
            applyLang('system');
        }
    });

    // Mouse tracking gradient effect
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
            handleMessages('No internet connection', 'אין חיבור לאינטרנט', 'error', false);
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
            handleMessages('Invalid course number', 'מספר קורס לא תקין', 'error', false);
            return;
        }

        try {
            result = await chrome.storage.local.get(['saved_courses']);

            if (result.saved_courses && result.saved_courses[courseNumber]) {
                handleMessages('Course ' + courseNumber + ' already exists', 'הקורס ' + courseNumber + ' כבר קיים', null, false);
                return;
            }
        } catch (error) {
            handleMessages('Error getting saved courses', 'שגיאה בקבלת הקורסים', error, false);
            return;
        }

        try {
            await chrome.storage.local.set({ allowCourseValidation: true });
            const tabId = await openBGU4UTab(courseNumber);
        } catch (error) {
            handleMessages('Error opening BGU tab', 'שגיאה בפתיחת הטאב', error, false);
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
                // mark last added course border as green
                const lastCourseLine = document.querySelector('.course_line:last-child');
                const lastCourseNameInput = lastCourseLine.querySelector('.course_name_input');
                lastCourseNameInput.style.border = '2px solid var(--success-color)';
                lastCourseNameInput.style.transition = 'border 0.5s ease-in-out';
                setTimeout(() => {
                    lastCourseNameInput.style.border = '2px solid var(--border-color)';
                }, 2000);

                handleMessages('Course ' + courseNumber + ' added', 'הקורס ' + courseNumber + ' נוסף', null, false);
            } else {
                handleMessages('Course number is invalid', 'מספר הקורס לא תקין', 'error', false);
            }
        }
        else if (message.type === 'CONNECTION_ERROR') {
            handleMessages('Connection error', 'שגיאת חיבור', 'error', false);
            chrome.storage.local.remove('allowCourseValidation');
            chrome.storage.local.remove('allowUserValidation');
            chrome.storage.local.remove('checkedUserDetails');
        }
        else if (message.type === 'COURSE_NOT_FOUND') {
            handleMessages('Course not found', 'הקורס לא נמצא', 'error', false);
            chrome.storage.local.remove('allowCourseValidation');
        }
        else if (message.type === 'LOGIN_FAILED') {
            handleMessages('Invalid user details', 'פרטי משתמש לא תקינים', 'error', true);
            chrome.storage.local.remove('allowUserValidation');
            chrome.storage.local.remove('checkedUserDetails');
        }
        else if (message.type === 'FORM_FIELDS_NOT_FOUND') {
            handleMessages('Website not loaded', 'האתר לא נטען', 'error', true);
            chrome.storage.local.remove('allowUserValidation');
            chrome.storage.local.remove('checkedUserDetails');
        }
        else if (message.type === 'LOGIN_SUCCESS') {
            handleMessages('User details saved', 'פרטי המשתמש נשמרו', null, true);
            chrome.storage.local.set(userFormData);
            chrome.storage.local.remove('allowUserValidation');
            chrome.storage.local.remove('checkedUserDetails');
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
        courseNameElement.setAttribute("title", translations[document.documentElement.getAttribute('data-lang')]['title_course_name']);

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
        courseLabel.setAttribute("title", translations[document.documentElement.getAttribute('data-lang')]['title_course_number_label'] + course_number);

        // Create edit button
        const editCourseNameButton = document.createElement("button");
        editCourseNameButton.innerHTML = editIcon;
        editCourseNameButton.className = "edit_course_name_button";
        editCourseNameButton.id = "edit_course_name_button" + course_number;
        editCourseNameButton.style.display = 'none';
        editCourseNameButton.setAttribute("title", translations[document.documentElement.getAttribute('data-lang')]['title_edit_course']);
        editCourseNameButton.addEventListener('click', function (e) {
            e.preventDefault();
            // save course name
            const course_name = document.getElementById("course_name_input" + course_number).value.trim();
            chrome.storage.local.get(['saved_courses'], function (result) {
                result.saved_courses[course_number] = course_name;
                chrome.storage.local.set({ saved_courses: result.saved_courses });
            });
            handleMessages('Course name saved', 'שם הקורס נשמר', null, false);
            this.style.display = 'none';
        });

        // Create remove button
        const removeCourseButton = document.createElement("button");
        removeCourseButton.innerHTML = removeIcon;
        removeCourseButton.className = "remove_course_button";
        removeCourseButton.id = "remove_course_button" + course_name;
        removeCourseButton.setAttribute("title", translations[document.documentElement.getAttribute('data-lang')]['title_remove_course']);

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
            handleMessages('Course ' + course_number + ' removed', 'הקורס ' + course_number + ' הוסר', null, false);
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

    const handleMessages = (enMessage, hebMessage, error, isSave) => {

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

function IDValidator(id) {
    if (!id || !Number(id) || id.length !== 9 || isNaN(id)) {  // Make sure ID is formatted properly
        return false;
    }
    let sum = 0;
    for (let i = 0; i < id.length; i++) {
        const incNum = Number(id[i]) * ((i % 2) + 1);  // Multiply number by 1 or 2
        sum += (incNum > 9) ? incNum - 9 : incNum;  // Sum the digits up and add to total
    }
    return (sum % 10 === 0);
}
