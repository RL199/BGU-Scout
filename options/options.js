"use strict";

document.addEventListener('DOMContentLoaded', function () {
    // Form elements
    const userForm = document.getElementById('user_form');
    const coursesForm = document.getElementById('courses_form');
    const themeSelect = document.getElementById('theme');
    const langSelect = document.getElementById('language');
    const autoAddMoodleCourses = document.getElementById('auto_add_moodle_courses');
    const enableDepartmentalDetails = document.getElementById('enable_departmental_details');
    const userNameEl = document.getElementById('user_name');
    const passwordEl = document.getElementById('password');
    const idEl = document.getElementById('id');
    const forgotPasswordEl = document.getElementById('forgot_password');
    const courseNumberEl = document.getElementById('add_course_number');

    // Button elements
    const saveButton = document.getElementById('save_button');
    const addCourseButton = document.getElementById('add_course_button');
    const convertToHebrewButton = document.getElementById('convert_to_hebrew');
    const convertToEnglishButton = document.getElementById('convert_to_english');

    // UI elements
    const toast = document.getElementById('toast');
    const NewCourseNumberInput = document.getElementById('add_course_number');

    // Header elements
    const generalHeader = document.querySelector('h1[data-i18n="general_options_container_header"]');
    const userHeader = document.querySelector('h1[data-i18n="user_container_header"]');
    const coursesHeader = document.querySelector('h1[data-i18n="courses_container_header"]');

    // Option elements
    const systemThemeEl = document.querySelector('#theme option[value="system"]');
    const lightThemeEl = document.querySelector('#theme option[value="light"]');
    const darkThemeEl = document.querySelector('#theme option[value="dark"]');
    const systemLangEl = document.querySelector('#language option[value="system"]');
    const heLangEl = document.querySelector('#language option[value="he"]');
    const enLangEl = document.querySelector('#language option[value="en"]');

    // Other elements
    const disclaimerEl = document.querySelector('.disclaimer');
    const favicon = document.getElementById('favicon');

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
    let translations = {}; // Store loaded translations

    // Load translations from JSON files
    async function loadTranslations(lang) {
        try {
            const response = await fetch(chrome.runtime.getURL(`_locales/${lang}/messages.json`));
            const data = await response.json();
            translations[lang] = data;
        } catch (error) {
            console.error(`Failed to load translations for ${lang}:`, error);
            // Fallback to English if loading fails
            if (lang !== 'en') {
                await loadTranslations('en');
            }
        }
    }

    // Initialize i18n system with custom translation loader
    function getMessage(key, substitutions = null, forceLang = null) {
        const lang = forceLang || displayLang;

        // First try custom loaded translations
        if (translations[lang] && translations[lang][key]) {
            let message = translations[lang][key].message;

            // Handle substitutions if provided
            if (substitutions) {
                if (Array.isArray(substitutions)) {
                    substitutions.forEach((sub, index) => {
                        message = message.replace(`$${index + 1}`, sub);
                    });
                } else {
                    message = message.replace('$1', substitutions);
                }
            }

            return message;
        }

        // Fallback to Chrome's built-in i18n
        const result = chrome.i18n.getMessage(key, substitutions);
        return result || key;
    }

    const removeIcon = `
        <svg xmlns="http://www.w3.org/2000/svg" id="remove_icon" viewBox="0 0 16 16">
            <path d="M6.5 1h3a.5.5 0 0 1 .5.5v1H6v-1a.5.5 0 0 1 .5-.5M11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3A1.5 1.5 0 0 0 5 1.5v1H1.5a.5.5 0 0 0 0 1h.538l.853 10.66A2 2 0 0 0 4.885 16h6.23a2 2 0 0 0 1.994-1.84l.853-10.66h.538a.5.5 0 0 0 0-1zm1.958 1-.846 10.58a1 1 0 0 1-.997.92h-6.23a1 1 0 0 1-.997-.92L3.042 3.5zm-7.487 1a.5.5 0 0 1 .528.47l.5 8.5a.5.5 0 0 1-.998.06L5 5.03a.5.5 0 0 1 .47-.53Zm5.058 0a.5.5 0 0 1 .47.53l-.5 8.5a.5.5 0 1 1-.998-.06l.5-8.5a.5.5 0 0 1 .528-.47M8 4.5a.5.5 0 0 1 .5.5v8.5a.5.5 0 0 1-1 0V5a.5.5 0 0 1 .5-.5" />
        </svg>`;

    const editIcon = `
        <svg xmlns="http://www.w3.org/2000/svg" id="edit_course_name_icon" viewBox="0 0 16 16">
            <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z"/>
            <path fill-rule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5z"/>
        </svg>`;

    // Load saved options
    loadOptions();

    function showToast(message, type) {
        if (toastTimeout) {
            clearTimeout(toastTimeout);
        }

        toast.textContent = message;

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

    async function applyLang(lang) {
        const prefersHebrew = navigator.language.startsWith('he');
        if (lang === 'system') {
            lang = prefersHebrew ? 'he' : 'en';
            displayLang = lang;
        }
        if (lang === 'he') {
            displayLang = 'he';
        } else {
            displayLang = 'en';
        }

        // Load translations for the selected language
        await loadTranslations(displayLang);

        document.documentElement.setAttribute('lang', lang);
        document.documentElement.setAttribute('data-lang', lang);

        // Update all elements with data-i18n attributes
        const elementsToTranslate = document.querySelectorAll('[data-i18n]');
        elementsToTranslate.forEach(element => {
            const key = element.getAttribute('data-i18n');
            const translatedText = getMessage(key);
            if (translatedText && translatedText !== key) {
                // Use innerHTML for elements that contain HTML markup
                if (key === 'auto_add_moodle_courses_description' || key === 'enable_departmental_details_description' || key === 'disclaimer') {
                    element.innerHTML = translatedText;
                } else {
                    element.textContent = translatedText;
                }
            }
        });

        // Update title attributes and other special content
        document.title = `${getMessage('extension_name')} ${getMessage('options')}`;

        // Additional text updates that might not have data-i18n attributes
        updateSpecialElements();
    }

    function updateSpecialElements() {
        // Update any elements that need special handling
        const elementsWithTitleAttr = document.querySelectorAll('[data-i18n-title]');
        elementsWithTitleAttr.forEach(el => {
            const key = el.getAttribute('data-i18n-title');
            const text = getMessage(key);
            if (text && text !== key) {
                el.setAttribute('title', text);
                el.setAttribute('aria-label', text);
            }
        });

        // Update button text that's set dynamically
        addButtonText = getMessage('add_course_button');

        // Update title attributes for tooltips that aren't in the HTML
        if (generalHeader) generalHeader.title = getMessage('title_general_header');
        if (userHeader) userHeader.title = getMessage('title_user_header');
        if (coursesHeader) coursesHeader.title = getMessage('title_courses_header');

        // Form elements - using chrome.i18n.getMessage for tooltips
        if (themeSelect) themeSelect.title = getMessage('title_theme');
        if (langSelect) langSelect.title = getMessage('title_language');
        if (enableDepartmentalDetails) enableDepartmentalDetails.title = getMessage('title_enable_departmental');
        if (userNameEl) userNameEl.title = getMessage('title_username');
        if (passwordEl) passwordEl.title = getMessage('title_password');
        if (idEl) idEl.title = getMessage('title_id');
        if (saveButton) saveButton.title = getMessage('title_save');
        if (forgotPasswordEl) forgotPasswordEl.title = getMessage('title_forgot_password');
        if (disclaimerEl) disclaimerEl.title = getMessage('title_disclaimer');
        if (autoAddMoodleCourses) autoAddMoodleCourses.title = getMessage('title_moodle_sync');
        if (courseNumberEl) courseNumberEl.title = getMessage('title_course_number');
        if (addCourseButton) addCourseButton.title = getMessage('title_add_course');

        // Color palette tooltips
        const colorOptions = document.querySelectorAll('.color_option');
        colorOptions.forEach(option => {
            const color = option.getAttribute('data-color');
            switch (color) {
                case '#f7941e':
                    option.title = getMessage('title_color_orange');
                    break;
                case '#2196f3':
                    option.title = getMessage('title_color_blue');
                    break;
                case '#4caf50':
                    option.title = getMessage('title_color_green');
                    break;
                case '#f44336':
                    option.title = getMessage('title_color_red');
                    break;
                case '#9c27b0':
                    option.title = getMessage('title_color_purple');
                    break;
                case '#e91e63':
                    option.title = getMessage('title_color_pink');
                    break;
            }
        });

        // Selection options
        // Theme selection options
        if (systemThemeEl) systemThemeEl.title = getMessage('title_system_theme');
        if (lightThemeEl) lightThemeEl.title = getMessage('title_light_theme');
        if (darkThemeEl) darkThemeEl.title = getMessage('title_dark_theme');

        // Language selection options
        if (systemLangEl) systemLangEl.title = getMessage('title_system_language');
        if (heLangEl) heLangEl.title = getMessage('title_he_language');
        if (enLangEl) enLangEl.title = getMessage('title_en_language');

        // Update tooltips for dynamically created course elements
        const courseNameInputs = document.querySelectorAll('.course_name_input');
        courseNameInputs.forEach(input => {
            input.title = getMessage('title_course_name');
        });

        const courseLabels = document.querySelectorAll('.course_label');
        courseLabels.forEach(label => {
            const courseNumber = label.textContent;
            const labelText = getMessage('title_course_number_label');
            label.title = labelText + courseNumber;
        });

        const editCourseButtons = document.querySelectorAll('.edit_course_name_button');
        editCourseButtons.forEach(button => {
            button.title = getMessage('title_edit_course');
        });

        const removeCourseButtons = document.querySelectorAll('.remove_course_button');
        removeCourseButtons.forEach(button => {
            button.title = getMessage('title_remove_course');
        });
    }

    function applyColor(color) {
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
        updateFavicon(color);
    }

    function updateFavicon(color) {
        if (favicon) {
            let iconFolder;
            if (color === '#2196f3') { // Blue
                iconFolder = '../images/icon-blue-';
            } else if (color === '#4caf50') { // Green
                iconFolder = '../images/icon-green-';
            } else if (color === '#f44336') { // Red
                iconFolder = '../images/icon-red-';
            } else if (color === '#9c27b0') { // Purple
                iconFolder = '../images/icon-purple-';
            } else if (color === '#e91e63') { // Pink
                iconFolder = '../images/icon-pink-';
            } else {
                iconFolder = '../images/icon-'; // Default orange for all other colors
            }

            favicon.href = iconFolder + "16.png";
        }
    }

    async function loadOptions() {
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
        ], async function (result) {
            if (result.user_name) userNameEl.value = result.user_name;
            if (result.id) idEl.value = result.id;
            if (result.password) passwordEl.value = result.password;
            if (result.theme) {
                themeSelect.value = result.theme;
                applyTheme(result.theme);
            } else {
                applyTheme('system');
            }
            if (result.lang) {
                langSelect.value = result.lang;
                await applyLang(result.lang);
            } else {
                await applyLang('system');
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
                enableDepartmentalDetails.checked = result.enable_departmental_details;
            }
        });
    }

    themeSelect.addEventListener('change', function () {
        const selectedTheme = this.value;
        applyTheme(selectedTheme);
        chrome.storage.local.set({ theme: selectedTheme });
    });

    langSelect.addEventListener('change', async function () {
        const selected_lang = this.value;
        await applyLang(selected_lang);
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

    enableDepartmentalDetails.addEventListener('change', function () {
        chrome.storage.local.set({ enable_departmental_details: (this.checked ? 1 : 0) });
    });

    // user form submission
    userForm.addEventListener('submit', async function (e) {
        e.preventDefault();

        setSaveLoading(true);

        if (!navigator.onLine) {
            handleMessages(getMessage('no_internet_connection'), 'error', true);
            return;
        }

        userFormData = {};
        const id = idEl.value.trim();
        const password = passwordEl.value.trim();
        const userName = userNameEl.value.trim();
        userFormData.id = id;
        userFormData.password = password;
        userFormData.user_name = userName;

        idEl.classList.remove('error');
        passwordEl.classList.remove('error');
        userNameEl.classList.remove('error');
        if (!id || !password || !userName) {
            handleMessages(getMessage('fill_all_fields'), 'error', true);
            if (!id) idEl.classList.add('error');
            if (!password) passwordEl.classList.add('error');
            if (!userName) userNameEl.classList.add('error');
            return;
        }

        const userDetails = await chrome.storage.local.get(['id', 'password', 'user_name']);
        if (userDetails.id === id && userDetails.password === password && userDetails.user_name === userName) {
            handleMessages(getMessage('user_details_saved'), null, true);
            return;
        }

        if (!IDValidator(id)) {
            handleMessages(getMessage('invalid_id'), 'error', true);
            idEl.classList.add('error');
            return;
        }

        try {
            const checkedUserDetails = { id, password, user_name: userName };
            await chrome.storage.local.set({ allowUserValidation: 1 });
            await chrome.storage.local.set({ checkedUserDetails: checkedUserDetails });
            try {
                const tabId = await openBGU4U22Tab();
            } catch (error) {
                handleMessages(getMessage('error_opening_tab'), error, true);
            }
        } catch (error) {
            handleMessages(getMessage('error_saving'), error, true);
        }
    });

    function setSaveLoading(loading) {
        if (loading) {
            saveButton.disabled = true;
            saveButton.style.opacity = '0.7';
            saveButton.style.pointerEvents = 'none';
            saveButton.textContent = getMessage('saving');
        } else {
            saveButton.disabled = false;
            saveButton.style.opacity = '1';
            saveButton.style.pointerEvents = 'auto';
            saveButton.textContent = getMessage('save');
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
            handleMessages(getMessage('no_internet_connection'), 'error', false);
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
            handleMessages(getMessage('invalid_course_number'), 'error', false);
            return;
        }

        try {
            result = await chrome.storage.local.get(['saved_courses']);

            if (result.saved_courses && result.saved_courses[courseNumber]) {
                handleMessages(getMessage('course_already_exists') + ' ' + courseNumber, null, false);
                return;
            }
        } catch (error) {
            handleMessages(getMessage('error_getting_courses'), error, false);
            return;
        }

        try {
            await chrome.storage.local.set({ allowCourseValidation: 1 });
            const storageResult = await chrome.storage.local.get(['course_name_preferred_lang']);
            const preferredLang = storageResult.course_name_preferred_lang;
            const tabId = await openBGU4UTab(courseNumber, preferredLang);
        } catch (error) {
            handleMessages(getMessage('error_opening_tab'), error, false);
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
            handleMessages(getMessage('no_internet_connection'), 'error', false);
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
                else {
                    //change course name to preferred language if it exists
                    const courseInput = document.getElementById(`course_name_input${courseNumber}`);
                    if (courseInput) {
                        courseInput.value = courseData.names[targetLang];
                        courseExists = true;
                    }
                }
            }

            if (coursesToConvert.length === 0) {
                const langNameEng = targetLang === 'he' ? 'Hebrew' : 'English';
                const langNameHeb = targetLang === 'he' ? 'עברית' : 'אנגלית';
                if (courseExists) {
                    await chrome.storage.local.set({ course_name_preferred_lang: targetLang });
                    if (targetLang === 'he') {
                        handleMessages(getMessage('course_names_updated') + langNameHeb, null, false);
                    } else {
                        handleMessages(getMessage('course_names_updated') + langNameEng, null, false);
                    }
                } else {
                    handleMessages(getMessage('no_courses_to_convert'), null, false);
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
            handleMessages(getMessage('conversion_failed'), 'error', false);
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
                convertToHebrewButton.textContent = getMessage('converting_to_hebrew');
            } else if (targetLang === 'en') {
                convertToEnglishButton.classList.add('converting');
                convertToEnglishButton.textContent = getMessage('converting_to_english');
            }
        } else {
            convertToHebrewButton.disabled = false;
            convertToEnglishButton.disabled = false;
            convertToHebrewButton.classList.remove('converting');
            convertToEnglishButton.classList.remove('converting');
            convertToHebrewButton.textContent = getMessage('convert_to_hebrew');
            convertToEnglishButton.textContent = getMessage('convert_to_english');
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
                handleMessages(getMessage('invalid_course_number'), 'error', false);
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
            handleMessages(getMessage('course_not_found') + ": " + message.courseNumber, 'error', false);

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
                handleMessages(getMessage('all_courses_processed'), null, false);
                await chrome.storage.local.remove(['converting_courses', 'total_courses_to_convert', 'converted_courses']);
                setConvertingState(false);
            }
        } else if (message.type === 'CONNECTION_ERROR') {
            handleMessages(getMessage('connection_error'), 'error', false);
            chrome.storage.local.remove('allowCourseValidation');
            chrome.storage.local.remove('allowUserValidation');
            chrome.storage.local.remove('checkedUserDetails');
            chrome.storage.local.remove(['converting_courses', 'total_courses_to_convert', 'converted_courses']);
        }
        else if (message.type === 'COURSE_NOT_FOUND') {
            handleMessages(getMessage('course_not_found') + ": " + message.courseNumber, 'error', false);
            chrome.storage.local.remove('allowCourseValidation');
        }
        else if (message.type === 'LOGIN_FAILED') {
            handleMessages(getMessage('invalid_user_details'), 'error', true);
            chrome.storage.local.remove('allowUserValidation');
            chrome.storage.local.remove('checkedUserDetails');
        }
        else if (message.type === 'FORM_FIELDS_NOT_FOUND') {
            handleMessages(getMessage('website_not_loaded'), 'error', true);
            chrome.storage.local.remove('allowUserValidation');
            chrome.storage.local.remove('checkedUserDetails');
        }
        else if (message.type === 'LOGIN_SUCCESS') {
            handleMessages(getMessage('user_details_saved_success'), null, true);
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
            coursesLegend.textContent = getMessage('saved_courses');

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
        courseNameElement.setAttribute("title", getMessage('title_course_name'));

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
        courseLabel.setAttribute("title", getMessage('title_course_number_label') + course_number);

        // Create edit button
        const editCourseNameButton = document.createElement("button");
        editCourseNameButton.innerHTML = editIcon;
        editCourseNameButton.className = "edit_course_name_button";
        editCourseNameButton.id = "edit_course_name_button" + course_number;
        editCourseNameButton.style.display = 'none';
        editCourseNameButton.setAttribute("title", getMessage('title_edit_course'));
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
            handleMessages(getMessage('course_name_saved'), null, false);
            this.style.display = 'none';
        });

        // Create remove button
        const removeCourseButton = document.createElement("button");
        removeCourseButton.innerHTML = removeIcon;
        removeCourseButton.className = "remove_course_button";
        removeCourseButton.id = "remove_course_button" + course_number;
        removeCourseButton.setAttribute("title", getMessage('title_remove_course'));

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
            handleMessages(getMessage('course_removed') + ": " + course_number, null, false);
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

    const handleMessages = (message, error, isSave) => {

        if (isSave) setSaveLoading(false);
        else AddingCourseButtonstyle(false);

        let type;
        if (error && error === 'error') {
            console.log(message);
            type = 'error';
        } else if (error) {
            console.log(error);
            type = 'error';
        } else {
            console.log(message);
            type = 'success';
        }

        showToast(message, type);
    };

    const AddingCourseButtonstyle = (adding) => {
        if (adding) {
            addCourseButton.classList.add('adding_course');
            addCourseButton.innerHTML = getMessage('adding_course_button');
        } else {
            addCourseButton.classList.remove('adding_course');
            addCourseButton.textContent = getMessage('add_course_button');
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

        handleMessages(getMessage('course_added') + ": " + courseName, null, false);
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
                handleMessages(getMessage('all_courses_processed'), null, false);
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
