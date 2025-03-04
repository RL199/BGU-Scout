"use strict";

console.log('BGU4U22 Content script loaded');

if (document.readyState === 'complete' || document.readyState === 'interactive') {
    checkOnLoad();
} else {
    document.addEventListener('DOMContentLoaded', async function () {
        checkOnLoad();
    });
}

async function checkOnLoad() {
    await chrome.storage.local.get(['generatePKey', 'allowUserValidation'], function (result) {
        console.log('Checking for redirect and validation');
        if (result.generatePKey) {
            setTimeout(() => {
                chrome.runtime.sendMessage({
                    type: 'REDIRECT_FAILED'
                });
            }, 10000);

            switch (result.generatePKey) {
                case 1:
                    loginForPKey();
                    break;
                case 2:
                    checkForPKey();
                    break;
                default:
                    console.error('Invalid redirect type');
            }
        }
        if (result.allowUserValidation) {
            setTimeout(() => {
                chrome.runtime.sendMessage({
                    type: 'CONNECTION_ERROR'
                });
            }, 10000);

            switch (result.allowUserValidation) {
                case 1:
                    checkLoginToSite();
                    break;
                case 2:
                    checkIfUserLoggedIn();
                    break;
                default:
                    console.error('Invalid validation type');
            }
        }
    });
}

function checkForPKey() {
    console.log('Checking for redirect:', window.location.href);
    if (window.location.href.includes('f_login1004/home')) {
        console.log('On home page, getting session');
        const sessionMatch = window.location.href.match(/session=(\d+)/);
        if (sessionMatch) {
            const sessionId = sessionMatch[1];
            console.log('Found session:', sessionId);
            window.location.href = `https://bgu4u22.bgu.ac.il/apex/10g/r/f_kiosk1009/home?session=${sessionId}`;
        } else {
            console.error('Session not found');
            chrome.runtime.sendMessage({
                type: 'P_KEY_NOT_FOUND'
            });
        }
    } else if (window.location.href.includes('f_kiosk1009/home')) {
        console.log('On kiosk page, getting CS');
        const html = document.documentElement.innerHTML;
        const csMatch = html.match(/cs=([A-F0-9]+)/);
        if (csMatch) {
            const cs = csMatch[1];
            const sessionId = new URLSearchParams(window.location.search).get('session');
            window.location.href = `https://bgu4u22.bgu.ac.il/apex/10g/r/f_kiosk1009/22?p0_lang=he&session=${sessionId}&cs=${cs}`;
        } else {
            console.error('CS not found');
            chrome.runtime.sendMessage({
                type: 'P_KEY_NOT_FOUND'
            });
        }
    } else if (window.location.href.includes('f_kiosk1009/22')) {
        console.log('On final page, getting p_key');
        const html = document.documentElement.innerHTML;
        const pKeyMatch = html.match(/p_key=([A-Z0-9]+)/);
        if (pKeyMatch) {
            const pKey = pKeyMatch[1];
            chrome.runtime.sendMessage({
                type: 'P_KEY_FOUND',
                pKey
            });
        } else {
            console.log('P_KEY not found');
            chrome.runtime.sendMessage({
                type: 'P_KEY_NOT_FOUND'
            });
        }
    } else {
        console.error('Invalid page');
        chrome.runtime.sendMessage({
            type: 'P_KEY_NOT_FOUND'
        });
    }
}

function loginForPKey() {
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

    // Timeout after 10 seconds
    setTimeout(() => {
        clearInterval(intervalId);
        console.error('Form fields not found');
        chrome.runtime.sendMessage({
            type: 'P_KEY_NOT_FOUND'
        });
    }, 10000);

    function loginUniversity() {
        chrome.storage.local.get(['user_name', 'id', 'password'], function (result) {
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
            await chrome.storage.local.set({ generatePKey: 2 });
            loginButton.click();
            console.log('Clicked login button');
        } else {
            console.error('Login button not found');
            chrome.runtime.sendMessage({
                type: 'P_KEY_NOT_FOUND'
            });
        }
    }
}

function checkIfUserLoggedIn() {
    console.log('Validating user details');
    if (window.location.href.startsWith('https://bgu4u22.bgu.ac.il/apex/10g/r/f_login1004/home')) {
        chrome.runtime.sendMessage({
            type: 'LOGIN_SUCCESS'
        });
    } else if (window.location.href.match('https://bgu4u22.bgu.ac.il/apex/wwv_flow.accept')) {
        chrome.runtime.sendMessage({
            type: 'LOGIN_FAILED'
        });
    }
}


function checkLoginToSite() {
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

    // Timeout after 10 seconds
    setTimeout(() => {
        clearInterval(intervalId);
        console.error('Form fields not found');
        chrome.runtime.sendMessage({
            type: 'FORM_FIELDS_NOT_FOUND'
        });
    }, 10000);
}

async function loginUniversity() {
    chrome.storage.local.get(['checkedUserDetails'] ,async function (result) {
        console.log('Starting to fill form with:', result.checkedUserDetails);

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
                chrome.runtime.sendMessage({
                    type: 'FORM_FIELDS_NOT_FOUND'
                });
            }
        };

        // Fill each field
        setFieldValue('P101_X1', result.checkedUserDetails.user_name);
        setFieldValue('P101_X2', result.checkedUserDetails.password);
        setFieldValue('P101_X3', result.checkedUserDetails.id);

        // Click login button
        const loginButton = document.querySelector('button[id="P101_LOGIN"]');
        if (loginButton) {
            await chrome.storage.local.set({ allowUserValidation: 2 });
            loginButton.click();
            console.log('Clicked login button');
        } else {
            console.error('Login button not found');
            chrome.runtime.sendMessage({
                type: 'FORM_FIELDS_NOT_FOUND'
            });
        }
    });
}
