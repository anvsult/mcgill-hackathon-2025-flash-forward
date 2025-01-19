chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "open_learning_popup") {
      chrome.action.openPopup();
    }
  });
  