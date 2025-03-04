chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
    chrome.tabs.remove(sender.tab.id);
});
