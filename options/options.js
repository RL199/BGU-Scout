document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('options_form');
    const themeSelect = document.getElementById('theme');
    const toast = document.getElementById('toast');

    // Function to apply theme
    function applyTheme(theme) {
        if (theme === 'system') {
            const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            document.documentElement.setAttribute('data-theme', prefersDark ? 'dark' : 'light');
        } else {
            document.documentElement.setAttribute('data-theme', theme);
        }
    }

    // Initialize theme
    const savedTheme = localStorage.getItem('theme') || 'system';
    themeSelect.value = savedTheme;
    applyTheme(savedTheme);

    // Theme change event listener
    themeSelect.addEventListener('change', function() {
        const selectedTheme = this.value;
        applyTheme(selectedTheme);
        localStorage.setItem('theme', selectedTheme);
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

        // Simulate saving data
        console.log('Form data saved:', formData);

        // Show toast notification
        toast.classList.add('show');
        setTimeout(() => {
            toast.classList.remove('show');
        }, 3000);

        // Reset form
        form.reset();
        themeSelect.value = formData.theme; // Preserve theme selection
    });

    // Listen for system theme changes
    window.matchMedia('(prefers-color-scheme: dark)').addListener(function() {
        if (themeSelect.value === 'system') {
            applyTheme('system');
        }
    });
});



// let savedCount = 0;
// document.addEventListener('DOMContentLoaded', function() {
//     // Retrieve saved values from Chrome storage and populate the form fields
//     chrome.storage.sync.get(['user_name', 'password', 'id'], function(result) {
//         if (result.user_name) {
//             document.getElementById('user_name').value = result.user_name;
//         }
//         if (result.password) {
//             document.getElementById('password').value = result.password;
//         }
//         if (result.id) {
//             document.getElementById('id').value = result.id;
//         }
//     });
// });
// document.getElementById("options_form").addEventListener("submit", function() {
//     event.preventDefault();
//     let user_name = document.getElementById("user_name").value;
//     let password = document.getElementById("password").value;
//     let id = document.getElementById("id").value
//     if(user_name) chrome.storage.sync.set({user_name: user_name});
//     if(password) chrome.storage.sync.set({password: password});
//     if(id) chrome.storage.sync.set({id: id});

//     let existingMessage = document.getElementById("savedMessage");
//     if (existingMessage) {
//         existingMessage.remove();
//     }
//     let savedMessage = document.createElement("p");
//     savedMessage.id = "savedMessage";
//     if(!user_name && !password){
//         savedMessage.textContent = "Saved Nothing";
//     }
//     else if(savedCount >= 10){
//         savedMessage.textContent = "Saved! (I gave up counting)";
//     }
//     else {
//         savedMessage.textContent = "Saved! "+(savedCount ? "("+savedCount+")" : "");
//         savedCount++;
//     }
//     document.body.appendChild(savedMessage);
//     document.getElementById("options_form").reset();
// });
