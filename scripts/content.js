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

// Check page state when loaded
document.addEventListener('DOMContentLoaded', function () {
    chrome.storage.local.get(['allowRedirect'], function (result) {
        if (result.allowRedirect) {
            setTimeout(() => {
                chrome.storage.local.set({ allowRedirect: false });
            }, 10000);
            checkForRedirect();
        }
    });
});
