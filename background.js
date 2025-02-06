chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    const validMessageTypes = [
        'P_KEY_FOUND',
        'P_KEY_NOT_FOUND',
        'FORM_FIELDS_NOT_FOUND',
        'LOGIN_SUCCESS',
        'LOGIN_FAILED',
        'VALIDATE_COURSE'
    ];

    if (validMessageTypes.includes(message.type)) {
        chrome.tabs.remove(sender.tab.id);
    }
    else {
        console.error('Unknown message type:', message.type);
    }
});
