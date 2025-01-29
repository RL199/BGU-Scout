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
            saving: "Saving...",
            forgot_password: "Forgot Password",
            toast_message: "",
            add_course_number: "Add Course Number:",
            header1: "Options",
            add_course_button: "Add",
            remove_course_button: "Remove",
            saved_courses: "Saved Course Numbers",
            disclaimer: `Disclaimer: This extension is not affiliated with Ben-Gurion University of the Negev.
            Your details are not stored outside the extension, they are only used for automatic filling of the login form on the BGU4U website.`
        },
        he: {
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
            header1: "אפשרויות",
            add_course_button: "הוסף",
            remove_course_button: "הסר",
            saved_courses: "מספרי קורסים שנשמרו",
            disclaimer: `לידיעתך: התוסף הזה אינו קשור לאוניברסיטת בן-גוריון בנגב.
            הפרטים שלך לא נשמרים מחוץ לתוסף, הם משמשים רק למילוי אוטומטי של טופס ההתחברות באתר BGU4U.`
        }
    };

    function showToast(enMessage, hebMessage, type) {
        translations['en']['toast_message'] = enMessage;
        translations['he']['toast_message'] = hebMessage;
        apply_lang(document.documentElement.getAttribute('data-lang'));
        let toastType = type === 'success' ? 'success' : type === 'error' ? 'error' : 'other';
        // Set toast shadow color
        document.documentElement.style.setProperty('--toast-shadow-color', `var(--${toastType}-shadow-color)`);
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
    function loadOptions() {
        chrome.storage.sync.get(['user_name', 'id', 'theme', 'lang', 'saved_course_numbers', 'password'], function(result) {
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
            if (result.saved_course_numbers) {
                const courseNumbers = result.saved_course_numbers.split(',');
                courseNumbers.forEach(course_number => {
                    addCourseNumberLine(course_number);
                });
            }
        });
    }

    loadOptions();

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
    form.addEventListener('submit', async function(e) {
        e.preventDefault();

        const formData = {};
        const id = document.getElementById('id').value.trim();
        const password = document.getElementById('password').value.trim();
        const user_name = document.getElementById('user_name').value.trim();
        formData.id = id;
        formData.password = password;
        formData.user_name = user_name;

        setLoading(true);

        try {
            const tabId = await openBGUTab();
            try {
                await chrome.scripting.executeScript({
                    target: { tabId: tabId, allFrames: true },
                    func: (id, password, user_name) => {
                        window.userDetails = { id, password, user_name };
                    },
                    args: [id, password, user_name]
                });

                await chrome.scripting.executeScript({
                    target: { tabId: tabId, allFrames: true },
                    files: ["scripts/validate_user_details.js"]
                });
            } catch (error) {
                console.error('Error executing scripts:', error);
                showToast('Error executing scripts', 'שגיאה בהרצת הסקריפטים', 'error');
                chrome.tabs.remove(tabId);
                setLoading(false);
            }

            chrome.runtime.onMessage.addListener(function (message) {
                //Error handling
                if (message.type === 'LOGIN_FAILED') {
                    handleMessages('Invalid user details', 'פרטי משתמש לא תקינים', 'error');
                }
                else if (message.type === 'FORM_FIELDS_NOT_FOUND') {
                    handleMessages('Website not loaded', 'האתר לא נטען', 'error');
                }
                //Success handling
                else if (message.type === 'LOGIN_SUCCESS') {
                    handleMessages('User details saved', 'פרטי המשתמש נשמרו', 'success');
                    chrome.storage.sync.set(formData);
                }
            });

            const handleMessages = (enMessage, hebMessage, type) => {
                chrome.tabs.remove(tabId);
                setLoading(false);
                if (type === 'error') {
                    console.error(enMessage);
                } else {
                    console.log(enMessage);
                }
                showToast(enMessage, hebMessage, type);
            };
        } catch (error) {
            console.error(error);
            showToast('Error opening BGU tab', 'שגיאה בפתיחת הטאב', 'error');
            setLoading(false);
        }
    });

    function setLoading(loading) {
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
            showToast('Invalid course number', 'מספר קורס לא תקין', 'error');
            return;
        }

        try {
            const result = await chrome.storage.sync.get(['saved_course_numbers']);
            const courseNumbers = result.saved_course_numbers ? result.saved_course_numbers.split(',') : [];

            if (courseNumbers.includes(NewCourseNumberInput.value)) {
                showToast('Course number already exists', 'מספר הקורס כבר קיים', 'error');
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
            showToast('Course number added', 'מספר הקורס נוסף', 'success');

        } catch (error) {
            console.error('Error handling course submission:', error);
            showToast('Error saving course', 'שגיאה בשמירת הקורס', 'error');
        }
    }

    addCourseButton.addEventListener('click', function(e) {
        handleNewCourseSubmission(e);
    });

    function addCourseNumberLine(course_number) {
        // Get or create courses form
        let coursesForm = document.getElementById("courses_form");
        if (!coursesForm) {
            // Create fieldset container
            const coursesFieldset = document.createElement("fieldset");
            coursesFieldset.id = "courses_fieldset";

            // Create legend
            const coursesLegend = document.createElement("legend");
            coursesLegend.setAttribute('data-i18n', 'saved_courses');
            coursesLegend.textContent = translations[document.documentElement.getAttribute('data-lang')]['saved_courses'];

            // Create form container
            coursesForm = document.createElement("div");
            coursesForm.id = "courses_form";
            coursesForm.setAttribute("role", "form");
            coursesForm.setAttribute("aria-label", "Courses selection form");

            // Assemble structure
            coursesFieldset.appendChild(coursesLegend);
            coursesFieldset.appendChild(coursesForm);
            form.insertBefore(coursesFieldset, form.children[-1]);
        }

        // Create line container
        const lineContainer = document.createElement("div");
        lineContainer.className = "course_line";

        // Create course number box
        const courseNumberInput = document.createElement("input");
        courseNumberInput.type = "text";
        courseNumberInput.value = course_number;
        courseNumberInput.disabled = true;
        courseNumberInput.className = "course_number_input";
        courseNumberInput.style.textAlign = 'center';
        courseNumberInput.id = "course_number_input" + course_number;

        // Create remove button
        const removeCourseButton = document.createElement("button");
        removeCourseButton.setAttribute('data-i18n', 'remove_course_button');
        removeCourseButton.textContent = removeButtonText;
        removeCourseButton.className = "remove_course_button";
        removeCourseButton.id = "remove_course_button" + course_number;

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

    // Handle enter key press on course number input
    NewCourseNumberInput.addEventListener('keyup', function (event) {
        if (event.key === 'Enter' && !addCourseButton.disabled) {
            event.preventDefault();
            handleNewCourseSubmission(event);
        }
    });

    // Prevent form submission on enter key press in course number input
    form.addEventListener('keydown', function (event) {
        if (event.key === 'Enter' && document.activeElement === NewCourseNumberInput) {
            event.preventDefault(); // Prevent form submission
        }
    });
});

document.getElementById("forgot_password").addEventListener("click", function() {
    const url = "https://bgu4u.bgu.ac.il/remind/login.php";
    chrome.tabs.create({ url: url });
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
