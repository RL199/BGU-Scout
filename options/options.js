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
            course_numbers: "Saved Course Numbers:",
            header1: "Options"
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
            course_numbers: "מספרי קורסים:",
            header1: "אפשרויות"
        }
    };

    // Function to apply theme
    function apply_theme(theme) {
        if (theme === 'system') {
            const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            document.documentElement.setAttribute('data_theme', prefersDark ? 'dark' : 'light');
        } else {
            document.documentElement.setAttribute('data_theme', theme);
        }
    }

    function apply_lang(lang) {
        const prefersHebrew = window.matchMedia('(prefers-language-scheme: hebrew)').matches;
        if (lang === 'system') {
            lang = prefersHebrew ? 'he' : 'en';
        }
        document.documentElement.setAttribute('data_lang', lang);
        const elements = document.querySelectorAll('[data-i18n]');
        elements.forEach(el => {
            const key = el.getAttribute('data-i18n');
            el.textContent = translations[lang][key];
        });
    }

    // Load saved options
    chrome.storage.sync.get(['user_name', 'id', 'theme', 'lang'], function(result) {
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
    });

    // Theme change event listener
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
            lang: lang_select.value
        };

        // Save data to Chrome storage
        chrome.storage.sync.set(formData, function() {
            console.log('Options saved');

            // Show toast notification
            toast.classList.add('show');
            setTimeout(() => {
                toast.classList.remove('show');
            }, 3000);
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
    const button = document.querySelector('button');
    button.addEventListener('mousemove', (e) => {
        const rect = button.getBoundingClientRect();
        const x = e.clientX - rect.left; // x position within the element
        const y = e.clientY - rect.top;  // y position within the element

        // Calculate the percentage of the mouse position
        const percentX = x / rect.width;
        const percentY = y / rect.height;

        // Update the gradient based on mouse position
        const startColor = getComputedStyle(document.documentElement).getPropertyValue('--button-start-color').trim();
        const endColor = getComputedStyle(document.documentElement).getPropertyValue('--button-end-color').trim();
        button.style.backgroundImage = `radial-gradient(circle at ${percentX * 100}% ${percentY * 100}%, ${endColor}, ${startColor})`;
    });

    button.addEventListener('mouseleave', () => {
        button.style.backgroundImage = '';
    });
});

document.getElementById("forgot_password").addEventListener("click", function() {
    const url = "https://bgu4u.bgu.ac.il/remind/login.php";
    chrome.tabs.create({ url: url });
});
