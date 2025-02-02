chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === 'P_KEY_FOUND') {
        chrome.storage.sync.set({ p_key: message.pKey }, () => {
            // Close the tab after getting p_key
            chrome.tabs.remove(sender.tab.id);
        });
    }
    else if(message.type === 'P_KEY_NOT_FOUND') {
        // Close the tab if p_key is not found
        chrome.tabs.remove(sender.tab.id);
    }
    else if(message.type === 'FORM_FIELDS_NOT_FOUND') {
        // Close the tab if form fields are not found
        chrome.tabs.remove(sender.tab.id);
    }
    else if(message.type === 'LOGIN_SUCCESS') {
        // Close the tab if login is successful
        chrome.tabs.remove(sender.tab.id);
    }
    else if(message.type === 'LOGIN_FAILED') {
        // Close the tab if login is failed
        chrome.tabs.remove(sender.tab.id);
    }
    else {
        console.error('Unknown message type:', message.type);
    }
});
