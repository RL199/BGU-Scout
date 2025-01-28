
//check if the fields are present and then login.
const intervalId = setInterval(() => {
    if (document.querySelector('input[name="P101_X1"]')
        && document.querySelector('input[name="P101_X2"]')
        && document.querySelector('input[name="P101_X3"]')
        && document.querySelector('button[id="P101_LOGIN"]')) {
        loginUniversity();
        clearInterval(intervalId);
    }
}, 100);

// Timeout after 30 seconds
setTimeout(() => {
    clearInterval(intervalId);
    console.error('Form fields not found');
    chrome.runtime.sendMessage({
        type: 'FORM_FIELDS_NOT_FOUND'
    });
}, 30000);

async function loginUniversity() {
    const credentials = window.userDetails;

    console.log('Starting to fill form with:', credentials);

    // Set the values directly
    const setFieldValue = (fieldName, value) => {
        const field = document.querySelector(`input[name="${fieldName}"]`);
        if (field) {
            field.value = value;
            // Trigger events to ensure form updates
            field.dispatchEvent(new Event('input', { bubbles: true }));
            field.dispatchEvent(new Event('change', { bubbles: true }));
            console.log(`Set ${fieldName} value`);
        } else {
            console.log(`Field ${fieldName} not found`);
        }
    };

    // Fill each field
    setFieldValue('P101_X1', credentials.user_name);
    setFieldValue('P101_X2', credentials.password);
    setFieldValue('P101_X3', credentials.id);

    // Click login button
    const loginButton = document.querySelector('button[id="P101_LOGIN"]');
    if (loginButton) {
        loginButton.click();
        console.log('Clicked login button');
        await chrome.storage.local.set({ allowValidation: true });
    } else {
        console.error('Login button not found');
        chrome.runtime.sendMessage({
            type: 'FORM_FIELDS_NOT_FOUND'
        });
    }
}
