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
    const convertToHebrewButton = document.getElementById('convert_to_hebrew');
    const convertToEnglishButton = document.getElementById('convert_to_english');

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

    let displayLang = 'en'; // Default language

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
            convert_to_hebrew: "Convert Courses to Hebrew",
            convert_to_english: "Convert Courses to English",
            converting_to_hebrew: "Converting to Hebrew...",
            converting_to_english: "Converting to English...",
            course_names_converted_successfully: "Course names converted successfully",
            course_names_conversion_failed: "Failed to convert course names",

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
            color_palette: "Color Scheme:",
            orange: "Orange",
            blue: "Blue",
            green: "Green",
            red: "Red",
            purple: "Purple",
            pink: "Pink",
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
            title_color_palette: "Choose the color scheme for the extension",
            title_color_orange: "Orange color scheme",
            title_color_blue: "Blue color scheme",
            title_color_green: "Green color scheme",
            title_color_red: "Red color scheme",
            title_color_purple: "Purple color scheme",
            title_color_pink: "Pink color scheme",
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
            convert_to_hebrew: "המר קורסים לעברית",
            convert_to_english: "המר קורסים לאנגלית",
            converting_to_hebrew: "ממיר לעברית...",
            converting_to_english: "ממיר לאנגלית...",
            course_names_converted_successfully: "שמות הקורסים הומרו בהצלחה",
            course_names_conversion_failed: "המרת שמות הקורסים נכשלה",

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
            color_palette: "ערכת צבעים:",
            orange: "כתום",
            blue: "כחול",
            green: "ירוק",
            red: "אדום",
            purple: "סגול",
            pink: "ורוד",
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
            title_color_palette: "בחר ערכת צבעים לתוסף",
            title_color_orange: "ערכת צבעים כתומה",
            title_color_blue: "ערכת צבעים כחולה",
            title_color_green: "ערכת צבעים ירוקה",
            title_color_red: "ערכת צבעים אדומה",
            title_color_purple: "ערכת צבעים סגולה",
            title_color_pink: "ערכת צבעים ורודה",
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
        applyLang(displayLang);
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
            displayLang = lang;
        }
        if (lang === 'he') {
            addButtonText = 'הוסף';
            displayLang = 'he';
        } else {
            addButtonText = 'Add';
            displayLang = 'en';
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

        // Color palette tooltips
        const colorOptions = document.querySelectorAll('.color_option');
        colorOptions.forEach(option => {
            const color = option.getAttribute('data-color');
            switch (color) {
                case '#f7941e':
                    option.title = translations[lang]['title_color_orange'];
                    break;
                case '#2196f3':
                    option.title = translations[lang]['title_color_blue'];
                    break;
                case '#4caf50':
                    option.title = translations[lang]['title_color_green'];
                    break;
                case '#f44336':
                    option.title = translations[lang]['title_color_red'];
                    break;
                case '#9c27b0':
                    option.title = translations[lang]['title_color_purple'];
                    break;
                case '#e91e63':
                    option.title = translations[lang]['title_color_pink'];
                    break;
            }
        });

        // Selection options
        // Theme selection options
        document.querySelector('#theme option[value="system"]').title = translations[lang]['title_system_theme'];
        document.querySelector('#theme option[value="light"]').title = translations[lang]['title_light_theme'];
        document.querySelector('#theme option[value="dark"]').title = translations[lang]['title_dark_theme'];
        // Language selection options
        document.querySelector('#language option[value="system"]').title = translations[lang]['title_system_language'];
        document.querySelector('#language option[value="he"]').title = translations[lang]['title_he_language'];
        document.querySelector('#language option[value="en"]').title = translations[lang]['title_en_language'];
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

    function applyColor(color) {
        // Define color mappings for light and dark themes
        const colorMappings = {
            '#f7941e': { // Orange
                light: {
                    h1Color: '#e9870e',
                    buttonBg: '#f7941e',
                    buttonStartColor: '#f7941e',
                    buttonEndColor: '#ffd38064',
                    otherColor: '#f49b55'
                },
                dark: {
                    h1Color: '#f49b55',
                    buttonBg: '#f7941e',
                    buttonStartColor: '#f7941e',
                    buttonEndColor: '#b86600',
                    otherColor: '#f49b55'
                }
            },
            '#2196f3': { // Blue
                light: {
                    h1Color: '#1976d2',
                    buttonBg: '#2196f3',
                    buttonStartColor: '#2196f3',
                    buttonEndColor: '#64b5f6',
                    otherColor: '#42a5f5'
                },
                dark: {
                    h1Color: '#42a5f5',
                    buttonBg: '#2196f3',
                    buttonStartColor: '#2196f3',
                    buttonEndColor: '#1565c0',
                    otherColor: '#42a5f5'
                }
            },
            '#4caf50': { // Green
                light: {
                    h1Color: '#388e3c',
                    buttonBg: '#4caf50',
                    buttonStartColor: '#4caf50',
                    buttonEndColor: '#81c784',
                    otherColor: '#66bb6a'
                },
                dark: {
                    h1Color: '#66bb6a',
                    buttonBg: '#4caf50',
                    buttonStartColor: '#4caf50',
                    buttonEndColor: '#2e7d32',
                    otherColor: '#66bb6a'
                }
            },
            '#f44336': { // Red
                light: {
                    h1Color: '#d32f2f',
                    buttonBg: '#f44336',
                    buttonStartColor: '#f44336',
                    buttonEndColor: '#ef5350',
                    otherColor: '#e57373'
                },
                dark: {
                    h1Color: '#e57373',
                    buttonBg: '#f44336',
                    buttonStartColor: '#f44336',
                    buttonEndColor: '#c62828',
                    otherColor: '#e57373'
                }
            },
            '#9c27b0': { // Purple
                light: {
                    h1Color: '#7b1fa2',
                    buttonBg: '#9c27b0',
                    buttonStartColor: '#9c27b0',
                    buttonEndColor: '#ba68c8',
                    otherColor: '#ab47bc'
                },
                dark: {
                    h1Color: '#ab47bc',
                    buttonBg: '#9c27b0',
                    buttonStartColor: '#9c27b0',
                    buttonEndColor: '#6a1b9a',
                    otherColor: '#ab47bc'
                }
            },
            '#e91e63': { // Pink
                light: {
                    h1Color: '#c2185b',
                    buttonBg: '#e91e63',
                    buttonStartColor: '#e91e63',
                    buttonEndColor: '#f06292',
                    otherColor: '#ec407a'
                },
                dark: {
                    h1Color: '#ec407a',
                    buttonBg: '#e91e63',
                    buttonStartColor: '#e91e63',
                    buttonEndColor: '#ad1457',
                    otherColor: '#ec407a'
                }
            }
        };

        // Apply color CSS variables to the document
        const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
        const colorSet = colorMappings[color];
        if (colorSet) {
            const colors = isDark ? colorSet.dark : colorSet.light;

            document.documentElement.style.setProperty('--h1-color', colors.h1Color);
            document.documentElement.style.setProperty('--button-bg', colors.buttonBg);
            document.documentElement.style.setProperty('--button-start-color', colors.buttonStartColor);
            document.documentElement.style.setProperty('--button-end-color', colors.buttonEndColor);
            document.documentElement.style.setProperty('--other-color', colors.otherColor);
        }

        // Update selected color option
        document.querySelectorAll('.color_option').forEach(option => {
            option.classList.remove('selected');
        });
        const selectedOption = document.querySelector(`[data-color="${color}"]`);
        if (selectedOption) {
            selectedOption.classList.add('selected');
        }

        // Change extension icon based on color
        changeExtensionIcon(color);
    }

    function changeExtensionIcon(color) {
        let iconFolder;
        // Only change to blue icon if blue is selected, otherwise use default orange
        if (color === '#2196f3') { // Blue
            iconFolder = 'images/icon-blue-';
        } else if (color === '#4caf50') { // Green
            iconFolder = 'images/icon-green-';
        } else if (color === '#f44336') { // Red
            iconFolder = 'images/icon-red-';
        } else if (color === '#9c27b0') { // Purple
            iconFolder = 'images/icon-purple-';
        } else if (color === '#e91e63') { // Pink
            iconFolder = 'images/icon-pink-';
        } else {
            iconFolder = 'images/icon-'; // Default orange for all other colors
        }
        let colorName = iconFolder.replace('images/icon-', '').replace('-', '');
        if (!colorName) colorName = 'orange';

        chrome.action.setIcon({
            path: {
                "16": chrome.runtime.getURL(iconFolder + "16.png"),
                "32": chrome.runtime.getURL(iconFolder + "32.png"),
                "48": chrome.runtime.getURL(iconFolder + "48.png"),
                "128": chrome.runtime.getURL(iconFolder + "128.png")
            }
        }, function () {
            if (chrome.runtime.lastError) {
                console.error("Error setting ", colorName, " icon:", chrome.runtime.lastError.message);
            }
        });

        // Also update the favicon for the options page
        updateOptionsFavicon(color);
    }

    function updateOptionsFavicon(color) {
        const favicon = document.getElementById('favicon');
        if (favicon) {
            let iconFolder;
            if (color === '#2196f3') { // Blue
                iconFolder = 'images/icon-blue-';
            } else if (color === '#4caf50') { // Green
                iconFolder = 'images/icon-green-';
            } else if (color === '#f44336') { // Red
                iconFolder = 'images/icon-red-';
            } else if (color === '#9c27b0') { // Purple
                iconFolder = 'images/icon-purple-';
            } else if (color === '#e91e63') { // Pink
                iconFolder = 'images/icon-pink-';
            } else {
                iconFolder = 'images/icon-'; // Default orange for all other colors
            }

            const iconUrl = chrome.runtime.getURL(iconFolder + "16.png");
            favicon.href = iconUrl;
        }
    }

    function loadOptions() {
        chrome.storage.local.get([
            'user_name',
            'id',
            'theme',
            'lang',
            'color',
            'saved_courses',
            'password',
            'auto_add_moodle_courses',
            'enable_departmental_details',
            'course_name_preferred_lang'
        ], function (result) {
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

            // Apply color and set default if not exists
            const selectedColor = result.color || '#f7941e';
            if (!result.color) {
                // Set default color in storage if not set
                chrome.storage.local.set({ color: selectedColor });
            }
            applyColor(selectedColor);

            if (result.saved_courses) {
                for (const course_number in result.saved_courses) {
                    let courseName;
                    const courseData = result.saved_courses[course_number];

                    if (courseData && courseData.names) {
                        const preferredLang = result.course_name_preferred_lang;
                        courseName = courseData.names[preferredLang] || courseData.names['en'] || courseData.names['he'];
                    }

                    if (courseName) {
                        addCourseLine(course_number, courseName);
                    }
                }
                // Update conversion buttons visibility after loading all courses
                updateConversionButtonsVisibility();
            } else {
                // No courses, hide conversion buttons
                updateConversionButtonsVisibility();
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

    // Color palette event listeners
    document.addEventListener('click', function (e) {
        if (e.target.closest('.color_option')) {
            const colorOption = e.target.closest('.color_option');
            const selectedColor = colorOption.getAttribute('data-color');

            chrome.storage.local.set({ color: selectedColor }, function () {
                applyColor(selectedColor);
            });
        }
    });

    // Listen for system theme changes
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function (e) {
        chrome.storage.local.get(['theme'], function (result) {
            if (!result.theme || result.theme === 'system') {
                document.documentElement.setAttribute('data-theme', e.matches ? 'dark' : 'light');
                // Reapply color after theme change
                chrome.storage.local.get(['color'], function (colorResult) {
                    const color = colorResult.color || '#f7941e';
                    applyColor(color);
                });
            }
        });
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
            saveButton.textContent = translations[displayLang]['saving'];
        } else {
            translations['en']['save'] = 'Save';
            translations['he']['save'] = 'שמור';
            saveButton.disabled = false;
            saveButton.style.opacity = '1';
            saveButton.style.pointerEvents = 'auto';
            saveButton.textContent = translations[displayLang]['save'];
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
            await chrome.storage.local.set({ allowCourseValidation: 1 });
            const storageResult = await chrome.storage.local.get(['course_name_preferred_lang']);
            const preferredLang = storageResult.course_name_preferred_lang;
            const tabId = await openBGU4UTab(courseNumber, preferredLang);
        } catch (error) {
            handleMessages('Error opening BGU tab', 'שגיאה בפתיחת הטאב', error, false);
            return;
        }
    });

    // Course name conversion event listeners
    convertToHebrewButton.addEventListener('click', async function (e) {
        e.preventDefault();
        await convertCourseNames('he');
    });

    convertToEnglishButton.addEventListener('click', async function (e) {
        e.preventDefault();
        await convertCourseNames('en');
    });

    // Convert course names to specified language
    async function convertCourseNames(targetLang) {
        if (!navigator.onLine) {
            handleMessages('No internet connection', 'אין חיבור לאינטרנט', 'error', false);
            return;
        }

        // Set converting state
        setConvertingState(true, targetLang);

        try {
            let courseExists = false;
            const result = await chrome.storage.local.get(['saved_courses']);
            const savedCourses = result.saved_courses || {};
            const coursesToConvert = [];



            // Find courses that need conversion
            for (const courseNumber in savedCourses) {
                const courseData = savedCourses[courseNumber];

                if (!courseData.names[targetLang]) {
                    coursesToConvert.push(courseNumber);
                }
                else{
                    //change course name to preferred language if it exists
                    const courseInput = document.getElementById(`course_name_input${courseNumber}`);
                    if (courseInput) {
                        courseInput.value = courseData.names[targetLang];
                        courseExists = true;
                    }
                }
            }

            if (coursesToConvert.length === 0 ) {
                const langName = targetLang === 'he' ? 'Hebrew' : 'English';
                const langNameHe = targetLang === 'he' ? 'עברית' : 'אנגלית';
                if (courseExists) {
                    await chrome.storage.local.set({ course_name_preferred_lang: targetLang });
                    handleMessages(`Course names updated to ${langName}`, `שמות הקורסים עודכנו ל${langNameHe}`, null, false);
                } else {
                    handleMessages(`No courses to convert to ${langName}`, `אין קורסים להמיר ל${langNameHe}`, null, false);
                }
                setConvertingState(false);
                return;
            }

            // Store conversion state
            await chrome.storage.local.set({
                course_name_preferred_lang: targetLang,
                allowCourseValidation: coursesToConvert.length,
                converting_courses: true,
                total_courses_to_convert: coursesToConvert.length,
                converted_courses: 0
            });

            // Open tabs for courses that need conversion
            for (const courseNumber of coursesToConvert) {
                await openBGU4UTab(courseNumber, targetLang);
                // Small delay to prevent too many simultaneous requests
                await new Promise(resolve => setTimeout(resolve, 500));
            }

        } catch (error) {
            console.error('Error during conversion:', error);
            handleMessages('Conversion failed', 'ההמרה נכשלה', 'error', false);
            setConvertingState(false);
        }
    }

    // Set converting state for buttons
    function setConvertingState(converting, targetLang = null) {
        if (converting) {
            convertToHebrewButton.disabled = true;
            convertToEnglishButton.disabled = true;

            if (targetLang === 'he') {
                convertToHebrewButton.classList.add('converting');
                convertToHebrewButton.textContent = translations[displayLang]['converting_to_hebrew'];
            } else if (targetLang === 'en') {
                convertToEnglishButton.classList.add('converting');
                convertToEnglishButton.textContent = translations[displayLang]['converting_to_english'];
            }
        } else {
            convertToHebrewButton.disabled = false;
            convertToEnglishButton.disabled = false;
            convertToHebrewButton.classList.remove('converting');
            convertToEnglishButton.classList.remove('converting');
            convertToHebrewButton.textContent = translations[displayLang]['convert_to_hebrew'];
            convertToEnglishButton.textContent = translations[displayLang]['convert_to_english'];
        }
    }

    chrome.runtime.onMessage.addListener(async function (message, sender) {
        const tabId = sender.tab.id;
        const storage = await chrome.storage.local.get(['allowCourseValidation', 'converting_courses', 'total_courses_to_convert', 'converted_courses', 'course_name_preferred_lang']);
        let remainingTabs = storage.allowCourseValidation || 0;
        if (message.type === 'COURSE_FOUND') {
            remainingTabs -= 1;
            if (remainingTabs <= 0) {
                await chrome.storage.local.remove('allowCourseValidation');
            } else {
                await chrome.storage.local.set({ allowCourseValidation: remainingTabs });
            }

            if (message.courseName) {
                const courseName = message.courseName;
                const courseNumber = message.courseNumber;

                if (storage.converting_courses) {
                    // Handle course conversion
                    await handleCourseConversion(courseNumber, courseName, storage);
                } else {
                    // Handle regular course addition
                    await handleCourseAddition(courseNumber, courseName, storage);
                }
            } else {
                handleMessages('Course number is invalid', 'מספר הקורס לא תקין', 'error', false);
                if (storage.converting_courses) {
                    setConvertingState(false);
                    await chrome.storage.local.remove(['converting_courses', 'total_courses_to_convert', 'converted_courses']);
                }
            }
        } else if (message.type === 'COURSE_NOT_FOUND' && storage.converting_courses) {
            remainingTabs -= 1;
            if (remainingTabs <= 0) {
                await chrome.storage.local.remove('allowCourseValidation');
            } else {
                await chrome.storage.local.set({ allowCourseValidation: remainingTabs });
            }
            handleMessages('Course ' + message.courseNumber + ' not found', 'הקורס ' + message.courseNumber + ' לא נמצא', 'error', false);

            // Delete the course from storage
            const removeCourseButton = document.getElementById("remove_course_button" + message.courseNumber);
            if (removeCourseButton) {
                removeCourseButton.click();
            }

            // Update conversion progress
            let convertedCount = (storage.converted_courses || 0) + 1;
            await chrome.storage.local.set({ converted_courses: convertedCount });

            // Check if all courses are converted
            if (convertedCount >= storage.total_courses_to_convert) {
                handleMessages('All courses processed', 'כל הקורסים טופלו', null, false);
                await chrome.storage.local.remove(['converting_courses', 'total_courses_to_convert', 'converted_courses']);
                setConvertingState(false);
            }
        } else if (message.type === 'CONNECTION_ERROR') {
            handleMessages('Connection error', 'שגיאת חיבור', 'error', false);
            chrome.storage.local.remove('allowCourseValidation');
            chrome.storage.local.remove('allowUserValidation');
            chrome.storage.local.remove('checkedUserDetails');
            chrome.storage.local.remove(['converting_courses', 'total_courses_to_convert', 'converted_courses']);
        }
        else if (message.type === 'COURSE_NOT_FOUND') {
            handleMessages('Course ' + message.courseNumber + ' not found', 'הקורס ' + message.courseNumber + ' לא נמצא', 'error', false);
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

    function updateConversionButtonsVisibility() {
        const coursesList = document.getElementById("courses_list");
        const conversionButtons = document.querySelector(".course_conversion_buttons");

        if (coursesList && coursesList.childElementCount > 0) {
            // Show conversion buttons if there are courses
            conversionButtons.style.display = "flex";
        } else {
            // Hide conversion buttons if there are no courses
            conversionButtons.style.display = "none";
        }
    }

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
            coursesLegend.textContent = translations[displayLang]['saved_courses'];

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
        courseNameElement.setAttribute("title", translations[displayLang]['title_course_name']);

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
        courseLabel.setAttribute("title", translations[displayLang]['title_course_number_label'] + course_number);

        // Create edit button
        const editCourseNameButton = document.createElement("button");
        editCourseNameButton.innerHTML = editIcon;
        editCourseNameButton.className = "edit_course_name_button";
        editCourseNameButton.id = "edit_course_name_button" + course_number;
        editCourseNameButton.style.display = 'none';
        editCourseNameButton.setAttribute("title", translations[displayLang]['title_edit_course']);
        editCourseNameButton.addEventListener('click', function (e) {
            e.preventDefault();
            // save course name
            const course_name = document.getElementById("course_name_input" + course_number).value.trim();
            chrome.storage.local.get(['saved_courses', 'course_name_preferred_lang'], function (result) {
                const savedCourses = result.saved_courses || {};
                let courseData = savedCourses[course_number];

                if (typeof courseData === 'string') {
                    // Convert old format to new format
                    const oldLang = detectLanguage(courseData);
                    const currentLang = result.course_name_preferred_lang || oldLang;
                    courseData = {
                        names: {
                            [oldLang]: courseData,
                            [currentLang]: course_name
                        }
                    };
                } else if (courseData && courseData.names) {
                    // Update existing course data
                    const currentLang = result.course_name_preferred_lang || 'he';
                    courseData.names[currentLang] = course_name;
                } else {
                    // Create new course data
                    const defaultLang = result.course_name_preferred_lang || (navigator.language.startsWith('he') ? 'he' : 'en');
                    courseData = {
                        names: {
                            [defaultLang]: course_name
                        }
                    };
                }

                savedCourses[course_number] = courseData;
                chrome.storage.local.set({ saved_courses: savedCourses });
            });
            handleMessages('Course name saved', 'שם הקורס נשמר', null, false);
            this.style.display = 'none';
        });

        // Create remove button
        const removeCourseButton = document.createElement("button");
        removeCourseButton.innerHTML = removeIcon;
        removeCourseButton.className = "remove_course_button";
        removeCourseButton.id = "remove_course_button" + course_number;
        removeCourseButton.setAttribute("title", translations[displayLang]['title_remove_course']);

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
                updateConversionButtonsVisibility();
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

        updateConversionButtonsVisibility();
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
            addCourseButton.innerHTML = translations[displayLang]['adding_course_button'];
        } else {
            addCourseButton.classList.remove('adding_course');
            addCourseButton.textContent = translations[displayLang]['add_course_button'];
        }
    }

    // Handle course addition process
    async function handleCourseAddition(courseNumber, courseName, storage) {
        const defaultLang = storage.course_name_preferred_lang;
        const courseData = {
            names: {
                [defaultLang]: courseName
            }
        };

        if (!result.saved_courses) {
            courseFormData.saved_courses = { [courseNumber]: courseData };
        } else {
            courseFormData.saved_courses = { ...result.saved_courses, [courseNumber]: courseData };
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
    }

    // Handle course conversion process
    async function handleCourseConversion(courseNumber, courseName, storage) {
        try {
            const result = await chrome.storage.local.get(['saved_courses']);
            const savedCourses = result.saved_courses || {};

            if (savedCourses[courseNumber]) {
                let courseData;
                courseData = { ...savedCourses[courseNumber] };
                courseData.names[storage.course_name_preferred_lang] = courseName;

                // Update saved courses
                savedCourses[courseNumber] = courseData;
                await chrome.storage.local.set({ saved_courses: savedCourses });

                // Update UI
                const courseInput = document.getElementById(`course_name_input${courseNumber}`);
                if (courseInput) {
                    const preferredLang = storage.course_name_preferred_lang;
                    courseInput.value = courseData.names[preferredLang] || courseName;
                }
            }

            // Update conversion progress
            let convertedCount = (storage.converted_courses || 0) + 1;
            await chrome.storage.local.set({ converted_courses: convertedCount });

            // Check if all courses are converted
            if (convertedCount >= storage.total_courses_to_convert) {
                handleMessages('All courses processed', 'כל הקורסים טופלו', null, false);
                setConvertingState(false);
                await chrome.storage.local.remove(['converting_courses', 'total_courses_to_convert', 'converted_courses']);
            }
        } catch (error) {
            console.error('Error in handleCourseConversion:', error);
            handleMessages(
                "Failed to convert course names",
                "המרת שמות הקורסים נכשלה",
                'error',
                false
            );
            setConvertingState(false);
            await chrome.storage.local.remove(['converting_courses', 'total_courses_to_convert', 'converted_courses', 'allowCourseValidation']);
        }
    }

});

// Detect language of course name
function detectLanguage(text) {
    // Simple Hebrew detection - if the text contains Hebrew characters
    const hebrewRegex = /[\u0590-\u05FF]/;
    return hebrewRegex.test(text) ? 'he' : 'en';
}

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

async function openBGU4UTab(courseNumber, lang = 'he') {
    try {
        const ex_department = courseNumber.substring(0, 3);
        const ex_degree_level = courseNumber[4];
        const ex_course = courseNumber.substring(6, 10);
        // Create new tab
        const tab = await chrome.tabs.create({
            url: "https://bgu4u.bgu.ac.il/pls/scwp/!app.ann?lang=" + lang + "&step=999&ex_department="
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
