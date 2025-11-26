chrome.runtime.onMessage.addListener(async function (message, sender, sendResponse) {
    chrome.tabs.remove(sender.tab.id);
    await chrome.storage.local.remove(['generatePKey', 'allowUserValidation']);
});

chrome.tabs.onRemoved.addListener(async function (tabId, removeInfo) {

    const storage = await chrome.storage.local.get(['generatePKeyTab', 'allowUserValidationTab']);
    if (storage.generatePKeyTab === tabId) {
        await chrome.storage.local.remove(['generatePKeyTab', 'generatePKey']);
    }
    if (storage.allowUserValidationTab === tabId) {
        chrome.runtime.sendMessage({ type: 'USER_VALIDATION_CLOSED' });
        await chrome.storage.local.remove(['allowUserValidationTab', 'allowUserValidation']);
    }
});

// Restore the user's selected icon color when the extension starts
chrome.runtime.onStartup.addListener(function () {
    restoreExtensionIcon();
});

chrome.runtime.onInstalled.addListener(function () {
    restoreExtensionIcon();
});

function restoreExtensionIcon() {
    chrome.storage.local.get(['color'], function (result) {
        if (result.color) {
            changeExtensionIcon(result.color);
        }
    });
}

function changeExtensionIcon(color) {
    let iconFolder;
    // Only change to blue icon if blue is selected, otherwise use default orange
    if (color === '#2196f3') { // Blue
        iconFolder = 'extension-icons/icon-blue-';
    } else if (color === '#4caf50') { // Green
        iconFolder = 'extension-icons/icon-green-';
    } else if (color === '#f44336') { // Red
        iconFolder = 'extension-icons/icon-red-';
    } else if (color === '#9c27b0') { // Purple
        iconFolder = 'extension-icons/icon-purple-';
    } else if (color === '#e91e63') { // Pink
        iconFolder = 'extension-icons/icon-pink-';
    } else {
        iconFolder = 'extension-icons/icon-'; // Default orange for all other colors
    }
    let colorName = iconFolder.replace('extension-icons/icon-', '').replace('-', '');
    if (!colorName) colorName = 'orange';

    chrome.action.setIcon({
        path: {
            "16": chrome.runtime.getURL(iconFolder + "16.png"),
            "32": chrome.runtime.getURL(iconFolder + "32.png"),
            "48": chrome.runtime.getURL(iconFolder + "48.png"),
            "128": chrome.runtime.getURL(iconFolder + "128.png")
        }
    }, function () {
        if (chrome.runtime.lastError) {
            console.error("Error setting ", colorName, " icon:", chrome.runtime.lastError.message);
        }
    });
}
