chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'P_KEY_FOUND') {
      chrome.storage.sync.set({ p_key: message.pKey }, () => {
          // Close the tab after getting p_key
          chrome.tabs.remove(sender.tab.id);
          // Update popup if open
          chrome.runtime.sendMessage({
              type: 'UPDATE_P_KEY',
              pKey: message.pKey
          });
      });
  }
});
