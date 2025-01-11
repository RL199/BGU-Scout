"use strict";

document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('options_form');
    const theme_select = document.getElementById('theme');
    const lang_select = document.getElementById('language');
    const toast = document.getElementById('toast');

    const translations = {
        en: {
            options: "Options",
            user_name: "User Name:",
            password: "Password:",
            id: "ID:",
            theme: "Color Theme:",
            light: "Light",
            dark: "Dark",
            system: "System",
            language: "Language:",
            save: "Save",
            forgot_password: "Forgot Password",
            options_saved: "Options Saved",
            add_course_number: "Add Course Number:",
            header1: "Options",
            add_course_button: "Add",
            remove_course_button: "Remove",
            saved_courses: "Saved Course Numbers:",
            disclaimer: `*Disclaimer: This extension is not affiliated with Ben-Gurion University of the Negev.
            Your details are not stored outside the extension, they are only used for automatic filling of the login form on the BGU4U website.`
        },
        he: {
            options: "אפשרויות",
            user_name: "שם משתמש:",
            password: "סיסמה:",
            id: "מספר זהות:",
            theme: "ערכת נושא:",
            light: "בהיר",
            dark: "כהה",
            system: "מערכת",
            language: "שפה:",
            save: "שמור",
            forgot_password: "שכחתי סיסמה",
            options_saved: "האפשרויות נשמרו",
            add_course_number: "הוסף מספר קורס:",
            header1: "אפשרויות",
            add_course_button: "הוסף",
            remove_course_button: "הסר",
            saved_courses: "מספרי קורסים שנשמרו:",
            disclaimer: `*לידיעתך: התוסף הזה אינו קשור לאוניברסיטת בן-גוריון בנגב.
            הפרטים שלך לא נשמרים מחוץ לתוסף, הם משמשים רק למילוי אוטומטי של טופס ההתחברות באתר BGU4U.`
        }
    };

    function showToast(enMessage, hebMessage) {
        translations['en']['options_saved'] = enMessage;
        translations['he']['options_saved'] = hebMessage;
        apply_lang(document.documentElement.getAttribute('data-lang'));
        toast.classList.add('show');
        setTimeout(() => {
            toast.classList.remove('show');
        }, 3000);
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
        const prefersHebrew = window.matchMedia('(prefers-language-scheme: hebrew)').matches;
        if (lang === 'system') {
            lang = prefersHebrew ? 'he' : 'en';
        }
        if(lang==='he'){
            addButtonText = 'הוסף';
            removeButtonText = 'הסר';
        } else {
            addButtonText = 'Add';
            removeButtonText = 'Remove';
        }
        document.documentElement.setAttribute('data-lang', lang);
        const elements = document.querySelectorAll('[data-i18n]');
        elements.forEach(el => {
            const key = el.getAttribute('data-i18n');
            el.textContent = translations[lang][key];
        });
    }

    // Load saved options
    chrome.storage.sync.get(['user_name', 'id', 'theme', 'lang', 'saved_course_numbers'], function(result) {
        if (result.user_name) document.getElementById('user_name').value = result.user_name;
        if (result.id) document.getElementById('id').value = result.id;
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
        if (result.saved_course_numbers) {
            const courseNumbers = result.saved_course_numbers.split(',');
            courseNumbers.forEach(course_number => {
                addCourseNumberLine(course_number);
            });
        }
    });

    theme_select.addEventListener('change', function() {
        const selectedTheme = this.value;
        apply_theme(selectedTheme);
        chrome.storage.sync.set({ theme: selectedTheme });
    });

    lang_select.addEventListener('change', function() {
        const selected_lang = this.value;
        apply_lang(selected_lang);
        chrome.storage.sync.set({ lang: selected_lang });
    });

    // Form submission
    form.addEventListener('submit', function(e) {
        e.preventDefault();

        // Gather form data
        const formData = {
            user_name: document.getElementById('user_name').value,
            password: document.getElementById('password').value,
            id: document.getElementById('id').value,
            theme: theme_select.value,
            lang: lang_select.value,
        };

        // Save data to Chrome storage
        chrome.storage.sync.set(formData, function() {
            console.log('Options saved');
            showToast('Options saved', 'האפשרויות נשמרו');
        });
    });

    // Listen for system theme changes
    window.matchMedia('(prefers-color-scheme: dark)').addListener(function() {
        if (theme_select.value === 'system') {
            apply_theme('system');
        }
    });

    window.matchMedia('(prefers-language-scheme: hebrew)').addListener(function() {
        if (lang_select.value === 'system') {
            apply_lang('system');
        }
    });

    // Mouse-tracking gradient effect
    const saveButton = document.getElementById('save_button');
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

    // Course numbers input handling
    const NewCourseNumberInput = document.getElementById('add_course_number');
    const addCourseButton = document.getElementById('add_course_button');

    // Set initial button state
    addCourseButton.disabled = true;
    let addButtonText = '';
    let removeButtonText = '';

    NewCourseNumberInput.addEventListener('input', function() {
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

    async function handleNewCourseSubmission(e) {
        e.preventDefault();
        const formData = {};
        NewCourseNumberInput.value = NewCourseNumberInput.value.trim();
        // check if course number is in the format of digits and 2 dashes
        if (NewCourseNumberInput.value.match(/^\d{3}-\d{1}-\d{4}$/)) {
            NewCourseNumberInput.value = NewCourseNumberInput.value.replace(/-/g, '.');
        }

        // check if course number is only digits and 2 points
        if (!NewCourseNumberInput.value.match(/^\d{3}\.\d{1}\.\d{4}$/)) {
            showToast('Invalid course number', 'מספר קורס לא תקין');
            return;
        }

        try {
            const result = await chrome.storage.sync.get(['saved_course_numbers']);
            const courseNumbers = result.saved_course_numbers ? result.saved_course_numbers.split(',') : [];

            if (courseNumbers.includes(NewCourseNumberInput.value)) {
                showToast('Course number already exists', 'מספר הקורס כבר קיים');
                return;
            }

            formData.saved_course_numbers = courseNumbers.length > 0
                ? `${result.saved_course_numbers},${NewCourseNumberInput.value}`
                : NewCourseNumberInput.value;

            await chrome.storage.sync.set(formData);
            NewCourseNumberInput.value = '';

            const event = new Event('input', {
                bubbles: true,
                cancelable: true,
            });
            NewCourseNumberInput.dispatchEvent(event);

            addCourseNumberLine(formData.saved_course_numbers.split(',').pop());
            showToast('Course number added', 'מספר הקורס נוסף');

        } catch (error) {
            console.error('Error handling course submission:', error);
            showToast('Error saving course', 'שגיאה בשמירת הקורס');
        }
    }

    addCourseButton.addEventListener('click', function(e) {
        handleNewCourseSubmission(e);
    });

    function addCourseNumberLine(course_number) {
        // Get or create courses form
        let coursesForm = document.getElementById("courses_form");
        if (!coursesForm) {
            coursesForm = document.createElement("div");
            coursesForm.id = "courses_form";  
            form.insertBefore(coursesForm, form.children[-1]);
            const savedCoursesLabel = document.createElement("label");
            savedCoursesLabel.id = "saved_courses_label";
            savedCoursesLabel.setAttribute('data-i18n', 'saved_courses');
            savedCoursesLabel.textContent = translations[document.documentElement.getAttribute('data-lang')]['saved_courses'];
            coursesForm.appendChild(savedCoursesLabel);
        }

        // Create line container
        const lineContainer = document.createElement("div");
        lineContainer.className = "course_line";

        // Create course number input
        const courseNumberInput = document.createElement("input");
        courseNumberInput.type = "text";
        courseNumberInput.value = course_number;
        courseNumberInput.disabled = true;
        courseNumberInput.className = "course_number_input";

        // Create remove button
        const removeCourseButton = document.createElement("button");
        removeCourseButton.setAttribute('data-i18n', 'remove_course_button');
        removeCourseButton.textContent = removeButtonText;
        removeCourseButton.className = "remove_course_button";
        removeCourseButton.id = "remove_course_button";

        // Add remove functionality
        removeCourseButton.addEventListener('click', function(e) {
            e.preventDefault();
            chrome.storage.sync.get(['saved_course_numbers'], function(result) {
                if (result.saved_course_numbers) {
                    const courseNumbers = result.saved_course_numbers.split(',');
                    const updatedNumbers = courseNumbers.filter(num => num !== course_number);
                    chrome.storage.sync.set({ saved_course_numbers: updatedNumbers.join(',') });
                    lineContainer.remove();
                }
                // Remove courses form and label if no courses are left
                if (document.getElementById("courses_form").childElementCount === 1) {
                    document.getElementById("courses_form").remove();
                }
            });
        });

        // Append elements
        lineContainer.appendChild(courseNumberInput);
        lineContainer.appendChild(removeCourseButton);
        coursesForm.appendChild(lineContainer);
    }
});

document.getElementById("forgot_password").addEventListener("click", function() {
    const url = "https://bgu4u.bgu.ac.il/remind/login.php";
    chrome.tabs.create({ url: url });
});
