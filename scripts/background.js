chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
    chrome.tabs.remove(sender.tab.id);
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
        iconFolder = 'images/icon-blue-';
    } else if (color === '#4caf50') { // Green
        iconFolder = 'images/icon-green-';
    } else if (color === '#f44336') { // Red
        iconFolder = 'images/icon-red-';
    } else if (color === '#9c27b0') { // Purple
        iconFolder = 'images/icon-purple-';
    } else if (color === '#e91e63') { // Pink
        iconFolder = 'images/icon-pink-';
    } else {
        iconFolder = 'images/icon-'; // Default orange for all other colors
    }
    let colorName = iconFolder.replace('images/icon-', '').replace('-', '');
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
