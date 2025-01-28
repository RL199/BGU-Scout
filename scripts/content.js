console.log('Content script loaded');

function checkForRedirect() {
    console.log('Checking for redirect:', window.location.href);
    if (window.location.href.includes('f_login1004/home')) {
        console.log('On home page, getting session');
        const sessionMatch = window.location.href.match(/session=(\d+)/);
        if (sessionMatch) {
            const sessionId = sessionMatch[1];
            console.log('Found session:', sessionId);
            window.location.href = `https://bgu4u22.bgu.ac.il/apex/10g/r/f_kiosk1009/home?session=${sessionId}`;
        }
    } else if (window.location.href.includes('f_kiosk1009/home')) {
        console.log('On kiosk page, getting CS');
        const html = document.documentElement.innerHTML;
        const csMatch = html.match(/cs=([A-F0-9]+)/);
        if (csMatch) {
            const cs = csMatch[1];
            const sessionId = new URLSearchParams(window.location.search).get('session');
            window.location.href = `https://bgu4u22.bgu.ac.il/apex/10g/r/f_kiosk1009/22?p0_lang=he&session=${sessionId}&cs=${cs}`;
        }
    } else if (window.location.href.includes('f_kiosk1009/22')) {
        console.log('On final page, getting p_key');
        const html = document.documentElement.innerHTML;
        const pKeyMatch = html.match(/p_key=([A-Z0-9]+)/);
        if (pKeyMatch) {
            chrome.storage.local.set({ allowRedirect: false });
            const pKey = pKeyMatch[1];
            chrome.runtime.sendMessage({
                type: 'P_KEY_FOUND',
                pKey
            });
        }
    }
}

function validateUserDetails() {
    console.log('Validating user details');
    chrome.storage.local.set({ allowValidation: false });
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

// Check page state when loaded
document.addEventListener('DOMContentLoaded', async function () {
    await chrome.storage.local.get(['allowRedirect', 'allowValidation'], function (result) {
        console.log('Checking for redirect and validation');
        if (result.allowRedirect) {
            setTimeout(() => {
                chrome.storage.local.set({ allowRedirect: false });
            }, 10000);
            checkForRedirect();
        }
        if (result.allowValidation) {
            setTimeout(() => {
                chrome.storage.local.set({ allowValidation: false });
            }, 10000);
            validateUserDetails();
        }
    });
});

