/*
1.connect to the page of the university
2.login to the page
3.collect the primary key.

*/

function loginUniversity() {
    chrome.storage.sync.get(['user_name', 'id', 'password'], function (result) {
        //extract result credentials from storage

        const credentials = {
            username: result.user_name,
            password: result.password,
            userId: result.id
        };
        fillLoginForm(credentials);
    });
}

async function fillLoginForm(credentials) {
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
    setFieldValue('P101_X1', credentials.username);
    setFieldValue('P101_X2', credentials.password);
    setFieldValue('P101_X3', credentials.userId);

    // Click login button
    const loginButton = document.querySelector('button[id="P101_LOGIN"]');
    if (loginButton) {
        loginButton.click();
        console.log('Clicked login button');
    } else {
        console.error('Login button not found');
        chrome.runtime.sendMessage({
            type: 'P_KEY_NOT_FOUND'
        });
    }
    await chrome.storage.local.set({ allowRedirect: true });
}

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
        type: 'P_KEY_NOT_FOUND'
    });
}, 30000);
