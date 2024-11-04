document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('options_form');
    const themeSelect = document.getElementById('theme');
    const toast = document.getElementById('toast');

    // Function to apply theme
    function applyTheme(theme) {
        if (theme === 'system') {
            const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            document.documentElement.setAttribute('data_theme', prefersDark ? 'dark' : 'light');
        } else {
            document.documentElement.setAttribute('data_theme', theme);
        }
    }

    // Load saved options
    chrome.storage.sync.get(['user_name', 'id', 'theme'], function(result) {
        if (result.user_name) document.getElementById('user_name').value = result.user_name;
        if (result.id) document.getElementById('id').value = result.id;
        if (result.theme) {
            themeSelect.value = result.theme;
            applyTheme(result.theme);
        } else {
            applyTheme('system');
        }
    });

    // Theme change event listener
    themeSelect.addEventListener('change', function() {
        const selectedTheme = this.value;
        applyTheme(selectedTheme);
        chrome.storage.sync.set({ theme: selectedTheme });
    });

    // Form submission
    form.addEventListener('submit', function(e) {
        e.preventDefault();

        // Gather form data
        const formData = {
            user_name: document.getElementById('user_name').value,
            password: document.getElementById('password').value,
            id: document.getElementById('id').value,
            theme: themeSelect.value
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
        if (themeSelect.value === 'system') {
            applyTheme('system');
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
